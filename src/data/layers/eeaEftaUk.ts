/**
 * eeaEftaUk.ts — the European states outside the EU 27.
 *
 * Five countries, and no two of them have the same relationship with the
 * Union. That is the point of the slide, and it is why the notes below are
 * longer than the data: in a room of policymakers the question is never "who
 * is on the map", it is "on what terms".
 *
 *   Iceland, Liechtenstein, Norway   EEA Agreement. In the single market for
 *                                    goods, services, capital and people.
 *                                    Adopt most EU law without a vote on it.
 *                                    Also EFTA members.
 *   Switzerland                      EFTA member but NOT in the EEA — rejected
 *                                    accession by referendum in 1992. Access is
 *                                    via a stack of ~120 bilateral agreements.
 *   United Kingdom                   Neither. Left the EU in 2020 and the
 *                                    single market and customs union in 2021.
 *                                    Trade runs on the TCA, a free trade
 *                                    agreement with zero tariffs but customs
 *                                    and regulatory checks.
 *
 * Grouping them into one layer is a presentation decision, not a claim that
 * their positions are equivalent. If a talk needs Switzerland or the UK
 * distinguished, split this file — the layer contract makes that a new file
 * plus one line in a scene, and nothing else.
 *
 * ON THE COLOUR: this layer carries an explicit accent, the amber stop of the
 * IonQ logo gradient (#FF5000 -> #FF8300 -> #FFB700). It is a step along the
 * brand's own gradient rather than a new hue, so the tiers read as two states
 * of one thing rather than as two categories in a chart. The palette
 * discipline — one brand accent, everything else neutral — is intact.
 *
 * The hue shift alone is not enough to carry the tier, and the fill is hatched
 * for that reason — see `fillPattern` in ./index.ts for the measurement.
 */
import type { MembershipLayer } from './index';

export const EEA_EFTA_UK: MembershipLayer = {
  id: 'eea-efta-uk',
  label: 'EEA, EFTA and the UK',
  description: 'Five states beyond the 27',
  accent: '#FFB700',
  // Hatched, not solid. See the note on `fillPattern` in ./index.ts: at the
  // alpha a fill needs, no two stops of the IonQ gradient separate enough to
  // read across a room. Solid-versus-hatched does, and it is the convention
  // this audience already reads as member-versus-associated.
  fillPattern: 'hatch',
  members: ['CHE', 'GBR', 'ISL', 'LIE', 'NOR'],

  /**
   * Energise this layer's borders WITH the EU as well as within itself.
   *
   * Without this the layer would light almost nothing: the only border between
   * two of its own members is Liechtenstein-Switzerland. With it, the circuit
   * extends outward from the EU across Norway-Sweden, Norway-Finland,
   * Switzerland's Alpine borders and the rest — which is the actual shape of
   * the story, the single market reaching past the Union's own edge.
   *
   * Borders already claimed by the higher-precedence `eu` layer are not drawn
   * again; MemberCircuit deduplicates across layers in LAYERS order. That
   * matters more than it looks: two circuits over one border would stroke it
   * twice and the pulses would drift out of phase, which is the exact fault
   * the whole border architecture exists to prevent.
   */
  circuitWith: ['eu'],
};

/**
 * NOTES ON WHAT IS DELIBERATELY ABSENT.
 *
 * Faroe Islands (FRO)
 *   Danish, but outside both the EU and the EEA — explicitly excluded when
 *   Denmark acceded, and it has its own fisheries and trade arrangements.
 *   Correctly stays unlit beside a lit Denmark. Unlike Åland in the EU layer,
 *   this is a real legal distinction rather than a rendering artefact.
 *
 * Isle of Man, Jersey, Guernsey (IMN, JEY, GGY)
 *   Crown Dependencies. Not part of the United Kingdom, and not in the EU,
 *   EEA or EFTA in their own right. They stay unlit beside a lit UK. At 1:50m
 *   each is a few pixels, so the visual cost of being correct is nil.
 *
 * Greenland (GRL)
 *   Out of EMEA scope on this map, and outside the EU since 1985 in any case.
 *
 * Andorra, Monaco, San Marino, Vatican City
 *   Micro-states with customs-union or monetary arrangements rather than EEA
 *   or EFTA membership. Including them would need a fourth tier to say
 *   anything true, and they are sub-pixel at region scale.
 *
 * Türkiye
 *   In a customs union with the EU since 1995, and an accession candidate.
 *   Neither EEA nor EFTA, so it does not belong here. It is a strong candidate
 *   for its own scene if the talk goes near enlargement.
 */
