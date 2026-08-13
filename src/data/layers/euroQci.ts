/**
 * euroQci.ts — the European Quantum Communication Infrastructure.
 *
 * EuroQCI is the EU's secure quantum communication network: a terrestrial
 * segment of fibre linking strategic sites nationally and across borders, and
 * a space segment of satellites linking the national networks. Targeted to be
 * operational by 2027. Two tiers matter on a map:
 *
 *   Signatories   All 27 EU member states have signed the EuroQCI
 *                 Declaration. Ireland was the 27th, completing the set.
 *   Eligible      Participation extends to legal entities established in
 *                 Norway, Iceland and Liechtenstein — the EEA EFTA states.
 *
 * TWO REASONS THIS IS NOT JUST "THE EU AGAIN".
 *
 * First, the eligible set is the 27 PLUS the three EEA EFTA states, so the
 * map is genuinely wider than scene 2.
 *
 * Second, and more useful in the room: **Switzerland is excluded.** It is an
 * EFTA member but not an EEA member, and EuroQCI eligibility runs through the
 * EEA. So Switzerland is lit on the EEA scene, lit on the Horizon Europe
 * scene, and dark here — while Liechtenstein, which declined to associate to
 * Horizon Europe, is lit here. Every programme draws a different map, and by
 * this point in the deck that is the argument the sequence has been making.
 *
 * VERIFIED, NOT REMEMBERED — see CLAUDE.md §7c. Eligibility rules for EU
 * programmes move, and there are live proposals that would change which third
 * countries can take part in quantum and space research. Re-check before a
 * talk where the detail carries weight.
 */
import type { MembershipLayer } from './index';
import { EU } from './eu';

/**
 * The 27 signatories. Membership is taken from the EU layer rather than
 * restated, so there is one list of EU member states in this project and a
 * future accession cannot leave the two disagreeing.
 */
export const EUROQCI: MembershipLayer = {
  id: 'euroqci',
  label: 'EuroQCI · signatories',
  description: 'All 27 EU member states',
  members: EU.members,
};

/**
 * The EEA EFTA states, eligible to participate but not signatories of the
 * Declaration. Hatched, in the same grammar the deck has used since scene 3:
 * solid means in, hatched means associated with it.
 */
export const EUROQCI_ELIGIBLE: MembershipLayer = {
  id: 'euroqci-eligible',
  label: 'EuroQCI · eligible',
  description: 'Norway, Iceland, Liechtenstein',
  accent: '#FFB700',
  fillPattern: 'hatch',
  members: ['ISL', 'LIE', 'NOR'],
  // Light the borders these states share with the Union as well as with each
  // other — otherwise the layer draws nothing, since none of the three touch.
  circuitWith: ['euroqci'],
};

/**
 * DELIBERATELY ABSENT.
 *
 * Switzerland (CHE)
 *   The headline exclusion. EFTA but not EEA, and EuroQCI eligibility runs
 *   through the EEA. Have this ready — it is the obvious question given where
 *   IonQ's European system sits.
 *
 * United Kingdom (GBR)
 *   A third country since 2020. Associated to Horizon Europe but outside
 *   EuroQCI.
 *
 * Türkiye, Ukraine, the Western Balkans, Israel
 *   All associated to Horizon Europe and none of them in EuroQCI. Research
 *   association and infrastructure participation are different instruments
 *   with different maps, which is precisely why they are different scenes.
 */
