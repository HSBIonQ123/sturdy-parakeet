/**
 * disputed.ts — the disputed-territory register.
 *
 * POLICY (also recorded in CLAUDE.md; change it in both places or in neither):
 *
 *   1. Use Natural Earth defaults, except where a default asserts a position
 *      contrary to UK/EU/UN law. Those exceptions are listed here with the
 *      patch that corrects them.
 *   2. Boundaries that are lines of control, armistice lines or administrative
 *      lines rather than agreed international borders render as DASHED
 *      HAIRLINES, and never pulse.
 *   3. No label anywhere in this application asserts a sovereignty position.
 *      The readout prints a name and a code; it does not print a status.
 *   4. Nothing is clipped. A territory whose status is unresolved is drawn in
 *      its true geographic position. A hole in the map looks like a bug and
 *      invites exactly the question we are not answering.
 *
 * Every case below was verified against the vendored topology by
 * point-in-polygon probe, not assumed. The probe coordinates are recorded so
 * anyone can re-run the check.
 *
 * This file is the single auditable place where all of this lives. If a case
 * is not in this file, the map is using the Natural Earth default for it.
 */
import type { Alpha3 } from './iso';

export type Treatment =
  /** Source data corrected at build time; see scripts/prepare-geo.mjs. */
  | 'patched'
  /** Rendered as a dashed hairline that never pulses. */
  | 'de-facto-line'
  /** Natural Earth default kept as-is; recorded so the choice is visible. */
  | 'as-source'
  /** Not separable at 1:50m; recorded as a known limitation of the scale. */
  | 'not-separable';

export interface DisputedCase {
  readonly id: string;
  /** Entities involved, alpha-3 (including the user-assigned codes). */
  readonly entities: readonly Alpha3[];
  readonly treatment: Treatment;
  /**
   * Unordered pair of codes whose shared boundary renders dashed. Only
   * meaningful for `de-facto-line`.
   */
  readonly line?: readonly [Alpha3, Alpha3];
  /** Coordinates used to verify the source data's assignment, [lon, lat]. */
  readonly probe?: readonly [number, number];
  readonly note: string;
}

export const DISPUTED_CASES: readonly DisputedCase[] = [
  {
    id: 'crimea',
    entities: ['UKR', 'RUS'],
    treatment: 'patched',
    probe: [34.1, 44.95],
    note:
      'Natural Earth 4.1.0 assigns Crimea to Russia (probe at Simferopol returned Russia). ' +
      'Contrary to UNGA 68/262 and to UK and EU law. scripts/prepare-geo.mjs reassigns the ' +
      'peninsula to Ukraine by moving one self-contained polygon; no coordinates change. ' +
      'Per project decision the reassignment is outright: no line of control is drawn, and ' +
      'Crimea fills and pulses as Ukrainian territory. Post-patch probes at Simferopol, ' +
      'Sevastopol and Yalta all return Ukraine.',
  },
  {
    id: 'kosovo',
    entities: ['XKX', 'SRB'],
    treatment: 'de-facto-line',
    line: ['XKX', 'SRB'],
    probe: [21.17, 42.67],
    note:
      'Kosovo is present in the topology but carries no ISO 3166-1 code, so it would be ' +
      'silently dropped by a numeric join. Rendered as its own entity under the ' +
      'user-assigned code XKX (the code the European Commission and World Bank use). ' +
      'The boundary with Serbia is dashed. Boundaries with Albania, Montenegro and North ' +
      'Macedonia are not contested by those states and render normally.',
  },
  {
    id: 'northern-cyprus',
    entities: ['XNC', 'CYP'],
    treatment: 'de-facto-line',
    line: ['XNC', 'CYP'],
    probe: [33.37, 35.2],
    note:
      'No ISO code; rendered under user-assigned XNC. The Green Line is dashed. Recognised ' +
      'only by Türkiye; no label in this application states any status either way.',
  },
  {
    id: 'somaliland',
    entities: ['XSO', 'SOM'],
    treatment: 'de-facto-line',
    line: ['XSO', 'SOM'],
    probe: [44.07, 9.56],
    note:
      'No ISO code; rendered under user-assigned XSO. The boundary with Somalia is dashed. ' +
      'Drawn because leaving it out would put a hole in the Horn of Africa, which reads as a ' +
      'rendering fault rather than a political choice.',
  },
  {
    id: 'western-sahara',
    entities: ['ESH', 'MAR'],
    treatment: 'de-facto-line',
    line: ['ESH', 'MAR'],
    probe: [-13.5, 23.0],
    note:
      'Natural Earth carries Western Sahara as a separate feature with ISO code ESH; that ' +
      'default is kept. A UN non-self-governing territory. The boundary with Morocco is ' +
      'dashed. Note the probe at Laayoune returns Morocco in the source data because the ' +
      'northern strip is drawn as Moroccan at this scale; the southern probe returns ESH.',
  },
  {
    id: 'palestine',
    entities: ['PSE', 'ISR'],
    treatment: 'de-facto-line',
    line: ['PSE', 'ISR'],
    probe: [35.2, 31.9],
    note:
      'Natural Earth carries the West Bank and Gaza as a single Palestine feature (PSE); ' +
      'that default is kept. The boundary with Israel is dashed, being an armistice line ' +
      'rather than an agreed border. A probe at East Jerusalem returns Palestine, which is ' +
      'consistent with the position of the UK, the EU and the UN.',
  },
  {
    id: 'golan',
    entities: ['ISR', 'SYR'],
    treatment: 'de-facto-line',
    line: ['ISR', 'SYR'],
    probe: [35.75, 33.05],
    note:
      'FLAGGED. Natural Earth 4.1.0 draws the Golan Heights inside Israel (probe confirmed). ' +
      'UNSC 497 and UK/EU practice treat it as occupied Syrian territory. Unlike Crimea the ' +
      'Golan is not a separable polygon at this scale — it is contiguous with the Israeli ' +
      'landmass — so it cannot be reassigned without editing coordinates, which would put ' +
      'hand-drawn geometry into a vendored dataset. Instead the Israel-Syria boundary is ' +
      'drawn as a dashed de facto line, which is accurate: that line is the 1974 ' +
      'disengagement line, not an international border. Raise this if the treatment is ' +
      'not acceptable for a given audience.',
  },
  {
    id: 'blue-line',
    entities: ['ISR', 'LBN'],
    treatment: 'de-facto-line',
    line: ['ISR', 'LBN'],
    probe: [35.4, 33.1],
    note:
      'The Israel-Lebanon line is the UN-demarcated Blue Line, a withdrawal line rather than ' +
      'an agreed international boundary. Dashed for the same reason as the Golan line. ' +
      'Drawing it solid would assert a settled border that does not exist.',
  },
  {
    id: 'abkhazia-south-ossetia',
    entities: ['GEO'],
    treatment: 'as-source',
    probe: [41.0, 43.0],
    note:
      'Both are drawn inside Georgia in the source data (probes at Sukhumi and Tskhinvali ' +
      'return Georgia). This matches UK, EU and UN practice, so the default is kept and no ' +
      'separate entity or line is drawn.',
  },
  {
    id: 'nagorno-karabakh',
    entities: ['AZE'],
    treatment: 'as-source',
    probe: [46.75, 39.82],
    note:
      'Drawn inside Azerbaijan in the source data (probe at Stepanakert returns Azerbaijan). ' +
      'Matches the internationally recognised boundary and the position since 2023. Default kept.',
  },
  {
    id: 'transnistria',
    entities: ['MDA'],
    treatment: 'as-source',
    probe: [29.6, 46.85],
    note: 'Drawn inside Moldova in the source data. Matches international recognition. Default kept.',
  },
  {
    id: 'halayib-bir-tawil',
    entities: ['EGY', 'SDN'],
    treatment: 'as-source',
    probe: [35.5, 22.3],
    note:
      'Natural Earth places the Halayib Triangle in Egypt and Bir Tawil in Sudan — the ' +
      'administrative rather than the treaty line. Both are claimed differently by the two ' +
      'states. Default kept; recorded so the choice is visible rather than accidental.',
  },
  {
    id: 'abyei',
    entities: ['SDN', 'SSD'],
    treatment: 'as-source',
    probe: [28.44, 9.59],
    note: 'Drawn inside Sudan in the source data. Status unresolved under the 2005 CPA. Default kept.',
  },
  {
    id: 'ilemi-triangle',
    entities: ['KEN', 'SSD'],
    treatment: 'as-source',
    probe: [35.0, 4.8],
    note: 'Drawn inside Kenya in the source data, matching de facto administration. Default kept.',
  },
  {
    id: 'ceuta-melilla',
    entities: ['ESP', 'MAR'],
    treatment: 'not-separable',
    probe: [-5.32, 35.89],
    note:
      'Both Spanish cities are generalised into Morocco at 1:50m (probes confirm). This is a ' +
      'artefact of scale, not a Natural Earth position — each is a few square kilometres and ' +
      'falls below the resolution of the dataset. Recorded as a known limitation. Would ' +
      'require the 1:10m dataset to fix, at roughly five times the file size.',
  },
  {
    id: 'gibraltar',
    entities: ['GBR', 'ESP'],
    treatment: 'not-separable',
    probe: [-5.35, 36.14],
    note:
      'Absent from the 1:50m country layer entirely — a probe returns no feature. Below the ' +
      'resolution of the dataset. Recorded as a known limitation.',
  },
];

/**
 * Unordered `A|B` keys for boundaries that render as dashed de facto lines.
 * Consumed by the border partition in atlas.ts. Adding a case above with a
 * `line` is all that is required to change what renders dashed.
 */
export const DE_FACTO_LINE_KEYS: ReadonlySet<string> = new Set(
  DISPUTED_CASES.filter((c) => c.treatment === 'de-facto-line' && c.line).map((c) =>
    borderKey(c.line![0], c.line![1]),
  ),
);

/** Stable unordered key for a pair of codes. */
export function borderKey(a: Alpha3, b: Alpha3): string {
  return a < b ? `${a}|${b}` : `${b}|${a}`;
}

/** Cases mentioning a given code, for future use by the State 3 detail panel. */
export function disputesInvolving(a3: Alpha3): readonly DisputedCase[] {
  return DISPUTED_CASES.filter((c) => c.entities.includes(a3));
}
