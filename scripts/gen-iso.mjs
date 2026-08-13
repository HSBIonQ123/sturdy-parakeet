/**
 * gen-iso.mjs — emits src/data/iso.ts from the vendored topology.
 *
 * Run: npm run gen:iso   (after npm run prepare:geo)
 *
 * Why this exists: the topology carries ISO 3166-1 *numeric* codes in `id` and
 * 2018-vintage Natural Earth display names in `properties.name`. Neither is
 * what we want to render. This script resolves numeric -> alpha-3 and attaches
 * a curated display name, so the whole app can key on alpha-3 and nothing else.
 *
 * The generated file is committed. It is data, not build output — reviewing a
 * diff of country names is exactly the kind of thing that should show up in a
 * pull request.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import * as isoPkg from 'i18n-iso-countries';

const iso = isoPkg.default ?? isoPkg;
const require = createRequire(import.meta.url);
const here = dirname(fileURLToPath(import.meta.url));

const topology = JSON.parse(
  readFileSync(resolve(here, '../src/data/geo/countries-50m.json'), 'utf8'),
);
const geometries = topology.objects.countries.geometries;

/* ------------------------------------------------------------------ *
 * De facto entities with no ISO 3166-1 code.
 *
 * These carry no `id` in the topology, so they are keyed by Natural Earth's
 * name — the only stable handle available. prepare-geo.mjs asserts that all
 * three are still present and still id-less, so a silent upstream change
 * fails the build rather than dropping three polygons off the map.
 *
 * The codes are ISO 3166-1 *user-assigned* (the XA-XZ range). They are not
 * ISO-allocated and must never be presented as such; `isoAssigned: false`
 * carries that through to the UI. XKX is the code the European Commission and
 * the World Bank use for Kosovo; XNC and XSO are conventional but unofficial.
 * ------------------------------------------------------------------ */
const NO_ISO = {
  Kosovo: { a3: 'XKX', name: 'Kosovo' },
  'N. Cyprus': { a3: 'XNC', name: 'Northern Cyprus' },
  Somaliland: { a3: 'XSO', name: 'Somaliland' },
};

/* ------------------------------------------------------------------ *
 * Display names.
 *
 * Every EMEA-frame country is named here explicitly rather than inherited, so
 * that what appears on screen in front of a government audience is a deliberate
 * editorial choice with a diff history. Rules applied:
 *   - current official short-form English name (UN/FCDO usage)
 *   - no inverted or comma forms ("Congo, Democratic Republic of the")
 *   - no abbreviations ("Bosnia and Herz.", "Central African Rep.")
 *   - diacritics kept (Türkiye, Côte d'Ivoire, São Tomé and Príncipe)
 * Anything not listed falls back to the i18n-iso-countries English name, which
 * only affects countries outside the EMEA frame.
 * ------------------------------------------------------------------ */
const NAMES = {
  // --- Europe, west and north ---
  ALB: 'Albania', AND: 'Andorra', AUT: 'Austria', BEL: 'Belgium',
  BIH: 'Bosnia and Herzegovina', BGR: 'Bulgaria', HRV: 'Croatia', CYP: 'Cyprus',
  CZE: 'Czechia', DNK: 'Denmark', EST: 'Estonia', FRO: 'Faroe Islands',
  FIN: 'Finland', FRA: 'France', DEU: 'Germany', GIB: 'Gibraltar',
  GRC: 'Greece', GRL: 'Greenland', HUN: 'Hungary', ISL: 'Iceland',
  IRL: 'Ireland', IMN: 'Isle of Man', ITA: 'Italy', LVA: 'Latvia',
  LIE: 'Liechtenstein', LTU: 'Lithuania', LUX: 'Luxembourg', MLT: 'Malta',
  MDA: 'Moldova', MCO: 'Monaco', MNE: 'Montenegro', NLD: 'Netherlands',
  MKD: 'North Macedonia',            // NE 4.1.0 still says "Macedonia" — renamed 2019
  NOR: 'Norway', POL: 'Poland', PRT: 'Portugal', ROU: 'Romania',
  SMR: 'San Marino', SRB: 'Serbia', SVK: 'Slovakia', SVN: 'Slovenia',
  ESP: 'Spain', SWE: 'Sweden', CHE: 'Switzerland', UKR: 'Ukraine',
  GBR: 'United Kingdom', VAT: 'Vatican City',
  BLR: 'Belarus',

  // --- Türkiye and the South Caucasus ---
  TUR: 'Türkiye',                    // NE 4.1.0 says "Turkey" — UN name change 2022
  ARM: 'Armenia', AZE: 'Azerbaijan', GEO: 'Georgia',

  // --- Middle East / Gulf ---
  BHR: 'Bahrain', IRQ: 'Iraq', ISR: 'Israel', JOR: 'Jordan', KWT: 'Kuwait',
  LBN: 'Lebanon', OMN: 'Oman', PSE: 'Palestine', QAT: 'Qatar',
  SAU: 'Saudi Arabia', SYR: 'Syria', ARE: 'United Arab Emirates', YEM: 'Yemen',

  // --- North Africa ---
  DZA: 'Algeria', EGY: 'Egypt', LBY: 'Libya', MAR: 'Morocco',
  TUN: 'Tunisia', ESH: 'Western Sahara',

  // --- West Africa ---
  BEN: 'Benin', BFA: 'Burkina Faso', CPV: 'Cabo Verde', CIV: "Côte d'Ivoire",
  GMB: 'The Gambia', GHA: 'Ghana', GIN: 'Guinea', GNB: 'Guinea-Bissau',
  LBR: 'Liberia', MLI: 'Mali', MRT: 'Mauritania', NER: 'Niger',
  NGA: 'Nigeria', SEN: 'Senegal', SLE: 'Sierra Leone', TGO: 'Togo',

  // --- Central Africa ---
  AGO: 'Angola', CMR: 'Cameroon', CAF: 'Central African Republic', TCD: 'Chad',
  COG: 'Republic of the Congo', COD: 'Democratic Republic of the Congo',
  GNQ: 'Equatorial Guinea', GAB: 'Gabon', STP: 'São Tomé and Príncipe',

  // --- East Africa and Horn ---
  BDI: 'Burundi', COM: 'Comoros', DJI: 'Djibouti', ERI: 'Eritrea',
  ETH: 'Ethiopia', KEN: 'Kenya', MDG: 'Madagascar', MWI: 'Malawi',
  MUS: 'Mauritius', MOZ: 'Mozambique', RWA: 'Rwanda', SYC: 'Seychelles',
  SOM: 'Somalia', SSD: 'South Sudan', SDN: 'Sudan', TZA: 'Tanzania',
  UGA: 'Uganda', ZMB: 'Zambia', ZWE: 'Zimbabwe',

  // --- Southern Africa ---
  BWA: 'Botswana', SWZ: 'Eswatini', LSO: 'Lesotho', NAM: 'Namibia',
  ZAF: 'South Africa',

  // --- Out of scope, but in or near frame; named so the readout never
  //     shows a raw code or an inverted form ---
  RUS: 'Russia', KAZ: 'Kazakhstan', TKM: 'Turkmenistan', UZB: 'Uzbekistan',
  TJK: 'Tajikistan', KGZ: 'Kyrgyzstan', AFG: 'Afghanistan', PAK: 'Pakistan',
  IRN: 'Iran', IND: 'India', CHN: 'China', BRA: 'Brazil',
  USA: 'United States', CAN: 'Canada',
};

const rows = [];
const problems = [];

for (const g of geometries) {
  const neName = g.properties?.name ?? '(unnamed)';
  let a3;
  let isoAssigned = true;

  if (g.id == null) {
    const override = NO_ISO[neName];
    if (!override) {
      // Indian Ocean Ter. and Siachen Glacier land here. Both are far outside
      // the EMEA frame and neither is a country; they are deliberately dropped.
      problems.push(`dropped id-less feature "${neName}" (no user-assigned code defined)`);
      continue;
    }
    a3 = override.a3;
    isoAssigned = false;
    rows.push({ numeric: null, a3, name: override.name, neName, isoAssigned });
    continue;
  }

  a3 = iso.numericToAlpha3(g.id);
  if (!a3) {
    problems.push(`no alpha-3 for numeric ${g.id} ("${neName}")`);
    continue;
  }
  const name = NAMES[a3] ?? iso.getName(a3, 'en') ?? neName;
  if (!NAMES[a3] && /[,(]/.test(name)) {
    problems.push(`fallback name for ${a3} contains punctuation: "${name}"`);
  }
  rows.push({ numeric: g.id, a3, name, neName, isoAssigned });
}

rows.sort((a, b) => a.a3.localeCompare(b.a3));

/**
 * One alpha-3 can appear on more than one topology geometry — Natural Earth
 * carries "Ashmore and Cartier Is." as a separate feature also coded 036
 * (Australia). That is legitimate: alpha-3 identifies a country, not a polygon.
 * The table below is keyed by country, so collapse duplicates here; the loader
 * in src/data/atlas.ts correspondingly merges all geometries sharing a code
 * into one feature, so every country is exactly one hit-testable shape.
 */
const collapsed = new Map();
const merged = [];
for (const r of rows) {
  const prior = collapsed.get(r.a3);
  if (prior) {
    if (prior.name !== r.name) {
      console.error(
        `gen-iso: FAILED — ${r.a3} resolves to two different display names: ` +
        `"${prior.name}" and "${r.name}"`,
      );
      process.exit(1);
    }
    merged.push(`${r.a3}: merged extra geometry "${r.neName}"`);
    continue;
  }
  collapsed.set(r.a3, r);
}
rows.length = 0;
rows.push(...collapsed.values());
problems.push(...merged);

const numericLines = rows
  .filter((r) => r.numeric != null)
  .map((r) => `  '${r.numeric}': '${r.a3}',`)
  .join('\n');

const nameLines = rows
  .map((r) => `  ${r.a3}: ${JSON.stringify(r.name)},`)
  .join('\n');

const neLines = Object.entries(NO_ISO)
  .map(([ne, v]) => `  ${JSON.stringify(ne)}: '${v.a3}',`)
  .join('\n');

const unassignedLines = rows
  .filter((r) => !r.isoAssigned)
  .map((r) => `  '${r.a3}',`)
  .join('\n');

const out = `/**
 * iso.ts — GENERATED by scripts/gen-iso.mjs. Do not hand-edit.
 *   Regenerate: npm run gen:iso
 *   Change a display name in scripts/gen-iso.mjs, not here.
 *
 * Alpha-3 is the single join key for this application. Numeric ISO codes exist
 * only in the vendored topology and are resolved away at load; every layer
 * added in State 2 and beyond is an array of Alpha3 and nothing else.
 *
 * ${rows.length} entities: ${rows.filter((r) => r.isoAssigned).length} ISO-coded,
 * ${rows.filter((r) => !r.isoAssigned).length} user-assigned (see UNASSIGNED_CODES).
 */

/** ISO 3166-1 alpha-3, plus the user-assigned codes in UNASSIGNED_CODES. */
export type Alpha3 = string & { readonly __brand?: 'Alpha3' };

/** ISO 3166-1 numeric (as it appears in the topology \`id\`) -> alpha-3. */
export const NUMERIC_TO_ALPHA3: Readonly<Record<string, Alpha3>> = {
${numericLines}
};

/**
 * Natural Earth \`properties.name\` -> alpha-3, for the de facto entities that
 * carry no ISO numeric code. This is the ONLY place a Natural Earth display
 * name is trusted for anything, and prepare-geo.mjs asserts all three still
 * exist and are still id-less.
 */
export const NE_NAME_TO_ALPHA3: Readonly<Record<string, Alpha3>> = {
${neLines}
};

/**
 * Codes from the ISO 3166-1 user-assigned range. NOT allocated by ISO. The UI
 * must not present these as ISO codes; Readout marks them explicitly.
 */
export const UNASSIGNED_CODES: ReadonlySet<Alpha3> = new Set([
${unassignedLines}
]);

/** Curated display names. See scripts/gen-iso.mjs for the editorial rules. */
export const DISPLAY_NAME: Readonly<Record<string, string>> = {
${nameLines}
};

/** Resolve a topology geometry to alpha-3. Returns null for features we drop. */
export function resolveAlpha3(
  id: string | number | null | undefined,
  neName: string | undefined,
): Alpha3 | null {
  if (id != null) return NUMERIC_TO_ALPHA3[String(id)] ?? null;
  if (neName) return NE_NAME_TO_ALPHA3[neName] ?? null;
  return null;
}

/** Display name for a code, falling back to the code itself. */
export function displayName(a3: Alpha3): string {
  return DISPLAY_NAME[a3] ?? a3;
}

/** True if the code is ISO-allocated rather than user-assigned. */
export function isIsoAssigned(a3: Alpha3): boolean {
  return !UNASSIGNED_CODES.has(a3);
}
`;

writeFileSync(resolve(here, '../src/data/iso.ts'), out);
console.log(`gen-iso: wrote src/data/iso.ts (${rows.length} entities)`);
for (const p of problems) console.log(`  note: ${p}`);
