/**
 * BorderMesh.tsx — the signature element. National borders as live electrode
 * traces on a powered ion-trap chip.
 *
 * THE LAYER SEPARATION, and why it is not negotiable
 * ==================================================
 * Every internal border is shared by two countries. If borders were the
 * strokes of the filled polygons, each one would be painted twice, and two
 * overlapping animated pulses would visibly double up and drift out of phase.
 * So country polygons carry no stroke at all (see CountryPath.tsx) and every
 * boundary on this map is drawn exactly once, from a mesh built in atlas.ts by
 * arc ownership.
 *
 * WHAT IS ON SCREEN, bottom to top
 * ================================
 *   1. out-of-scope coastline   neutral, 25%          static
 *   2. out-of-scope borders     border-base, 25%      static
 *   3. glow                     one shared blur       static
 *   4. in-scope coastline       neutral               static
 *   5. base                     the unpowered conductor, always lit
 *   6. de facto lines           dashed hairline       static
 *   7. pulse x3                 the travelling charge          <- the only motion
 *
 * That is nine path elements for roughly two thousand border segments. The
 * count does not grow with the data.
 *
 * PERFORMANCE
 * ===========
 * The `feGaussianBlur` is applied to the STATIC glow layer only. A filter on
 * an animated element re-rasterises every frame and will not hold 60fps across
 * a mesh this size. The pulse gets its bloom from stacked strokes instead,
 * which costs nothing. Do not "improve" this by adding a filter to .pulse.
 *
 * Everything that animates is `stroke-dashoffset`, which is compositable, and
 * the pulse layers are `pointer-events: none` so all hit-testing stays on the
 * country fills underneath.
 */
import { memo, useEffect, useMemo, useState } from 'react';
import type { GeoPath } from 'd3-geo';
import type { CSSProperties } from 'react';

import { BORDERS, NETWORK_ARCS, meshOfArcs, outlineOf } from '../data/atlas';
import { borderConfig } from './borderConfig';
import { useViewState } from '../state/viewState';
import type { Alpha3 } from '../data/iso';

export const GLOW_FILTER_ID = 'border-glow';

interface Props {
  readonly path: GeoPath;
}

function BorderMeshImpl({ path }: Props) {
  const booted = useViewState((s) => s.booted);
  const reducedMotion = useViewState((s) => s.reducedMotion);

  // Path strings depend only on the projection, so they are computed once per
  // resize and never on hover, selection or camera change.
  const d = useMemo(
    () => ({
      coastline: path(BORDERS.coastline) ?? '',
      coastlineOutOfScope: path(BORDERS.coastlineOutOfScope) ?? '',
      network: path(BORDERS.network) ?? '',
      deFacto: path(BORDERS.deFacto) ?? '',
      outOfScope: path(BORDERS.outOfScope) ?? '',
    }),
    [path],
  );

  const booting = borderConfig.boot.enabled && !booted && !reducedMotion;

  const groupClass = [
    'borders',
    booting ? 'is-booting' : null,
    reducedMotion ? 'is-static' : null,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <g className={groupClass}>
      <path className="border-oos-coast" d={d.coastlineOutOfScope} />
      <path className="border-oos" d={d.outOfScope} />

      <path className="border-glow" d={d.network} filter={`url(#${GLOW_FILTER_ID})`} />

      <path className="border-coast" d={d.coastline} />
      <path className="border-base" d={d.network} />
      <path className="border-defacto" d={d.deFacto} />

      {/*
        attenuate (one-shot, settles the map once you start speaking) wraps
        breathe (slow infinite oscillation) wraps the travelling charge. Three
        separate opacity animations on three nested groups multiply cleanly;
        putting them on one element would make them fight.
      */}
      <g className="pulse-attenuate">
        <g className="pulse-breathe">
          {borderConfig.pulseProfile.map((layer, i) => (
            <path
              key={i}
              className="pulse"
              d={d.network}
              style={
                {
                  '--w': layer.width,
                  '--o': layer.opacity,
                  '--dash': `var(--pulse-${i}-dash)`,
                  '--boot-dash': `var(--pulse-${i}-boot-dash)`,
                  '--phase': `var(--pulse-${i}-phase)`,
                  '--end': `var(--pulse-${i}-end)`,
                } as CSSProperties
              }
            />
          ))}
        </g>
      </g>

      <ArcFlash path={path} />
    </g>
  );
}

export const BorderMesh = memo(BorderMeshImpl);

/* ------------------------------------------------------------------ *
 * Arc flash — optional, off by default.
 *
 * One randomly chosen border segment spikes to near-white, like a discharge,
 * then fades. Exactly one at a time, never more. Implemented as a single
 * extra path built from one arc index, so it costs one element and one short
 * animation regardless of how long it runs.
 * ------------------------------------------------------------------ */

function ArcFlash({ path }: { readonly path: GeoPath }) {
  const reducedMotion = useViewState((s) => s.reducedMotion);
  const enabled = borderConfig.arcFlash.enabled && !reducedMotion;
  const [arc, setArc] = useState<number | null>(null);

  useEffect(() => {
    if (!enabled || NETWORK_ARCS.length === 0) return;
    const tick = window.setInterval(() => {
      setArc(NETWORK_ARCS[Math.floor(Math.random() * NETWORK_ARCS.length)]);
      window.setTimeout(
        () => setArc(null),
        borderConfig.arcFlash.durationSeconds * 1000,
      );
    }, borderConfig.arcFlash.intervalSeconds * 1000);
    return () => window.clearInterval(tick);
  }, [enabled]);

  const d = useMemo(() => (arc == null ? '' : path(meshOfArcs([arc])) ?? ''), [arc, path]);
  if (!enabled || arc == null) return null;
  return <path className="border-flash" d={d} />;
}

/* ------------------------------------------------------------------ *
 * Hover and selection outline.
 *
 * The problem: with every border on the map already orange and pulsing, a
 * hover bloom in the same hue has almost no contrast left to work with.
 *
 * The resolution is luminance and STILLNESS, not hue. The hovered country's
 * own outline is drawn on top of the network as its own path, and underneath
 * it sits a wider stroke in the base colour that OCCLUDES the travelling pulse
 * along exactly those segments. So the hovered outline is both the brightest
 * and the only motionless boundary on screen — and stillness is the contrast
 * that survives when everything else is already orange.
 *
 * Two elements, created on demand. Nothing is attached to the other 238 paths.
 * ------------------------------------------------------------------ */

function OutlineImpl({
  path,
  iso,
  variant,
}: {
  readonly path: GeoPath;
  readonly iso: Alpha3;
  readonly variant: 'hover' | 'select';
}) {
  const d = useMemo(() => {
    const outline = outlineOf(iso);
    return outline ? path(outline) ?? '' : '';
  }, [iso, path]);

  if (!d) return null;
  return (
    <g className={`outline outline-${variant}`} aria-hidden>
      <path className="outline-under" d={d} />
      <path className="outline-line" d={d} />
    </g>
  );
}

const Outline = memo(OutlineImpl);

/** Renders the selection outline and, when different, the hover outline. */
export function ActiveOutlines({ path }: Props) {
  const hoveredIso = useViewState((s) => s.hoveredIso);
  const selectedIso = useViewState((s) => s.selectedIso);

  return (
    <>
      {selectedIso ? <Outline path={path} iso={selectedIso} variant="select" /> : null}
      {hoveredIso && hoveredIso !== selectedIso ? (
        <Outline path={path} iso={hoveredIso} variant="hover" />
      ) : null}
    </>
  );
}
