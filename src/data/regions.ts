/**
 * regions.ts — EMEA membership, stated explicitly.
 *
 * This file is a deliberate editorial artefact, not a computed guess from a
 * continent field. Every entity in scope is listed by alpha-3 and every
 * judgement call carries a one-line reason, because "why is Türkiye in and Iran
 * out" is a question that gets asked in the room.
 *
 * Scope is binary: a country is in EMEA or it is not. Everything not listed
 * here still renders — geographically, in its true position — but styled as
 * out-of-scope. There are no holes in this map.
 *
 * Sub-regions exist so the readout can say something more useful than "EMEA",
 * and so State 2 layers have a ready-made grouping to filter against. They are
 * presentational groupings, not political claims.
 */
import type { Alpha3 } from './iso';

export type SubRegion =
  | 'Northern Europe'
  | 'Western Europe'
  | 'Southern Europe'
  | 'Central & Eastern Europe'
  | 'South Caucasus'
  | 'Middle East'
  | 'North Africa'
  | 'West Africa'
  | 'Central Africa'
  | 'East Africa'
  | 'Southern Africa';

/**
 * The membership table. Order within a group is alphabetical by code so diffs
 * stay readable when State 2 inevitably prompts a scope argument.
 */
export const EMEA_BY_SUBREGION: Readonly<Record<SubRegion, readonly Alpha3[]>> = {
  'Northern Europe': [
    'ALA', // Åland — autonomous region of Finland; separate NE feature, so listed to avoid a hole
    'DNK',
    'EST',
    'FIN',
    'FRO', // Faroe Islands — autonomous within Denmark, geographically European
    'ISL',
    'LVA',
    'LTU',
    'NOR', // Svalbard and Jan Mayen are inside the Norway feature at 1:50m, not separate
    'SWE',
  ],
  'Western Europe': [
    'AUT',
    'BEL',
    'CHE',
    'DEU',
    'FRA', // French overseas departments are not separate NE features at 1:50m
    'GBR',
    'GGY', // Guernsey — Crown Dependency, not UK, but unambiguously in the European frame
    'IMN', // Isle of Man — as above
    'IRL',
    'JEY', // Jersey — as above
    'LIE',
    'LUX',
    'MCO',
    'NLD',
  ],
  'Southern Europe': [
    'AND',
    'CYP', // Cyprus is treated as European throughout, consistent with EU and CoE practice
    'ESP', // the Canary Islands sit inside the Spain feature and are therefore in scope
    'GRC',
    'ITA',
    'MLT',
    'PRT', // Madeira and the Azores sit inside the Portugal feature and are in scope
    'SMR',
    'VAT',
    'XNC', // Northern Cyprus — de facto entity, no ISO code. See disputed.ts.
  ],
  'Central & Eastern Europe': [
    'ALB',
    'BGR',
    'BIH',
    'BLR', // in scope: European. Scope is geographic, not a statement about engagement.
    'CZE',
    'HRV',
    'HUN',
    'MDA',
    'MKD',
    'MNE',
    'POL',
    'ROU',
    'SRB',
    'SVK',
    'SVN',
    'UKR', // includes Crimea — reassigned from the source data. See disputed.ts.
    'XKX', // Kosovo — no ISO code. See disputed.ts.
  ],
  'South Caucasus': [
    // Named in scope explicitly. Abkhazia and South Ossetia are inside the
    // Georgia feature in the source data and are not rendered separately.
    'ARM',
    'AZE',
    'GEO',
  ],
  'Middle East': [
    'ARE',
    'BHR',
    'IRQ',
    'ISR',
    'JOR',
    'KWT',
    'LBN',
    'OMN',
    'PSE', // Palestine — West Bank and Gaza, per Natural Earth. See disputed.ts.
    'QAT',
    'SAU',
    'SYR',
    'TUR', // Türkiye is in scope in full, including the Anatolian landmass east of the Bosphorus
    'YEM',
  ],
  'North Africa': [
    'DZA',
    'EGY', // the whole of Egypt including Sinai, which is geographically Asian
    'ESH', // Western Sahara — non-self-governing territory, rendered separately. See disputed.ts.
    'LBY',
    'MAR',
    'TUN',
  ],
  'West Africa': [
    'BEN', 'BFA', 'CIV', 'CPV', 'GHA', 'GIN', 'GMB', 'GNB',
    'LBR', 'MLI', 'MRT', 'NER', 'NGA', 'SEN', 'SLE', 'TGO',
  ],
  'Central Africa': [
    'AGO', 'CAF', 'CMR', 'COD', 'COG', 'GAB', 'GNQ', 'STP', 'TCD',
  ],
  'East Africa': [
    'BDI', 'COM', 'DJI', 'ERI', 'ETH', 'KEN', 'MDG', 'MOZ', 'MUS',
    'MWI', 'RWA', 'SDN', 'SOM', 'SSD', 'SYC', 'TZA', 'UGA',
    'XSO', // Somaliland — de facto entity, no ISO code. See disputed.ts.
    'ZMB', 'ZWE',
  ],
  'Southern Africa': [
    'BWA', 'LSO', 'NAM', 'SWZ', 'ZAF',
  ],
};

/**
 * Deliberate exclusions. Listed so that "did they forget X" has an answer, and
 * so a future scope change is a one-line move between two tables rather than an
 * archaeology exercise.
 *
 * Each of these still renders in its true geographic position, styled
 * out-of-scope. None is clipped.
 */
export const DELIBERATELY_OUT_OF_SCOPE: Readonly<Record<string, string>> = {
  RUS: 'Excluded by project decision. Renders in full, unlit, including the Kaliningrad exclave.',
  IRN: 'Excluded by project decision. Geographically Middle Eastern; scope stops at Iraq and the Gulf.',
  AFG: 'Excluded by project decision, with Iran and Pakistan.',
  PAK: 'Excluded by project decision, with Iran and Afghanistan.',
  KAZ: 'Central Asia — out of scope. Renders unlit; its European portion west of the Urals is not split out.',
  TKM: 'Central Asia — out of scope.',
  UZB: 'Central Asia — out of scope.',
  TJK: 'Central Asia — out of scope.',
  KGZ: 'Central Asia — out of scope.',
  GRL: 'Danish territory but geographically North American. In frame, styled out-of-scope, never clipped.',
  SHN: 'St Helena, Ascension and Tristan da Cunha — mid-Atlantic. In frame, styled out-of-scope.',
};

/** Flat membership set. This is what the render layer asks. */
export const EMEA: ReadonlySet<Alpha3> = new Set(
  Object.values(EMEA_BY_SUBREGION).flat(),
);

/** Reverse index: alpha-3 -> sub-region, for the readout. */
export const SUBREGION_OF: Readonly<Record<string, SubRegion>> = Object.fromEntries(
  Object.entries(EMEA_BY_SUBREGION).flatMap(([sub, codes]) =>
    codes.map((c) => [c, sub as SubRegion]),
  ),
);

export function isInScope(a3: Alpha3 | null | undefined): boolean {
  return a3 != null && EMEA.has(a3);
}

/** Count of entities in scope. Surfaced in the telemetry strip. */
export const EMEA_COUNT = EMEA.size;
