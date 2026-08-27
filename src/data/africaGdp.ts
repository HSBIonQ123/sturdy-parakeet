/**
 * africaGdp.ts — nominal GDP, for exactly one purpose: deriving each African
 * bloc's anchor country.
 *
 * PROVENANCE, STATED PLAINLY. Indicative estimates for 2025 — nominal GDP,
 * current US dollars, billions, on the IMF World Economic Outlook basis. They
 * were transcribed by hand rather than machine-read, because this build has no
 * network access by design. Treat them as good enough to RANK economies, which
 * is all this file is for, and not as citable figures. Nothing prints a number
 * from here on screen; only the ranking reaches the panel.
 *
 * WHY A TABLE OF NUMBERS RATHER THAN FOUR TYPED-IN ANCHORS. Because an anchor
 * written by hand is a claim that can go quietly stale, while one that is
 * computed is a claim you re-check by updating a single number. This is the
 * same argument the risk register's counts make (§7j rule 3) and the same one
 * the pillars' numbering makes: derive the assertion, do not store it beside
 * the data it is supposed to describe. It also means a bloc gaining or losing
 * a member cannot leave a stale anchor behind — the two are the same edit.
 *
 * Coverage is exactly the union of the four membership lists in
 * layers/africaBlocs.ts, which asserts at load that every member it names has
 * an entry here. It is not an Africa GDP table and should not be grown into
 * one: an unused number is a number nobody checks.
 *
 * The figures came across from the sibling project `bug-free-chainsaw`, whose
 * `gdp.ts` exists for the same purpose and carries the same caveats.
 */

/** What the figures are, if anyone needs to say it out loud. */
export const GDP_VINTAGE = '2025 est.';
export const GDP_BASIS = 'Nominal GDP, current US$ (IMF WEO basis)';

/** Nominal GDP in billions of current US dollars. */
export const GDP_USD_BN: Readonly<Record<string, number>> = {
  /* --- West Africa (ECOWAS) --- */
  NGA: 188, CIV: 95, GHA: 88, SEN: 34, GIN: 27, BEN: 22, TGO: 10,
  SLE: 7.2, LBR: 4.9, CPV: 3.0, GMB: 2.9, GNB: 2.1,

  /* --- Central Africa --- */
  AGO: 113, COD: 78, RWA: 15, BDI: 3.0,

  /* --- East Africa and the Horn --- */
  ETH: 145, KEN: 132, UGA: 61, TZA: 85, SDN: 30, SOM: 13, SSD: 6.5,
  DJI: 4.6, ERI: 2.9, MDG: 17, MUS: 16, MWI: 12, COM: 1.4, SYC: 2.3,

  /* --- North Africa --- */
  EGY: 347, TUN: 55, LBY: 47,

  /* --- Southern Africa --- */
  ZAF: 410, ZWE: 32, ZMB: 29, MOZ: 22, BWA: 20, NAM: 13, SWZ: 5.0, LSO: 2.1,
};
