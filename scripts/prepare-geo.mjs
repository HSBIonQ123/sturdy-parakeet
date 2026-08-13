/**
 * prepare-geo.mjs — vendors the boundary topology into src/data/geo/.
 *
 * Run: npm run prepare:geo
 *
 * Source: world-atlas@2.0.2 countries-50m.json, itself a redistribution of
 * Natural Earth 4.1.0 Admin 0 country boundaries at 1:50m. Natural Earth 4.1.0
 * was published in 2018; every consequence of that vintage is handled here or
 * in src/data/iso.ts, and recorded in src/data/disputed.ts.
 *
 * This script makes exactly ONE geometric change to the source data, documented
 * below. Everything else — names, ISO codes, scope, dispute treatment — is
 * resolved at load time so the vendored file stays diffable against upstream.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const require = createRequire(import.meta.url);
const here = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = resolve(here, '../src/data/geo');

const SRC = require.resolve('world-atlas/countries-50m.json');
const topology = JSON.parse(readFileSync(SRC, 'utf8'));

const geometries = topology.objects.countries.geometries;
const byId = (id) => geometries.find((g) => g.id === id);
const byName = (name) => geometries.find((g) => g.properties?.name === name);

const notes = [];
const fail = (msg) => {
  console.error(`prepare-geo: FAILED — ${msg}`);
  process.exit(1);
};

/* ------------------------------------------------------------------ *
 * PATCH 1 — Crimea.
 *
 * Natural Earth 4.1.0 assigns the Crimean peninsula to Russia. Verified by
 * point-in-polygon at Simferopol (34.10E, 44.95N). This contradicts the legal
 * position of the UK, the EU and the UN General Assembly (Res. 68/262), and
 * this map is presented to European policymakers.
 *
 * Crimea is a single self-contained ring — polygon index 98 of Russia's
 * 99-polygon MultiPolygon — so it moves to Ukraine by reassigning one entry.
 * Arc indices are shared across the topology, so no coordinates change and no
 * seam is introduced; arc 282 (the Perekop isthmus) simply becomes internal to
 * Ukraine, and the arc-usage index in src/data/atlas.ts drops internal arcs.
 *
 * Per project decision: reassigned outright, with no dashed line of control.
 * ------------------------------------------------------------------ */
{
  const RU = byId('643');
  const UA = byId('804');
  if (!RU || !UA) fail('Russia (643) or Ukraine (804) not found in source topology');
  if (RU.type !== 'MultiPolygon') fail(`expected Russia to be MultiPolygon, got ${RU.type}`);
  if (RU.arcs.length !== 99) fail(`expected Russia to have 99 polygons, got ${RU.arcs.length}`);

  const crimea = RU.arcs[98];
  // Guard the index against an upstream reorder: the Crimea ring is [[-283, 639]].
  const signature = JSON.stringify(crimea);
  if (signature !== '[[-283,639]]') {
    fail(`Russia polygon 98 is not the expected Crimea ring (got ${signature}). ` +
         'Upstream data changed — re-identify the polygon before trusting this patch.');
  }

  RU.arcs.splice(98, 1);
  if (UA.type === 'Polygon') {
    UA.type = 'MultiPolygon';
    UA.arcs = [UA.arcs];
  }
  UA.arcs.push(crimea);

  notes.push('Crimea moved from Russia (643) to Ukraine (804); Russia 99 -> 98 polygons, Ukraine 2 -> 3.');
}

/* ------------------------------------------------------------------ *
 * Assertions — these are the guarantees the render layer relies on.
 * ------------------------------------------------------------------ */

// The three de facto entities that carry no ISO numeric code must still be
// present under the exact names src/data/iso.ts keys its overrides on.
for (const name of ['Kosovo', 'N. Cyprus', 'Somaliland']) {
  const g = byName(name);
  if (!g) fail(`de facto entity "${name}" missing from source topology`);
  if (g.id != null) {
    fail(`"${name}" unexpectedly carries id ${g.id}; iso.ts keys it by name and would now double-resolve`);
  }
}

// Nothing else may be id-less inside the EMEA frame.
const idless = geometries.filter((g) => g.id == null).map((g) => g.properties.name).sort();
notes.push(`id-less features (resolved by name in iso.ts): ${idless.join(', ')}`);

// Every arc must be used at most twice. A third use would mean a tri-point
// artefact and would break the border partition in atlas.ts.
{
  const usage = new Map();
  for (const g of geometries) {
    const flat = (g.type === 'Polygon' ? [g.arcs] : g.arcs).flat(2);
    for (const a of flat) {
      const i = a < 0 ? ~a : a;
      usage.set(i, (usage.get(i) ?? 0) + 1);
    }
  }
  const over = [...usage].filter(([, n]) => n > 2);
  if (over.length) fail(`${over.length} arcs are used more than twice, e.g. arc ${over[0][0]} used ${over[0][1]}x`);
  const once = [...usage].filter(([, n]) => n === 1).length;
  notes.push(`arcs: ${usage.size} total, ${once} used once (coastline), ${usage.size - once} used twice (shared)`);
}

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(resolve(OUT_DIR, 'countries-50m.json'), JSON.stringify(topology));

const provenance = `# Vendored boundary data

**File:** \`countries-50m.json\`
**Upstream:** \`world-atlas@2.0.2\` / \`countries-50m.json\`
**Ultimate source:** Natural Earth 4.1.0, Admin 0 — Countries, 1:50m (public domain)
**Regenerate:** \`npm run prepare:geo\`

Do not hand-edit this file. It is written by \`scripts/prepare-geo.mjs\`, which
applies exactly one geometric patch to upstream and then asserts the invariants
the render layer depends on. Re-running the script from a fresh \`world-atlas\`
install must reproduce it byte for byte.

## Changes applied to upstream

${notes.map((n) => `- ${n}`).join('\n')}

## Not changed here

Display names, ISO alpha-3 resolution, EMEA scope and disputed-boundary
treatment are all resolved at load time — see \`src/data/iso.ts\`,
\`src/data/regions.ts\` and \`src/data/disputed.ts\`. Natural Earth's own
\`properties.name\` values are 2018-vintage (they read "Macedonia", "Turkey")
and are used for nothing except keying the three id-less de facto entities.
`;
writeFileSync(resolve(OUT_DIR, 'PROVENANCE.md'), provenance);

console.log('prepare-geo: wrote src/data/geo/countries-50m.json');
for (const n of notes) console.log(`  - ${n}`);
