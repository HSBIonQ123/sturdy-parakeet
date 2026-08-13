/**
 * Deployments.tsx — IonQ sites, drawn as ions held in the trap.
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

import { DEPLOYMENTS } from '../data/deployments';
import { useViewState } from '../state/viewState';

interface Props {
  readonly projection: GeoProjection;
  readonly width: number;
  readonly height: number;
}

/**
 * Room a label needs on its side of the dot, in screen px — a little over the
 * longest string in deployments.ts ("ARLESHEIM · FORTE ENTERPRISE") at the
 * `micro` size. Approximate on purpose: measuring text per frame would mean a
 * DOM read inside render, and the only decision it feeds is which side to put
 * the label on, where being 20px pessimistic costs nothing.
 */
const LABEL_CLEARANCE = 260;

/** A dot closer than this to the edge is not worth drawing. */
const EDGE_MARGIN = 12;

function DeploymentsImpl({ projection, width, height }: Props) {
  const camera = useViewState((s) => s.camera);

  const sites = DEPLOYMENTS.map((site) => {
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
    <g className="deployments" aria-label="IonQ sites">
      {sites.map(({ site, x, y, left }) => {
        const side = left ? -1 : 1;
        return (
        <g
          key={site.id}
          className="deployment"
          transform={`translate(${x},${y + (site.labelDy ?? 0)})`}
        >
          {/* Halo, ring, core — the ion, from the outside in. */}
          <circle className="deployment-halo" r={11} />
          <circle className="deployment-ring" r={5.5} />
          <circle className="deployment-core" r={2} />

          {/* A short leader out to the label, so the text never sits on the
              dot and obscures the thing it is pointing at. */}
          <line
            className="deployment-leader"
            x1={7 * side}
            y1={-7}
            x2={15 * side}
            y2={-15}
          />
          <text
            className="deployment-label"
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
          <text
            className="deployment-detail"
            x={18 * side}
            y={-5}
            textAnchor={left ? 'end' : 'start'}
          >
            {site.precision === 'site' && site.detail
              ? `${site.place} · ${site.detail}`
              : (site.detail ?? site.place)}
          </text>
        </g>
        );
      })}
    </g>
  );
}

export const Deployments = memo(DeploymentsImpl);
