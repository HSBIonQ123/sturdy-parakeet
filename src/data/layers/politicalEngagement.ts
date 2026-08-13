/**
 * politicalEngagement.ts — priority European political engagement.
 *
 * ============================================================================
 * THIS LAYER IS A SELECTION, NOT A MEMBERSHIP.
 *
 * Every layer before it in the deck states a legal or programme fact that can
 * be checked against a published list: the EU 27, the EEA, association to
 * Horizon Europe, signature of the EuroQCI Declaration. This one states an
 * IonQ priority. The six countries are not members of anything in common, and
 * the map must not imply that they are.
 *
 * That has three consequences, and they are the whole design of this file:
 *
 *   1. The label says what it is. "Priority political engagement" — not a
 *      bloc name, not an acronym, nothing that could be mistaken for an
 *      institution the audience is meant to already know.
 *   2. The caption says what it is not. "A selection, not a bloc" is on the
 *      title plate, on screen, for as long as the scene is up.
 *   3. The absences carry no reasons. Elsewhere in layers/ the notes at the
 *      foot of the file explain why a near-miss is dark, because there is a
 *      published rule to point at. There is no such rule here, so inventing
 *      one would be worse than saying nothing — see the note below.
 *
 * CONFIRM THIS LIST BEFORE YOU PRESENT FROM IT, on the same footing as
 * deployments.ts. A priority list moves with the engagement it describes, and
 * it moves faster than treaty membership does. It is also the one layer in
 * the deck where being out of date is invisible: a stale EU layer shows a
 * country in the wrong colour and somebody in the room notices, whereas a
 * stale priority list looks exactly like a current one.
 * ============================================================================
 *
 * ON THE TREATMENT. Solid, in IonQ orange, with no second tier — the deck's
 * grammar since scene 3 has been solid for the primary tier and hatched amber
 * for an associated one, and there is nothing associated here. All six states
 * are asserted on the same footing, so they get one treatment.
 *
 * ON WHAT THE CIRCUIT DRAWS. Three borders qualify — Belgium-Germany,
 * Germany-Poland and Poland-Lithuania — which energise as one chain running
 * Brussels to Vilnius. Italy and the UK light no circuit at all, because
 * neither touches another member. That is honest and it is worth leaving
 * alone: `circuitWith` exists for a layer defined by its relationship to
 * another one, and reaching for it here would light borders with countries
 * that are not on this list, which is precisely the false claim of membership
 * the rest of the file is written to avoid.
 */
import type { MembershipLayer } from './index';

export const POLITICAL_ENGAGEMENT: MembershipLayer = {
  id: 'political-engagement',
  label: 'Priority political engagement',
  description: 'Six states · a selection, not a bloc',

  // No accent and no fillPattern: the default IonQ orange, solid. This layer
  // is never co-active with another, so it holds the primary tier on its own.
  members: [
    'BEL', // Belgium
    'DEU', // Germany
    'GBR', // United Kingdom
    'ITA', // Italy
    'LTU', // Lithuania
    'POL', // Poland
  ],
};

/**
 * NOTES.
 *
 * FIVE OF THE SIX ARE EU MEMBER STATES; THE UNITED KINGDOM IS NOT. The UK is
 * dark on all four preceding scenes — outside the EU since 2020, outside the
 * EEA, and outside EuroQCI — and lights up here for the first time, alongside
 * the IonQ engineering base at Oxford that has sat outside every perimeter
 * the deck has drawn so far. If a question follows the UK through the deck,
 * that is the answer: association is not the same map as engagement.
 *
 * ON THE COUNTRIES THAT ARE ABSENT. France, the Netherlands, Spain, the
 * Nordics, Ireland and Switzerland are all obvious things to ask about, and
 * Switzerland doubly so given where IonQ's European system sits. This file
 * deliberately records no reason for any of them, because it has none to
 * record: absence from a priority list means it is not on the list, and it
 * does not mean a judgement was made and written down. Do not read one into
 * the map, and do not let the map imply one — the layer dims non-members to
 * 45% rather than hiding them, which keeps the rest of the region present
 * and visibly still there.
 *
 * IF THE PRIORITIES SPLIT INTO TIERS. The moment this list needs a second
 * tier — engaged versus watching, say — it becomes two files and a hatched
 * second layer, exactly as scenes 3 and 4 do it. That is a new file plus one
 * line in a scene, and no rendering change.
 */
