/**
 * atlas.ts — loads the topology once and derives everything geometric.
 *
 * This module runs at import time and is the only place topojson is touched.
 * Everything downstream receives plain GeoJSON and alpha-3 codes.
 *
 * THE BORDER PARTITION — the reason this file does not simply call
 * `topojson.mesh` twice
 * =====================================================================
 * The brief's approach was interior = mesh(a !== b), exterior = mesh(a === b).
 * That is correct as far as it goes, and it does solve double-drawing. It
 * cannot express two things this map needs:
 *
 *   1. Scope. Out-of-scope borders must be dim and static while in-scope
 *      borders pulse. A single mesh is a single path with a single stroke, so
 *      it cannot carry two treatments.
 *   2. Disputed lines. De facto boundaries must be dashed. Same problem.
 *
 * And it has one outright bug for us: after Crimea is reassigned to Ukraine,
 * the Perekop arc is used twice by the same country. `mesh(a === b)` cannot
 * distinguish that from a genuine coastline and would draw a stray neutral
 * hairline across the isthmus.
 *
 * So instead we index arc ownership ourselves, once, and partition by hand:
 *
 *   usage 1                   -> coastline / exterior       (neutral, static)
 *   usage 2, two owners       -> political border           (classified below)
 *   usage 2, one owner        -> internal seam              (DROPPED)
 *
 * and political borders classify as:
 *
 *   both owners in EMEA, not disputed  -> the pulsing network
 *   pair listed in disputed.ts         -> dashed de facto line, never pulses
 *   either owner out of EMEA           -> dim static line
 *
 * Every arc lands in exactly one bucket, so no border is drawn twice and none
 * is drawn zero times. `assertPartitionIsTotal()` proves it at load.
 *
 * Each bucket becomes ONE MultiLineString rendered as ONE path element, with
 * every arc as its own subpath. `stroke-dasharray` resets per subpath, so each
 * border segment lights independently while all advance in lockstep — the
 * network energising, rather than one snake crawling around Africa.
 */
import { feature } from 'topojson-client';
import type { Topology, GeometryCollection, GeometryObject } from 'topojson-specification';
import type { Feature, FeatureCollection, Geometry, MultiLineString } from 'geojson';

import topologyRaw from './geo/countries-50m.json';
import { resolveAlpha3, displayName, type Alpha3 } from './iso';
import { EMEA, isInScope, SUBREGION_OF } from './regions';
import { DE_FACTO_LINE_KEYS, borderKey } from './disputed';
import { CAPITAL_OF } from './capitals';

const topology = topologyRaw as unknown as Topology<{ countries: GeometryCollection }>;
const geometries = topology.objects.countries.geometries;

/* ------------------------------------------------------------------ *
 * Countries — one feature per alpha-3.
 * ------------------------------------------------------------------ */

export interface CountryDatum {
  readonly iso: Alpha3;
  readonly name: string;
  readonly inScope: boolean;
  readonly subRegion: string | null;
  readonly capital: string | null;
  readonly feature: Feature<Geometry>;
}

/**
 * Geometries sharing an alpha-3 are merged into one feature, so every country
 * is exactly one hit-testable shape. Natural Earth carries "Ashmore and
 * Cartier Is." as a second feature coded 036 (Australia); without this, a
 * country could be two DOM nodes and hover would flicker between them.
 */
const grouped = new Map<Alpha3, GeometryObject[]>();
const dropped: string[] = [];

for (const g of geometries) {
  const iso = resolveAlpha3(g.id, (g.properties as { name?: string } | undefined)?.name);
  if (!iso) {
    dropped.push((g.properties as { name?: string } | undefined)?.name ?? '(unnamed)');
    continue;
  }
  const list = grouped.get(iso);
  if (list) list.push(g);
  else grouped.set(iso, [g]);
}

export const COUNTRIES: readonly CountryDatum[] = [...grouped.entries()]
  .map(([iso, geoms]) => {
    const collection = feature(topology, {
      type: 'GeometryCollection',
      geometries: geoms,
    } as GeometryCollection) as FeatureCollection<Geometry>;

    // Flatten the collection into a single MultiPolygon feature.
    const coordinates = collection.features.flatMap((f) =>
      f.geometry.type === 'Polygon'
        ? [f.geometry.coordinates]
        : f.geometry.type === 'MultiPolygon'
          ? f.geometry.coordinates
          : [],
    );

    return {
      iso,
      name: displayName(iso),
      inScope: isInScope(iso),
      subRegion: SUBREGION_OF[iso] ?? null,
      capital: CAPITAL_OF[iso]?.name ?? null,
      feature: {
        type: 'Feature',
        id: iso,
        properties: { iso },
        geometry: { type: 'MultiPolygon', coordinates },
      } as Feature<Geometry>,
    };
  })
  .sort((a, b) => a.iso.localeCompare(b.iso));

export const COUNTRY_BY_ISO: Readonly<Record<string, CountryDatum>> = Object.fromEntries(
  COUNTRIES.map((c) => [c.iso, c]),
);

/** Drawn last so they sit above their neighbours for hit-testing. */
export const IN_SCOPE_COUNTRIES = COUNTRIES.filter((c) => c.inScope);
export const OUT_OF_SCOPE_COUNTRIES = COUNTRIES.filter((c) => !c.inScope);

/* ------------------------------------------------------------------ *
 * Arc ownership index.
 * ------------------------------------------------------------------ */

const normalise = (a: number) => (a < 0 ? ~a : a);

function arcIndicesOf(g: GeometryObject): number[] {
  const arcs = (g as { arcs?: unknown }).arcs;
  if (!arcs) return [];
  // Polygon: number[][]; MultiPolygon: number[][][]. flat(2) covers both.
  return (arcs as number[][][]).flat(2).map(normalise);
}

/** arc index -> the codes that use it, with multiplicity. */
const arcOwners = new Map<number, Alpha3[]>();

for (const [iso, geoms] of grouped) {
  for (const g of geoms) {
    for (const arc of arcIndicesOf(g)) {
      const owners = arcOwners.get(arc);
      if (owners) owners.push(iso);
      else arcOwners.set(arc, [iso]);
    }
  }
}

export type BorderClass =
  /** Used once, owner in EMEA. Coastline / outer edge. Neutral, never pulses. */
  | 'coastline'
  /** Used once, owner outside EMEA. Same treatment, dimmer — see below. */
  | 'coastlineOutOfScope'
  /** Political border, both sides in EMEA, not disputed. This is the network. */
  | 'network'
  /** Listed in disputed.ts. Dashed hairline. Never pulses. */
  | 'deFacto'
  /** Political border with at least one side outside EMEA. Dim, static. */
  | 'outOfScope'
  /** Used twice by the same country. Dropped — see the Crimea note above. */
  | 'internal';

const buckets: Record<BorderClass, number[]> = {
  coastline: [],
  coastlineOutOfScope: [],
  network: [],
  deFacto: [],
  outOfScope: [],
  internal: [],
};

for (const [arc, owners] of arcOwners) {
  const distinct = [...new Set(owners)];

  if (distinct.length === 1) {
    // One owner. Either a genuine coastline (used once) or an internal seam
    // created by the Crimea reassignment (used twice by Ukraine).
    if (owners.length > 1) {
      buckets.internal.push(arc);
    } else {
      // Out-of-scope land keeps its coastline, at low opacity. Without it the
      // fill (#0A0D11) is close enough to the canvas (#06080B) that Russia and
      // Greenland read as ocean — which recreates the hole in the map that
      // rendering them was supposed to avoid.
      buckets[EMEA.has(distinct[0]) ? 'coastline' : 'coastlineOutOfScope'].push(arc);
    }
    continue;
  }

  const [a, b] = distinct as [Alpha3, Alpha3];
  if (DE_FACTO_LINE_KEYS.has(borderKey(a, b))) buckets.deFacto.push(arc);
  else if (EMEA.has(a) && EMEA.has(b)) buckets.network.push(arc);
  else buckets.outOfScope.push(arc);
}

/**
 * Build one MultiLineString from a list of arc indices, one subpath per arc.
 *
 * One subpath per arc is the whole trick. `stroke-dasharray` restarts at every
 * `M` command, so each border segment begins its dash cycle at its own start
 * point while every segment advances in lockstep. The result reads as a
 * network energising rather than a single snake crawling around Africa.
 */
export function meshOfArcs(arcs: readonly number[]): Feature<MultiLineString> {
  return feature(topology, {
    type: 'MultiLineString',
    arcs: arcs.map((a) => [a]),
  } as GeometryObject) as Feature<MultiLineString>;
}

export const BORDERS: Readonly<Record<BorderClass, Feature<MultiLineString>>> = {
  coastline: meshOfArcs(buckets.coastline),
  coastlineOutOfScope: meshOfArcs(buckets.coastlineOutOfScope),
  network: meshOfArcs(buckets.network),
  deFacto: meshOfArcs(buckets.deFacto),
  outOfScope: meshOfArcs(buckets.outOfScope),
  internal: meshOfArcs(buckets.internal),
};

/** The pulsing network's arc indices, for the optional arc-flash discharge. */
export const NETWORK_ARCS: readonly number[] = buckets.network;

/** Per-country outline, built on demand for the hover treatment. */
const outlineCache = new Map<Alpha3, Feature<MultiLineString>>();

export function outlineOf(iso: Alpha3): Feature<MultiLineString> | null {
  const cached = outlineCache.get(iso);
  if (cached) return cached;
  const geoms = grouped.get(iso);
  if (!geoms) return null;
  const arcs = [...new Set(geoms.flatMap(arcIndicesOf))];
  const built = meshOfArcs(arcs);
  outlineCache.set(iso, built);
  return built;
}

/* ------------------------------------------------------------------ *
 * Load-time assertions. These fail loudly in dev and are cheap enough to
 * leave in production — they run once, over ~2000 arcs.
 * ------------------------------------------------------------------ */

export interface AtlasIntegrity {
  readonly totalArcs: number;
  readonly counts: Record<BorderClass, number>;
  readonly problems: readonly string[];
}

function checkIntegrity(): AtlasIntegrity {
  const problems: string[] = [];
  const counts = Object.fromEntries(
    Object.entries(buckets).map(([k, v]) => [k, v.length]),
  ) as Record<BorderClass, number>;

  // 1. The partition is total and disjoint: every arc in exactly one bucket.
  const assigned = Object.values(buckets).reduce((n, b) => n + b.length, 0);
  if (assigned !== arcOwners.size) {
    problems.push(`partition is not total: ${assigned} assigned of ${arcOwners.size} arcs`);
  }
  const seen = new Set<number>();
  for (const bucket of Object.values(buckets)) {
    for (const arc of bucket) {
      if (seen.has(arc)) problems.push(`arc ${arc} is in more than one bucket`);
      seen.add(arc);
    }
  }

  // 2. No arc is used more than twice — a third use would mean the pair-based
  //    classification above is silently discarding a neighbour relationship.
  for (const [arc, owners] of arcOwners) {
    if (owners.length > 2) problems.push(`arc ${arc} used ${owners.length}x by ${owners.join(',')}`);
  }

  // 3. Every code claimed in scope actually exists in the topology. Without
  //    this, a typo in regions.ts silently un-lights a country.
  for (const iso of EMEA) {
    if (!grouped.has(iso)) problems.push(`regions.ts lists ${iso} but the topology has no such feature`);
  }

  // 4. Every in-scope country has a capital. State 3 depends on this.
  for (const iso of EMEA) {
    if (!CAPITAL_OF[iso]) problems.push(`capitals.ts is missing ${iso} (${displayName(iso)})`);
  }

  // 5. Every disputed pair actually shares a border in the data. A stale entry
  //    would mean a line we believe is dashed is in fact drawn as the network.
  for (const key of DE_FACTO_LINE_KEYS) {
    const found = [...arcOwners.values()].some((owners) => {
      const d = [...new Set(owners)];
      return d.length === 2 && borderKey(d[0], d[1]) === key;
    });
    if (!found) problems.push(`disputed.ts declares a de facto line for ${key}, but they share no arc`);
  }

  return { totalArcs: arcOwners.size, counts, problems };
}

export const INTEGRITY: AtlasIntegrity = checkIntegrity();

// Exposed for scripts/verify.mjs, which asserts the partition from outside the
// bundle rather than trusting a unit test of the same code that produced it.
declare global {
  interface Window {
    __atlasIntegrity?: AtlasIntegrity;
  }
}
if (typeof window !== 'undefined') window.__atlasIntegrity = INTEGRITY;

if (INTEGRITY.problems.length > 0) {
  console.error(
    `atlas.ts: ${INTEGRITY.problems.length} integrity problem(s)\n` +
      INTEGRITY.problems.map((p) => `  - ${p}`).join('\n'),
  );
}
if (dropped.length > 0) {
  console.info(`atlas.ts: dropped ${dropped.length} unresolvable feature(s): ${dropped.join(', ')}`);
}
