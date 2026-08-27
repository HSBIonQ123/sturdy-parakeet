/**
 * institutions.ts — places the talk points at that are NOT IonQ presences.
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
 * These markers say "this is where the decision is taken", or "this is a site we
 * are working towards" — never "this is where we are". They are drawn without
 * the bright core for that reason — see render/Markers.tsx. A trap site with no
 * ion in it.
 * ============================================================================
 *
 * THE FILE WIDENED, AND THE INVARIANT DID NOT. It began as seats of government
 * — Westminster — and now also carries an agency the talk is building a
 * technical relationship with (GCHQ) and a campus a system is being proposed
 * into (Sci-Tech Daresbury). What holds every entry together is the negative,
 * not the category: none of them is a place IonQ occupies, and none of them
 * gets a core. Daresbury is the one that has to be watched. The moment a system
 * is actually installed there, the entry moves to deployments.ts with its
 * provenance and earns its core — until then a bright dot on that campus would
 * be announcing a machine that is not there.
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
  {
    id: 'gchq',
    label: 'GCHQ',
    place: 'Cheltenham',
    iso: 'GBR',
    // The Benhall site. One dot is honest at this scale for an organisation on
    // one campus, and `place` names the town rather than implying a gate.
    lat: 51.8996,
    lon: -2.1246,
    kind: 'institution',
    precision: 'site',
    detail: 'Signals intelligence',
    /*
     * Left AND lifted. Cheltenham sits north-west of Oxford and the two are
     * close enough that on the one scene showing both, the labels arrived two
     * pixels apart — GCHQ ending at x988 with Oxford Ionics starting at x986.
     * A right-hand label here does not fix it, because Oxford's runs leftward
     * into the same gap; the pair needs vertical separation, which is what
     * `labelDy` is for. §7e's rule holds: flip or lift a LABEL, never move a
     * dot. The dot is where GCHQ is.
     *
     * Measured on the real build, not estimated, and it costs nothing anywhere
     * else because no other scene draws this marker.
     */
    labelSide: 'left',
    labelDy: -26,
    source:
      'The UK signals intelligence and cyber security agency. A counterparty ' +
      'the talk points at, and emphatically not an IonQ facility.',
  },
  {
    id: 'daresbury',
    label: 'Sci-Tech Daresbury',
    place: 'Daresbury',
    iso: 'GBR',
    // The Sci-Tech Daresbury campus in Cheshire, around the Daresbury
    // Laboratory.
    lat: 53.3437,
    lon: -2.6403,
    kind: 'institution',
    precision: 'site',
    detail: 'Science and innovation campus',
    // NOT an IonQ site, and the dot must keep saying so. See the header: this
    // is a campus a system is being PROPOSED into. If one is ever installed,
    // move this entry to deployments.ts rather than changing its kind here.
    labelSide: 'left',
    source:
      'A national science and innovation campus in Cheshire. Named here as a ' +
      'target site; no IonQ system is installed there.',
  },
];
