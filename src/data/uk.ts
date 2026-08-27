/**
 * uk.ts — what IonQ is engaging the British state ON, department by department.
 *
 * ============================================================================
 * INTERNAL. Three panels, all supplied by Government Affairs (EMEA). They name
 * the specific asks being put to the Treasury — an agreement to buy one of each
 * generation of systems, reform of ProQure, AMCs — say that Number 10 is being
 * used to position IonQ against named competitors, and name a campus a system
 * is being proposed into under an internal codename. Removing it is one import
 * and three scenes.
 * ============================================================================
 *
 * WHY A UK FILE RATHER THAN MORE OF strategy.ts. Same reason `poland.ts` and
 * `germany.ts` are their own files (§7j rule 1): one document, one subject, one
 * file, so that a reviewer asked what we claim about the British government
 * reads exactly one thing. `strategy.ts` is Italy's circuit and would be a
 * strange place to keep the Treasury asks.
 *
 * ACRONYMS AND CODENAMES ARE REPRODUCED, NOT EXPANDED. "DBIST", "HMT",
 * "ProQure", "AMCs" and "project Grizzly" appear exactly as supplied. Expanding
 * any of them would be this project asserting a reading of an internal
 * shorthand — the §4 rule (state what is, and stop) applied to a briefing.
 *
 * THE DEPARTMENT IS "DBIST", AND THAT IS SETTLED. It was supplied that way, the
 * ninety-day source deck says "SoS BIST", and the presenter confirmed it against
 * the "DSIT" that `institutions.ts` used to carry on the Westminster marker.
 * That entry now says DBIST too, so the two places that name the department
 * agree. If it ever changes, they are the two.
 *
 * WHY THREE SCENES AND NOT ONE. The Westminster panel is three routes into one
 * government and reads as a set. Cheltenham and Daresbury are each a single
 * relationship with a single object, and each takes the camera somewhere new —
 * a slide whose whole content is one sentence is not a thin slide if the map
 * under it has moved to the place that sentence is about. Merging them would
 * put four unrelated asks on one panel and three dots that never resolve.
 */
import type { Callout } from './callouts';

const AS_AT = '26 August 2026';

/* ---- Westminster: three routes into one government ------------------- */

export const UK_WESTMINSTER: Callout = {
  id: 'uk-westminster',
  heading: 'United Kingdom · engagement',
  title: 'Current Westminster engagement priorities',
  standfirst:
    'One city, three counterparties, three different asks — which is why they are listed ' +
    'apart rather than as a single government position.',
  // Tethered to Westminster rather than to a separate London dot. The two are
  // about a kilometre apart, which is sub-pixel at any camera this map
  // supports — see the note on the UK scene in deck.ts.
  anchor: 'westminster',
  side: 'right',
  size: 'wide',
  asAt: AS_AT,
  internal: true,
  body: {
    kind: 'sections',
    sections: [
      {
        heading: 'DBIST',
        items: ['Engagement on ecosystem opportunities.'],
      },
      {
        // THREE BULLETS, NOT ONE SENTENCE. They were supplied as three separate
        // asks and they are three different kinds of thing — a purchase
        // commitment, a change to a procurement route, and a funding
        // instrument. Running them together would let the room hear one ask.
        heading: 'HMT',
        items: [
          'An agreement to buy one of each generation of systems.',
          'Reform of ProQure.',
          'AMCs.',
        ],
      },
      {
        heading: 'Number 10',
        items: ['Positioning us against the rest of the field.'],
      },
    ],
  },
  sources: 'IonQ Government Affairs (EMEA). Asks as supplied; acronyms not expanded.',
};

/* ---- Cheltenham ------------------------------------------------------ */

export const UK_GCHQ: Callout = {
  id: 'uk-gchq',
  heading: 'United Kingdom · engagement',
  // TITLED FOR THE COUNTERPARTY, NOT THE TOWN. The subject of the slide is the
  // relationship with GCHQ; Cheltenham is only where it happens to sit, and the
  // marker on the map already says that. A panel titled "Cheltenham" made the
  // geography the headline and left the agency as a subheading under it.
  title: 'GCHQ',
  anchor: 'gchq',
  side: 'right',
  asAt: AS_AT,
  internal: true,
  body: {
    kind: 'sections',
    sections: [
      {
        // No heading: the panel's title is GCHQ, and repeating it here would be
        // the same word twice in two sizes. See Section.heading in callouts.ts.
        items: ['Deepening partnerships on cryptanalysis, with a view to selling capacity.'],
      },
    ],
  },
  sources:
    'IonQ Government Affairs (EMEA). A single line as supplied — the ask is deliberately ' +
    'not elaborated here.',
};

/* ---- Daresbury ------------------------------------------------------- */

export const UK_DARESBURY: Callout = {
  id: 'uk-daresbury',
  heading: 'United Kingdom · engagement',
  title: 'Daresbury',
  anchor: 'daresbury',
  side: 'right',
  asAt: AS_AT,
  internal: true,
  body: {
    kind: 'sections',
    sections: [
      {
        heading: 'Sci-Tech Daresbury',
        items: ['A project Grizzly duplicate.'],
      },
    ],
  },
  sources:
    'IonQ Government Affairs (EMEA). "Project Grizzly" is reproduced as supplied and is ' +
    'not expanded. Nothing is installed at Daresbury — see data/institutions.ts.',
};

export const UK_CALLOUTS: readonly Callout[] = [UK_WESTMINSTER, UK_GCHQ, UK_DARESBURY];
