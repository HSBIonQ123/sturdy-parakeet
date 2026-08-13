/**
 * projection.ts — the camera's optics.
 *
 * EQUAL-AREA IS A REQUIREMENT, NOT A PREFERENCE. Equal Earth preserves area,
 * so Africa reads at its true size relative to Europe. Mercator inflates
 * Europe against Africa by roughly a factor of fourteen at the extremes, which
 * is not defensible in a room where the subject is African partnerships. Do
 * not substitute a conformal projection here for convenience — every other
 * decision in this file is negotiable and this one is not.
 *
 * Rotation is [-20, 0]: the central meridian sits at 20E, which is the
 * longitudinal centre of the EMEA frame. That keeps shear symmetric across the
 * region instead of dumping it all on the Gulf.
 */
import { geoEqualEarth, geoPath, geoGraticule } from 'd3-geo';
import type { GeoProjection, GeoPath } from 'd3-geo';
import type { Feature, MultiPoint } from 'geojson';

/** Central meridian, degrees east. The projection rotates by its negation. */
export const CENTRAL_MERIDIAN = 20;

/**
 * The EMEA frame, as an explicit bounding box rather than a fit to the extent
 * of in-scope features.
 *
 * Fitting to features would let outliers dictate the composition: the Azores
 * sit at 31W and Mauritius at 57E, so an automatic fit would pull the frame
 * wide and shrink the European and African landmasses that the talk is
 * actually about. This box is a composition decision.
 *
 * Coverage check: Iceland (24W, 66N), Nordkapp (71N), Cabo Verde (25W),
 * Cape Agulhas (35S), Oman (60E), Mauritius (57E) are all inside. The Azores
 * fall outside and are clipped by the viewport, as are the Americas and Asia.
 */
export const EMEA_FRAME = {
  west: -26,
  east: 66,
  south: -37,
  north: 72,
} as const;

/**
 * The frame as a densified point set.
 *
 * A MultiPoint, NOT a Polygon — and that is not a stylistic choice. d3-geo
 * treats a polygon ring as a SPHERICAL polygon whose interior is the region to
 * the left of the ring. Get the winding wrong, or hand it a ring that d3
 * resolves as enclosing a pole, and `fitExtent` silently fits the complement:
 * the whole globe. That failure is not an error, it just quietly renders a
 * world map where you asked for a region. A point set has no interior and no
 * winding, so its bounds are unambiguous.
 *
 * Densification matters for a second reason: `fitExtent` projects only the
 * vertices it is given, so sampling only the four corners would miss the
 * outward bulge of the parallels and crop the north and south edges.
 */
export function frameFeature(stepDegrees = 2): Feature<MultiPoint> {
  const { west, east, south, north } = EMEA_FRAME;
  const points: [number, number][] = [];
  for (let lon = west; lon <= east; lon += stepDegrees) {
    points.push([lon, south], [lon, north]);
  }
  for (let lat = south; lat <= north; lat += stepDegrees) {
    points.push([west, lat], [east, lat]);
  }
  return {
    type: 'Feature',
    properties: {},
    geometry: { type: 'MultiPoint', coordinates: points },
  };
}

export const PROJECTION_NAME = 'EQUAL-EARTH';

export interface Optics {
  readonly projection: GeoProjection;
  readonly path: GeoPath;
  /** Projected pixel bounds of the EMEA frame, for the zoom translate extent. */
  readonly frameBounds: [[number, number], [number, number]];
}

/**
 * Build the projection fitted to a viewport.
 *
 * `padding` is a fraction of the smaller viewport dimension. EMEA is a tall
 * region and presentation displays are wide, so the fitted map is
 * height-constrained and leaves margins at left and right. That is the
 * intended composition: the title plate and the readout live in those margins
 * and never overlap the landmass.
 */
export function buildOptics(width: number, height: number, padding = 0.035): Optics {
  const pad = Math.min(width, height) * padding;
  const projection = geoEqualEarth().rotate([-CENTRAL_MERIDIAN, 0]);

  projection.fitExtent(
    [
      [pad, pad],
      [Math.max(pad + 1, width - pad), Math.max(pad + 1, height - pad)],
    ],
    frameFeature(),
  );

  const path = geoPath(projection);
  const bounds = path.bounds(frameFeature());

  return { projection, path, frameBounds: bounds };
}

/** 10-degree graticule. Static, and deliberately the quietest thing on screen. */
export function graticule(stepDegrees: number) {
  return geoGraticule().step([stepDegrees, stepDegrees]);
}

/** Camera limits. Clamped ~1x to 8x per the brief. */
export const ZOOM_EXTENT: [number, number] = [1, 8];
