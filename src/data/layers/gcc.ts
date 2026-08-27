/**
 * gcc.ts — the Gulf Cooperation Council.
 *
 * Six member states, unchanged since the Council was founded in 1981: Bahrain,
 * Kuwait, Oman, Qatar, Saudi Arabia and the United Arab Emirates. It is the
 * most stable membership list in this directory — the EU has changed twice in
 * that time and Horizon Europe's association list changes every year — which is
 * why this file carries no volatility warning of the kind §7c requires of a
 * programme layer. Check it anyway before a talk; it is one line if it moves.
 *
 * WHY IT IS ONE TIER AND NOT TWO. Every other multi-state layer in this deck
 * has an inner and an outer ring — members and associates, signatories and
 * eligible states. The GCC has neither. There is no associate status, no
 * observer tier that would belong on the map, and no partial membership, so
 * there is nothing for a hatch to say. One solid fill is the honest picture,
 * and it makes this the cleanest layer in the deck to read at distance.
 *
 * THE CIRCUIT DOES REAL WORK HERE. Five of the six share a land border with
 * Saudi Arabia and the UAE and Oman share one with each other, so
 * `arcsWithinMembers` lights an almost fully connected network — the bloc reads
 * as a powered region of the chip rather than six countries coloured in, which
 * is exactly what §7a says the circuit is for. Bahrain is the exception: it is
 * an island, so it takes the fill and joins no conductor. That is accurate, and
 * worth not "fixing" — the causeway to Saudi Arabia is not a border.
 *
 * DELIBERATELY ABSENT, because each is a question somebody may ask:
 *
 *   Yemen        Not a member. It participates in several GCC bodies and has
 *                long sought accession, but it has never joined and is not
 *                drawn as a member.
 *   Iraq         Not a member, and in scope on this map, so it stays lit as
 *                ordinary EMEA land and dark as a non-member. That contrast is
 *                the one to watch on this scene.
 *   Iran         Not a member, and out of scope entirely (§5) — rendered in its
 *                true position, unlit, like Russia and Central Asia.
 *   Jordan,
 *   Morocco      Invited to join in 2011; neither acceded. Both are in scope
 *                and both stay dark.
 *
 * ON QATAR. It was subject to a diplomatic and economic blockade by four Arab
 * states, three of them GCC members, from June 2017 until the Al-Ula
 * declaration of January 2021 — and it remained a GCC member throughout. The
 * map draws it as a member because it was one. This is the disputed.ts policy
 * (§4) applied to a political rupture rather than a boundary: state what the
 * membership is, and stop.
 */
import type { MembershipLayer } from './index';

export const GCC: MembershipLayer = {
  id: 'gcc',
  label: 'GCC · member states',
  description: 'Gulf Cooperation Council — six member states',
  members: ['BHR', 'KWT', 'OMN', 'QAT', 'SAU', 'ARE'],
};
