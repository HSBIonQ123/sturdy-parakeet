/**
 * eu.ts — European Union member states.
 *
 * The first membership layer, and therefore the worked example of the layer
 * contract: this file is an array of alpha-3 codes and nothing else. It knows
 * no geometry, sets no colour and touches no rendering code.
 *
 * 27 member states, as at the date of this file. Membership is a legal fact,
 * so the judgement calls below are about which POLYGONS light up, not about
 * who is a member.
 */
import type { MembershipLayer } from './index';

export const EU: MembershipLayer = {
  id: 'eu',
  label: 'European Union',
  description: '27 member states',
  members: [
    'AUT', 'BEL', 'BGR', 'CYP', 'CZE', 'DEU', 'DNK', 'ESP', 'EST', 'FIN',
    'FRA', 'GRC', 'HRV', 'HUN', 'IRL', 'ITA', 'LTU', 'LUX', 'LVA', 'MLT',
    'NLD', 'POL', 'PRT', 'ROU', 'SVK', 'SVN', 'SWE',

    // Åland is a separate feature in the topology but is part of Finland and
    // is EU territory (with treaty derogations on taxation and land). Included
    // so the Baltic does not show an unlit speck between two lit members,
    // which would read as a rendering fault rather than a legal distinction.
    'ALA',
  ],
};

/**
 * NOTES ON WHAT IS DELIBERATELY ABSENT — every one of these is a question
 * somebody in the room may ask.
 *
 * United Kingdom (GBR)
 *   Withdrew 31 January 2020. Not a member. It stays in scope and keeps its
 *   pulsing borders, it simply is not tinted.
 *
 * Northern Cyprus (XNC)
 *   The whole island acceded in 2004, so the north is de jure EU territory —
 *   but the acquis is suspended there under Protocol 10. Our XNC polygon is
 *   therefore NOT tinted, while CYP is. That is the careful rendering: it
 *   shows where EU law actually applies without asserting anything about
 *   sovereignty, which is consistent with the policy in disputed.ts.
 *
 * Greenland (GRL)
 *   Left the EEC in 1985 after a referendum, and is an Overseas Country and
 *   Territory rather than a member. Out of scope on this map in any case.
 *
 * Faroe Islands (FRO)
 *   Never joined; explicitly excluded when Denmark acceded.
 *
 * Isle of Man, Jersey, Guernsey (IMN, JEY, GGY)
 *   Crown Dependencies, never EU members.
 *
 * Norway, Iceland, Liechtenstein, Switzerland
 *   EEA and EFTA, not the EU. A single-market layer would be its own file.
 *
 * French overseas departments, the Canaries, Madeira, the Azores
 *   Outermost regions and part of the EU. They sit inside the France, Spain
 *   and Portugal features, so they are tinted automatically — which is
 *   correct, and is why hovering France lights Guiana and Réunion.
 *
 * Candidate countries (Ukraine, Moldova, Georgia, the Western Balkans,
 * Türkiye)
 *   Deliberately not shown here. Accession is a separate story and deserves
 *   its own scene rather than a second reading layered onto this one.
 */
