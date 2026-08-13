/**
 * places.ts — locations the deck points at, asserting nothing about them.
 *
 * The third marker source, and the quietest. `deployments.ts` says IonQ has
 * something at a place; `institutions.ts` says a place is where decisions are
 * taken; `capitals.ts` states a fact from a gazetteer. This file says only
 * "here", which is sometimes exactly what an opening slide needs and is never
 * something the other three should be stretched to cover.
 *
 * The discipline is the same one disputed.ts sets: state what is, and stop. A
 * marker whose meaning the deck does not know is a marker whose meaning the
 * deck must not invent — so an entry here carries a name, a coordinate, and a
 * source line saying plainly that no claim is attached.
 */
import type { Marker } from './markers';

export const PLACES: readonly Marker[] = [
  {
    id: 'salisbury',
    label: 'Salisbury',
    place: 'Salisbury',
    iso: 'GBR',
    lat: 51.0688,
    lon: -1.7945,
    kind: 'place',
    precision: 'site',
    // No `detail`. The opening scene is one dot and one name, and anything
    // written under it would be a claim this file has no basis for.
    source:
      'Salisbury, Wiltshire. Specified for the opening scene. NO CLAIM IS MADE ' +
      'about an IonQ presence, a customer, or an institution here, and the ' +
      'marker is drawn without the bright core for that reason. If this dot is ' +
      'meant to assert something — a site, a partner, a venue — move it to the ' +
      'file that makes that claim and give it a real provenance line.',
  },
];
