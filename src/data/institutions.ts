/**
 * institutions.ts — seats of government the talk points at.
 *
 * ============================================================================
 * NOTHING IN THIS FILE IS AN IonQ PRESENCE.
 *
 * That is the entire reason it is a separate file from deployments.ts rather
 * than a fifth entry in it. `deployments.ts` asserts, site by site, that IonQ
 * has something there — a machine, a network, an engineering base — and it
 * carries a provenance note per entry because that claim has to be defensible
 * in the room. Putting the Palace of Westminster in that array would make
 * exactly the claim the deck must never make.
 *
 * These markers say "this is where the decision is taken", not "this is where
 * we are". They are drawn without the bright core for that reason — see
 * render/Markers.tsx. A trap site with no ion in it.
 * ============================================================================
 */
import type { Marker } from './markers';

export const INSTITUTIONS: readonly Marker[] = [
  {
    id: 'westminster',
    label: 'Westminster',
    place: 'London',
    iso: 'GBR',
    // The Palace of Westminster itself. Parliament and the Whitehall
    // departments sit within about a kilometre of each other, which is far
    // inside a pixel at any zoom this map supports, so one dot is honest for
    // both — and `place` names the city rather than implying a street address.
    lat: 51.4995,
    lon: -0.1248,
    kind: 'institution',
    precision: 'site',
    detail: 'Parliament and Whitehall',
    // Right, so it diverges from Oxford's left-hand label. The two dots are
    // roughly 80px apart at the UK scene's camera and the labels would
    // otherwise land on top of each other. Markers.tsx will override this at
    // the frame edge, which is the one case where fitting beats preference.
    labelSide: 'right',
    source:
      'Seat of the UK Parliament and, in Whitehall alongside it, the ' +
      'departments a quantum policy conversation runs through — DSIT and the ' +
      'National Quantum Computing Centre’s sponsoring department among them. ' +
      'A location, not an IonQ facility.',
  },
];
