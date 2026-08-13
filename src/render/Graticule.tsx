/**
 * Graticule.tsx — 10-degree grid.
 *
 * Static, neutral, and very low opacity. It exists to say "this is a
 * projection, not a picture" and to give the eye a frame of reference at zoom.
 * It must never compete with the borders: the pulse is the only ambient motion
 * on this map, and a graticule that reads at all strongly turns the instrument
 * into graph paper.
 *
 * One path element for the whole grid.
 */
import { memo } from 'react';
import type { GeoPath } from 'd3-geo';
import { graticule } from './projection';
import { borderConfig } from './borderConfig';

interface Props {
  readonly path: GeoPath;
}

function GraticuleImpl({ path }: Props) {
  const d = path(graticule(borderConfig.graticule.stepDegrees)()) ?? '';
  return <path className="graticule" d={d} />;
}

export const Graticule = memo(GraticuleImpl);
