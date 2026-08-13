/**
 * Map.tsx — the map surface.
 *
 * REACT OWNS THE DOM. D3 is used for maths only: `d3-geo` produces path
 * strings, `d3-zoom` produces transform values. Nothing in d3 appends,
 * removes or restyles an element inside this tree. The one place d3 touches
 * the DOM at all is `d3-zoom` binding wheel and pointer listeners to the
 * <svg>, which is how the library is designed to be used; it writes only its
 * own `__zoom` property and never modifies markup.
 *
 * PANNING AND ZOOMING MOVE A <g>, THEY DO NOT RE-PROJECT.
 * Re-running `geoPath` over 238 1:50m MultiPolygons on every wheel tick would
 * not come close to 60fps. Instead the camera is a CSS-space transform on one
 * group, and the border layers use `vector-effect: non-scaling-stroke` so
 * hairlines stay hairlines at 8x. That has a second benefit: stroke geometry
 * resolves in screen space, so the pulse keeps a constant apparent length and
 * speed at every zoom level instead of stretching into streaks.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { select } from 'd3-selection';
// Imported for its side effect: it augments d3-selection with .transition(),
// which the camera reset uses. Not referenced directly.
import 'd3-transition';
import { zoom as d3zoom, zoomIdentity, type D3ZoomEvent, type ZoomBehavior } from 'd3-zoom';

import { IN_SCOPE_COUNTRIES, OUT_OF_SCOPE_COUNTRIES } from '../data/atlas';
import { useViewState } from '../state/viewState';
import { buildOptics, ZOOM_EXTENT } from './projection';
import { borderConfig } from './borderConfig';
import { BorderMesh, ActiveOutlines, GLOW_FILTER_ID } from './BorderMesh';
import { layerPatternId } from './resolveCountryStyle';
import { LAYERS } from '../data/layers';
import { palette, withAlpha } from './palette';
import { CountryPath } from './CountryPath';
import { Graticule } from './Graticule';
import { KeyHints } from './Chrome';
import { registerCamera } from './cameraControl';
import { DECK } from '../scenes/deck';

declare global {
  interface Window {
    /** See `focusOn` below. State 3's camera entry point. */
    __focus?: (lon: number, lat: number, k: number) => void;
  }
}

const VIGNETTE_ID = 'centre-vignette';
/** Hatch tile size and stroke, in screen pixels. */
const HATCH_TILE = 6;
const HATCH_STROKE = 1.7;
const VIEWPORT_CLIP_ID = 'viewport-clip';

export function Map() {
  const hostRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const zoomRef = useRef<ZoomBehavior<SVGSVGElement, unknown> | null>(null);

  const [size, setSize] = useState({ width: 0, height: 0 });

  const camera = useViewState((s) => s.camera);
  const setCamera = useViewState((s) => s.setCamera);
  const select_ = useViewState((s) => s.select);
  const setHovered = useViewState((s) => s.setHovered);
  const finishBoot = useViewState((s) => s.finishBoot);
  const nextScene = useViewState((s) => s.nextScene);
  const prevScene = useViewState((s) => s.prevScene);
  const gotoScene = useViewState((s) => s.gotoScene);
  const toggleMenu = useViewState((s) => s.toggleMenu);
  const closeMenu = useViewState((s) => s.closeMenu);

  /* ---- viewport size ------------------------------------------------ */
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width: Math.round(width), height: Math.round(height) });
    });
    ro.observe(host);
    return () => ro.disconnect();
  }, []);

  /* ---- optics ------------------------------------------------------- */
  const optics = useMemo(
    () => (size.width > 0 && size.height > 0 ? buildOptics(size.width, size.height) : null),
    [size.width, size.height],
  );

  /**
   * Path strings for the country fills. Computed once per projection change.
   * This is the expensive call in the whole application — it must never be
   * reachable from a hover, a selection or a camera move.
   */
  const countryPaths = useMemo<Record<string, string>>(() => {
    if (!optics) return {};
    const out: Record<string, string> = {};
    for (const c of [...OUT_OF_SCOPE_COUNTRIES, ...IN_SCOPE_COUNTRIES]) {
      out[c.iso] = optics.path(c.feature) ?? '';
    }
    return out;
  }, [optics]);

  /* ---- camera ------------------------------------------------------- */
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || size.width === 0) return;

    const behaviour = d3zoom<SVGSVGElement, unknown>()
      .scaleExtent(ZOOM_EXTENT)
      // Constrain translation to the fitted frame so the map cannot be lost
      // off-screen. At 1x this pins the camera entirely, which is correct:
      // the composition is the composition until you choose to zoom.
      .translateExtent([
        [0, 0],
        [size.width, size.height],
      ])
      .on('zoom', (event: D3ZoomEvent<SVGSVGElement, unknown>) => {
        const { k, x, y } = event.transform;
        setCamera({ k, x, y });
      });

    zoomRef.current = behaviour;
    select(svg).call(behaviour);
    return () => {
      select(svg).on('.zoom', null);
    };
  }, [size.width, size.height, setCamera]);

  const resetCamera = useCallback(() => {
    const svg = svgRef.current;
    const behaviour = zoomRef.current;
    if (!svg || !behaviour) return;
    // Drive the reset through d3 so its internal transform stays in sync with
    // the store. Setting the store directly would desync the next wheel event.
    select(svg).transition().duration(420).call(behaviour.transform, zoomIdentity);
  }, []);

  /**
   * Move the camera to a geographic point at a given scale.
   *
   * STATE 3 SEAM. "Zoom to a capital" is exactly this call with a capital's
   * coordinates, so the deep-dive view needs no new camera code — only a
   * caller. Exposed on `window.__focus` so scripts/verify.mjs can drive the
   * camera to the small states and enclaves without synthesising wheel events.
   */
  const focusOn = useCallback(
    (lon: number, lat: number, k: number) => {
      const svg = svgRef.current;
      const behaviour = zoomRef.current;
      if (!svg || !behaviour || !optics) return;
      const projected = optics.projection([lon, lat]);
      if (!projected) return;
      const [px, py] = projected;
      const target = zoomIdentity
        .translate(size.width / 2, size.height / 2)
        .scale(k)
        .translate(-px, -py);
      // Through d3 so its internal transform stays authoritative; the
      // translateExtent clamp applies automatically.
      select(svg).transition().duration(700).call(behaviour.transform, target);
    },
    [optics, size.width, size.height],
  );

  useEffect(() => {
    window.__focus = focusOn;
    return () => {
      delete window.__focus;
    };
  }, [focusOn]);

  // Hand the camera to the scene sequencer. d3 stays authoritative for what
  // the transform actually is; scenes only ask for positions.
  useEffect(
    () => registerCamera({ focus: focusOn, reset: resetCamera }),
    [focusOn, resetCamera],
  );

  /* ---- boot sequence ------------------------------------------------ */
  useEffect(() => {
    if (!borderConfig.boot.enabled) {
      finishBoot();
      return;
    }
    const timer = window.setTimeout(finishBoot, borderConfig.boot.durationSeconds * 1000);
    return () => window.clearTimeout(timer);
  }, [finishBoot]);

  /* ---- keyboard ----------------------------------------------------- */
  const [hintsVisible, setHintsVisible] = useState(true);

  useEffect(() => {
    /**
     * PRESENTER KEYS.
     *
     * Page Down / Page Up are first because that is what a presentation
     * remote actually sends — almost every clicker emulates exactly those two
     * keys, and nothing else. Arrows and Space are the same commands for when
     * you are at the machine. A clicker can only say "next", which is why the
     * deck is an ordered walk and why the menu exists for questions.
     */
    const onKey = (e: KeyboardEvent) => {
      // Any key skips the boot sequence. It is an opener, not an obstacle.
      finishBoot();
      setHintsVisible(false);

      const menuIsOpen = useViewState.getState().menuOpen;

      // Space and Enter belong to whatever control has focus. Stepping the
      // deck as well would fire two actions from one press.
      const target = e.target as HTMLElement | null;
      const onControl =
        target instanceof HTMLElement &&
        (target.tagName === 'BUTTON' || target.isContentEditable);

      if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        toggleMenu();
        return;
      }

      if (e.key === 'Escape') {
        // Esc is layered: close the menu first, and only clear the selection
        // once there is no menu to close.
        if (menuIsOpen) closeMenu();
        else {
          select_(null);
          setHovered(null);
        }
        return;
      }

      // With the menu open it owns navigation, or opening it would step the
      // deck underneath the list you are reading.
      if (menuIsOpen) return;

      switch (e.key) {
        case 'PageDown':
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault();
          nextScene();
          return;
        case 'PageUp':
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          prevScene();
          return;
        case ' ':
          if (onControl) return;
          e.preventDefault();
          nextScene();
          return;
        case 'Home':
          e.preventDefault();
          gotoScene(0);
          return;
        case 'End':
          e.preventDefault();
          gotoScene(DECK.length - 1);
          return;
        default:
          break;
      }

      if (e.key === 'r' || e.key === 'R') {
        resetCamera();
      } else if (e.key === 'f' || e.key === 'F') {
        if (document.fullscreenElement) void document.exitFullscreen();
        else void document.documentElement.requestFullscreen();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [
    finishBoot,
    resetCamera,
    select_,
    setHovered,
    nextScene,
    prevScene,
    gotoScene,
    toggleMenu,
    closeMenu,
  ]);

  /* ---- cursor auto-hide --------------------------------------------- */
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let timer = 0;
    const show = () => {
      host.classList.remove('cursor-hidden');
      window.clearTimeout(timer);
      timer = window.setTimeout(() => host.classList.add('cursor-hidden'), 3000);
    };
    show();
    host.addEventListener('pointermove', show);
    return () => {
      host.removeEventListener('pointermove', show);
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <div className="map-host" ref={hostRef}>
      <svg
        ref={svgRef}
        className="map"
        width={size.width}
        height={size.height}
        viewBox={`0 0 ${size.width} ${size.height}`}
        role="img"
        aria-label="Interactive map of Europe, the Middle East and Africa"
        onClick={() => {
          finishBoot();
          select_(null);
        }}
      >
        <defs>
          {/*
            THE ONLY FILTER IN THE DOCUMENT. Shared by one static path. It is
            never attached to an animated element, and never to the 238 country
            paths — per-element filters at that count destroy the frame rate.
          */}
          <filter id={GLOW_FILTER_ID} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation={borderConfig.glowRadius} />
          </filter>

          <clipPath id={VIEWPORT_CLIP_ID}>
            <rect x={0} y={0} width={size.width} height={size.height} />
          </clipPath>

          {/*
            One <pattern> per hatched layer, generated from whatever LAYERS
            declares. Generic infrastructure, not layer-specific code: a future
            hatched layer gets its pattern here without an edit.

            patternTransform counter-scales the camera so the hatch stays a
            constant size on screen. Without it the stripes would grow with the
            map and read as wide bands at 8x.
          */}
          {LAYERS.filter((l) => l.fillPattern === 'hatch').map((layer) => {
            const accent = layer.accent ?? palette.ionq;
            return (
              <pattern
                key={layer.id}
                id={layerPatternId(layer.id)}
                width={HATCH_TILE}
                height={HATCH_TILE}
                patternUnits="userSpaceOnUse"
                patternTransform={`scale(${1 / camera.k}) rotate(45)`}
              >
                {/* A faint solid ground under the stripes, so a hatched country
                    still reads as lit rather than as a striped hole. */}
                <rect
                  width={HATCH_TILE}
                  height={HATCH_TILE}
                  fill={withAlpha(accent, 0.07)}
                />
                <line
                  x1={0}
                  y1={0}
                  x2={0}
                  y2={HATCH_TILE}
                  stroke={accent}
                  strokeOpacity={0.55}
                  strokeWidth={HATCH_STROKE}
                />
              </pattern>
            );
          })}

          <radialGradient id={VIGNETTE_ID} cx="50%" cy="48%" r="78%">
            <stop offset="0%" stopColor="#000" stopOpacity="0" />
            <stop offset="58%" stopColor="#000" stopOpacity="0" />
            <stop offset="100%" stopColor="#000" stopOpacity="0.5" />
          </radialGradient>
        </defs>

        <rect className="canvas" x={0} y={0} width={size.width} height={size.height} />

        {optics ? (
          <g clipPath={`url(#${VIEWPORT_CLIP_ID})`}>
            <g transform={`translate(${camera.x},${camera.y}) scale(${camera.k})`}>
              <Graticule path={optics.path} />

              {/*
                Out-of-scope first, so in-scope countries sit above them for
                hit-testing along the scope boundary.
              */}
              {OUT_OF_SCOPE_COUNTRIES.map((c) => (
                <CountryPath
                  key={c.iso}
                  iso={c.iso}
                  name={c.name}
                  inScope={false}
                  d={countryPaths[c.iso] ?? ''}
                />
              ))}
              {IN_SCOPE_COUNTRIES.map((c) => (
                <CountryPath
                  key={c.iso}
                  iso={c.iso}
                  name={c.name}
                  inScope
                  d={countryPaths[c.iso] ?? ''}
                />
              ))}

              <BorderMesh path={optics.path} />
              <ActiveOutlines path={optics.path} />
            </g>
          </g>
        ) : null}

        {/* Outside the camera group: the vignette is a property of the frame,
            not of the map, so it must not pan or scale. */}
        <rect
          className="vignette"
          x={0}
          y={0}
          width={size.width}
          height={size.height}
          fill={`url(#${VIGNETTE_ID})`}
        />
      </svg>

      <KeyHints visible={hintsVisible} />
    </div>
  );
}
