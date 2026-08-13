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
}

function DeploymentsImpl({ projection }: Props) {
  const camera = useViewState((s) => s.camera);

  const sites = DEPLOYMENTS.map((site) => {
    const projected = projection([site.lon, site.lat]);
    if (!projected) return null;
    // Apply the camera by hand so the marker stays in screen space.
    const x = projected[0] * camera.k + camera.x;
    const y = projected[1] * camera.k + camera.y;
    return { site, x, y };
  }).filter((s): s is NonNullable<typeof s> => s !== null);

  if (sites.length === 0) return null;

  return (
    <g className="deployments" aria-label="IonQ sites">
      {sites.map(({ site, x, y }) => {
        const side = site.labelSide === 'left' ? -1 : 1;
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
            textAnchor={site.labelSide === 'left' ? 'end' : 'start'}
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
            textAnchor={site.labelSide === 'left' ? 'end' : 'start'}
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
