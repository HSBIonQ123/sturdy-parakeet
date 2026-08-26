/**
 * deployments.ts — IonQ sites and deployments in EMEA.
 *
 * ============================================================================
 * CONFIRM THIS LIST BEFORE YOU PRESENT FROM IT.
 *
 * Four entries were supplied directly by IonQ Government Affairs (EMEA); two
 * were established from public announcements and carry their sources. Anything
 * commercially sensitive, unannounced or under NDA is by definition absent, so
 * treat this as a starting point rather than a register. Adding a site is one
 * object in the array below and nothing else changes.
 * ============================================================================
 *
 * ON WHAT COUNTS AS A SITE. `kind` is typed rather than lumped together,
 * because a national QKD network, an installed quantum computer and an
 * engineering campus are three different claims and a policymaker will hear
 * them differently. All three currently render the same dot, and `kind` is what
 * the EuroQCI scene selects on — it takes `network` and nothing else, so the
 * field decides what appears on a slide, not just what a source note says. If
 * you also want the networks to out-read the rest wherever they are shown
 * together, that is one clause in Markers.tsx.
 *
 * ON POSITIONS. `precision` says whether the coordinate is the actual site or
 * just the country. QuantumBasel is at Arlesheim, which is where the machine
 * physically is — a dot on Bern would be wrong. The QKD networks are national
 * in scope and genuinely have no single point, so they sit on the capital and
 * say so. Do not let a country-level marker imply a street address.
 *
 * This is also the first use of the ion metaphor from the original brief:
 * markers are drawn as ions held in the trap, on the same conductor network
 * the borders form. State 3's capitals use the same component.
 */
import type { Marker } from './markers';

/*
 * The shape lives in markers.ts now, shared with institutions.ts and, in
 * State 3, with capitals. `SiteKind` was folded into `MarkerKind` there when
 * the second source arrived — the kinds in this file are unchanged, and the
 * new `institution` kind deliberately cannot appear in this array, because
 * every entry here asserts an IonQ presence.
 */

const IDQ =
  'IonQ via ID Quantique, acquired 2025. Supplied by IonQ Government Affairs (EMEA).';

export const DEPLOYMENTS: readonly Marker[] = [
  /* ---- National QKD networks, inside EuroQCI ---------------------- */
  {
    id: 'poland',
    label: 'Poland',
    place: 'Warsaw',
    iso: 'POL',
    lat: 52.23,
    lon: 21.01,
    kind: 'network',
    precision: 'country',
    detail: 'ID Quantique · QKD',
    source: IDQ,
  },
  {
    id: 'slovakia',
    label: 'Slovakia',
    place: 'Bratislava',
    iso: 'SVK',
    lat: 48.15,
    lon: 17.11,
    kind: 'network',
    precision: 'country',
    detail: 'ID Quantique · QKD',
    // Default side, deliberately not `left`: a left label here runs head-on
    // into QuantumBasel's, Bratislava and Arlesheim being close enough on
    // screen that only one of them can label leftward. No scene shows both any
    // more — the EuroQCI slide takes the networks only — so this costs nothing
    // today and is the right default the moment one does again.
    source:
      IDQ +
      ' Slovakia’s first national quantum communication network, delivered as ' +
      'the country’s contribution to EuroQCI.',
  },
  {
    id: 'romania',
    label: 'Romania',
    place: 'Bucharest',
    iso: 'ROU',
    lat: 44.43,
    lon: 26.1,
    kind: 'network',
    precision: 'country',
    detail: 'ID Quantique · QKD',
    source:
      IDQ +
      ' Nationwide network of 36 quantum-secured links over 1,500 km, connecting ' +
      'Bucharest, Iași, Timișoara, Craiova, Cluj-Napoca and Constanța. ' +
      'One dot understates this one — worth saying out loud.',
  },
  {
    id: 'greece',
    label: 'Greece',
    place: 'Athens',
    iso: 'GRC',
    lat: 37.98,
    lon: 23.73,
    kind: 'network',
    precision: 'country',
    detail: 'ID Quantique · QKD',
    source: IDQ,
  },

  /* ---- Compute and engineering, outside EuroQCI -------------------- */
  {
    id: 'quantumbasel',
    label: 'QuantumBasel',
    place: 'Arlesheim',
    iso: 'CHE',
    // The Uptown Basel campus at Arlesheim, outside Basel. Not Bern.
    lat: 47.4923,
    lon: 7.6186,
    kind: 'system',
    precision: 'site',
    detail: 'Forte Enterprise',
    labelSide: 'left',
    source:
      'IonQ / QuantumBasel partnership; the first IonQ quantum computer in Europe, ' +
      'hosted at the Uptown Basel campus, Arlesheim.',
  },
  {
    id: 'oxford',
    label: 'Oxford Ionics',
    place: 'Oxford',
    iso: 'GBR',
    lat: 51.752,
    lon: -1.2577,
    kind: 'engineering',
    precision: 'site',
    detail: 'Ion-trap engineering',
    labelSide: 'left',
    source: 'IonQ acquisition of Oxford Ionics, completed September 2025.',
  },
];

/**
 * HOW THIS READS ON THE EuroQCI SCENE.
 *
 * The scene shows the QKD networks ONLY — Poland, Slovakia, Romania and Greece,
 * all four inside the highlighted area, all four EuroQCI signatories with IonQ
 * networks delivered through ID Quantique. That is the substance of the slide:
 * the argument is not that IonQ would like to be part of EuroQCI, it is that
 * IonQ hardware is already carrying national contributions to it in four member
 * states.
 *
 * QuantumBasel and Oxford Ionics are deliberately NOT on it. Both are true and
 * both are outside the perimeter — Switzerland is excluded from EuroQCI
 * outright, being EFTA but not EEA, and the United Kingdom has been a third
 * country since 2020 — but a slide whose argument is "IonQ is already inside
 * this programme" should not spend two of its six dots on sites that are not.
 * They still carry their own scenes: Oxford is half the content of the UK
 * spoke, and adding a QuantumBasel scene is one block in deck.ts.
 *
 * The filter is `kind === 'network'`, applied through NETWORK_DEPLOYMENT_IDS
 * below, so this stays derived rather than hand-listed: a fifth national
 * network appears on the scene the moment it is added to the array above, and a
 * second European system does not.
 */

export const DEPLOYMENTS_BY_ISO: Readonly<Record<string, readonly Marker[]>> =
  DEPLOYMENTS.reduce<Record<string, Marker[]>>((acc, d) => {
    (acc[d.iso] ??= []).push(d);
    return acc;
  }, {});

/** Countries with at least one site. Ready to become a membership layer. */
export const DEPLOYMENT_COUNTRIES: readonly string[] = [
  ...new Set(DEPLOYMENTS.map((d) => d.iso)),
];

/**
 * Every IonQ site, by id — what a scene lists when it wants the full set.
 * Derived rather than written out, so adding a site to the array above reaches
 * any scene that asks for the set and cannot leave the two disagreeing.
 *
 * No scene currently uses it: the EuroQCI slide takes the networks only (see
 * the note above) and the UK spoke names its two markers. It stays because
 * "the whole IonQ set" is the case scenes/types.ts documents, and a scene that
 * wants it should not have to re-derive it.
 */
export const DEPLOYMENT_IDS: readonly string[] = DEPLOYMENTS.map((d) => d.id);

/**
 * The national QKD networks, by id — the EuroQCI scene's set.
 *
 * Derived on `kind` rather than listed, so the scene keeps stating a category
 * ("the networks") instead of a snapshot of four countries. Add a fifth
 * national network to the array above and it lights on that slide; add another
 * installed system and it does not.
 */
export const NETWORK_DEPLOYMENT_IDS: readonly string[] = DEPLOYMENTS.filter(
  (d) => d.kind === 'network',
).map((d) => d.id);
