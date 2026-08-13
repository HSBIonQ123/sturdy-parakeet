/**
 * horizonEurope.ts — countries associated to Horizon Europe.
 *
 * Horizon Europe (2021-2027, EUR 95.5bn) is the EU's research and innovation
 * framework programme. Participation has two tiers that matter on a map:
 *
 *   EU member states      Full participants by right. Rendered by the `eu`
 *                         layer, solid — this file does not restate them.
 *   Associated countries  Third countries with an association agreement,
 *                         participating on essentially the same terms as
 *                         member states, including eligibility to lead
 *                         consortia and to receive funding.
 *
 * ASSOCIATION IS NOT THE SAME SET AS THE SINGLE MARKET, and that is the whole
 * reason this scene follows the EEA one. Two countries swap sides between
 * them, in opposite directions:
 *
 *   Liechtenstein  EEA member, and NOT associated to Horizon Europe. It has
 *                  consistently declined to associate to the framework
 *                  programmes and is exempted from participating in and
 *                  contributing to them under the EEA Agreement. Its
 *                  institutions may still take part by invitation, at their
 *                  own cost. So it is lit on the EEA scene and dark here.
 *   Faroe Islands  Outside the EU and outside the EEA — explicitly excluded
 *                  when Denmark acceded — and yet ASSOCIATED to Horizon
 *                  Europe in its own right. Dark on the EEA scene and lit
 *                  here.
 *
 * If anyone in the room assumes the research area is just the single market
 * plus friends, those two are the counter-examples, and they are on screen.
 *
 * VERIFIED, NOT REMEMBERED. Association status has moved recently and in both
 * directions — the UK associated from 2024, Switzerland from the 2025 calls
 * after being shut out from 2021 — so this list was checked against current
 * sources rather than written from memory. Re-check it before any talk where
 * the detail carries weight; the authoritative list is the Commission's
 * "List of Participating Countries in Horizon Europe" on the Funding and
 * Tenders portal.
 */
import type { MembershipLayer } from './index';

export const HORIZON_EUROPE: MembershipLayer = {
  id: 'horizon-associated',
  label: 'Horizon Europe · associated',
  description: '22 associated states · 19 in frame',

  // Same accent and same hatch as the EEA layer, deliberately. By this point
  // in the deck the audience has learned that solid means member and hatched
  // means associated; reusing the grammar means scene 4 needs no explaining,
  // and the eye reads the change as the SAME category covering more ground.
  accent: '#FFB700',
  fillPattern: 'hatch',

  members: [
    // --- EEA / EFTA ---
    'ISL', // associated 2021, among the first two
    'NOR', // associated 2021, among the first two
    'CHE', // associated for calls from the 2025 budget year onward, after
    //        being treated as a non-associated third country from 2021
    'FRO', // Faroe Islands — associated despite being outside the EU and EEA

    // --- United Kingdom ---
    'GBR', // associated for grant agreements from 2024. Note the carve-outs:
    //        no European Innovation Council Fund equity investment, and the
    //        UK is NOT associated to Euratom, which is a separate programme.

    // --- Western Balkans ---
    'ALB',
    'BIH',
    'MKD',
    'MNE',
    'SRB',
    'XKX', // Kosovo, under the user-assigned code — see disputed.ts

    // --- Eastern Partnership and the Caucasus ---
    'UKR',
    'MDA',
    'GEO',
    'ARM',

    // --- Türkiye ---
    'TUR',

    // --- Southern Neighbourhood ---
    'ISR',
    'TUN',
    'EGY', // negotiations concluded 2025
  ],

  /**
   * Extend the circuit across the borders this layer shares with the EU, not
   * only those between its own members. The research area is defined by its
   * reach outward from the Union, and drawing only member-to-member borders
   * would show a scattering of disconnected fragments instead of a network.
   *
   * Arcs already claimed by the higher-precedence `eu` layer are not redrawn —
   * MemberCircuit deduplicates in LAYERS order, so no border is ever stroked
   * twice and no two pulses can drift out of phase along one line.
   */
  circuitWith: ['eu'],
};

/**
 * ASSOCIATED BUT NOT ON THIS MAP.
 *
 * Canada, New Zealand and the Republic of Korea are associated to Horizon
 * Europe and are outside EMEA, so they render unlit like any other
 * out-of-scope country. That is why the description says 22 associated states
 * but 19 in frame. Worth having ready: the programme's association list is
 * explicitly global, not European, and those three are the proof.
 *
 * DELIBERATELY ABSENT, and each a live question:
 *
 * Liechtenstein (LIE)
 *   See the header. Opted out; not an oversight.
 *
 * Morocco (MAR)
 *   Began the association process, and negotiations are currently paused.
 *   Moroccan entities can still participate under transitional arrangements.
 *   Not associated, so not lit. This one is worth checking before a talk that
 *   touches North African research partnerships, because it could move.
 *
 * Algeria, Libya, and most of sub-Saharan Africa
 *   Not associated. But note a separate rule this map does not currently
 *   show: entities from low- and middle-income countries are AUTOMATICALLY
 *   eligible for Horizon Europe funding without any association agreement,
 *   which covers most of the African continent. If a talk is about African
 *   research partnerships, that is a far bigger story than the association
 *   list, and it deserves its own scene rather than being folded into this
 *   one — the two tiers mean different things and merging them would misstate
 *   both.
 *
 * Russia and Belarus
 *   Cooperation suspended since 2022. Not associated and not eligible.
 */
