/**
 * Markers.tsx — sited points, drawn as ions held in the trap.
 *
 * ONE MARKER SYSTEM, MANY SOURCES. It draws whatever data/markers.ts holds —
 * IonQ deployments today, institutions alongside them, capitals in State 3 —
 * and a scene chooses by listing ids. §7e is explicit that a second marker
 * component must never be written; this is the component it means.
 *
 * This is the metaphor's next step, not a new idea bolted on. The borders are
 * a powered ion-trap chip; a site is an ion sitting on it. The dot is built
 * the way the brief described a trapped ion: a tight bright core inside a
 * containing ring inside a soft halo.
 *
 * WHY THE DOTS LIVE OUTSIDE THE CAMERA GROUP
 * ==========================================
 * A marker must keep a constant size on screen — an ion that swells to a
 * saucer at 8x looks like a bug. Rather than counter-scaling each dot inside
 * the zoomed <g>, the projected point is put through the camera transform by
 * hand (`x * k + tx`) and drawn in screen space. That is three multiplications
 * per site, it keeps the markers crisp at every zoom, and it means the label
 * text never scales either.
 *
 * NOTHING HERE ANIMATES AMBIENTLY. The pulsing borders are the only ambient
 * motion on this map and that rule is not worth breaking for a marker — a
 * blinking dot would compete with the one thing meant to carry the room. The
 * dots do fade in when their scene opens, which is a transition rather than
 * ambient motion, and they hold still afterwards.
 *
 * STATE 3 SEAM. Capitals become ions using exactly this component: same
 * projection-to-screen path, same visual vocabulary. When the deep-dive lands,
 * a capital marker should be this with a different data source.
 */
import { memo } from 'react';
import type { GeoProjection } from 'd3-geo';

import { resolveMarkers } from '../data/markers';
import { useViewState } from '../state/viewState';

interface Props {
  readonly projection: GeoProjection;
  readonly width: number;
  readonly height: number;
  /** Marker ids the active scene asked for, resolved against data/markers.ts. */
  readonly ids: readonly string[];
}

/**
 * Room a label needs on its side of the dot, in screen px — a little over the
 * longest string in the registry ("ARLESHEIM · FORTE ENTERPRISE") at the
 * `micro` size. Approximate on purpose: measuring text per frame would mean a
 * DOM read inside render, and the only decision it feeds is which side to put
 * the label on, where being 20px pessimistic costs nothing.
 */
const LABEL_CLEARANCE = 260;

/** A dot closer than this to the edge is not worth drawing. */
const EDGE_MARGIN = 12;

/**
 * The kinds that assert an IonQ presence, and therefore the kinds that get the
 * bright core. Everything else — an institution, a capital, a bare place — is
 * ring and halo only.
 *
 * A SET RATHER THAN A LIST OF `!==` CHECKS, because this is the line the whole
 * marker system exists to hold: the core is the claim. Adding a kind means
 * deciding, once and in one place, whether a dot of that kind says IonQ is
 * there. Get it wrong and a dot on Parliament or on a capital city starts
 * making a claim nobody checked.
 */
const IONQ_PRESENCE: ReadonlySet<string> = new Set(['network', 'system', 'engineering']);

function MarkersImpl({ projection, width, height, ids }: Props) {
  const camera = useViewState((s) => s.camera);

  const sites = resolveMarkers(ids).map((site) => {
    const projected = projection([site.lon, site.lat]);
    if (!projected) return null;
    // Apply the camera by hand so the marker stays in screen space.
    const x = projected[0] * camera.k + camera.x;
    const y = projected[1] * camera.k + camera.y;

    /*
     * EDGE HANDLING — the frame is just another label collision.
     *
     * Once a scene can carry a camera, any marker can end up near the edge of
     * the viewport, and a label that runs off the frame reads as a rendering
     * fault rather than as a marker that happens to be at the border. That
     * showed up the moment the first zoomed scene landed: at the UK camera,
     * Slovakia's dot sits inside the frame with its label hanging over the
     * right edge.
     *
     * The rule is the one §7e already states for markers that collide with
     * each other: FLIP THE LABEL, NEVER MOVE THE DOT. The dot is where the
     * deployment is, so it stays put and the text goes to whichever side has
     * room. Only when the dot itself is off-frame is the marker dropped, and
     * then nothing is lost — it was outside the viewport anyway.
     *
     * This also means a hand-set `labelSide` is a preference rather than a
     * promise: it is honoured whenever it fits, which at the fitted frame is
     * always, so nothing about the existing scenes changes.
     */
    if (x < EDGE_MARGIN || x > width - EDGE_MARGIN) return null;
    if (y < EDGE_MARGIN || y > height - EDGE_MARGIN) return null;

    const prefersLeft = site.labelSide === 'left';
    const fitsLeft = x - LABEL_CLEARANCE >= 0;
    const fitsRight = x + LABEL_CLEARANCE <= width;
    // Keep the declared side unless it does not fit and the other one does.
    const left = prefersLeft ? !(!fitsLeft && fitsRight) : !fitsRight && fitsLeft;

    return { site, x, y, left };
  }).filter((s): s is NonNullable<typeof s> => s !== null);

  if (sites.length === 0) return null;

  return (
    <g className="markers" aria-label="Marked sites">
      {sites.map(({ site, x, y, left }) => {
        const side = left ? -1 : 1;
        /*
         * The second line, and the two ways it can be empty.
         *
         * A site-level marker names its place because that is what it is
         * asserting — but a capital's label IS its place, and "Rome · Capital"
         * under a label reading "Rome" is the map talking to itself. So the
         * place is dropped when the label already carries it, and the line is
         * not rendered at all when nothing is left to say, which is the case
         * for a bare place like Salisbury.
         */
        const detail =
          site.precision === 'site' && site.detail && site.place !== site.label
            ? `${site.place} · ${site.detail}`
            : (site.detail ?? (site.place === site.label ? '' : site.place));
        return (
        <g
          key={site.id}
          className={`marker marker-${site.kind}`}
          transform={`translate(${x},${y + (site.labelDy ?? 0)})`}
        >
          {/* Halo, ring, core — the ion, from the outside in. */}
          <circle className="marker-halo" r={11} />
          <circle className="marker-ring" r={5.5} />
          {/*
            THE CORE IS THE IonQ CLAIM, so only an IonQ site gets one. A seat
            of government, a capital city and a bare place are all places the
            talk points at rather than places IonQ occupies, and with every
            marker drawn identically a dot on Westminster beside a dot on
            Oxford would say otherwise. Ring and halo without the bright core
            reads as a trap site with no ion in it, which is exactly what it
            is — and it separates on shape rather than on a second hue, the
            same reasoning as the hatched layer tier in §7b.
          */}
          {IONQ_PRESENCE.has(site.kind) ? <circle className="marker-core" r={2} /> : null}

          {/* A short leader out to the label, so the text never sits on the
              dot and obscures the thing it is pointing at. */}
          <line
            className="marker-leader"
            x1={7 * side}
            y1={-7}
            x2={15 * side}
            y2={-15}
          />
          <text
            className="marker-label"
            x={18 * side}
            y={-16}
            textAnchor={left ? 'end' : 'start'}
          >
            {site.label}
          </text>
          {/*
            A country-level marker does not name a city. Printing "WARSAW"
            under a dot that means "Poland" claims a precision the data does
            not have — the QKD networks are national and have no single point.
            Site-level markers do name their place, because that is exactly
            what they are asserting.
          */}
          {detail ? (
            <text
              className="marker-detail"
              x={18 * side}
              y={-5}
              textAnchor={left ? 'end' : 'start'}
            >
              {detail}
            </text>
          ) : null}
        </g>
        );
      })}
    </g>
  );
}

export const Markers = memo(MarkersImpl);
