/**
 * countryBriefs.ts — per-country engagement panels, inside the spokes.
 *
 * The third callout source, after `presenter.ts` (personal) and `policy.ts`
 * (the EU legislative files). This one holds panels that belong to a single
 * country's close-up: what the opportunity is there, what is being asked for,
 * what is in the diary.
 *
 * It is one file rather than one per country deliberately. Five of the six
 * priority states will plausibly want the same treatment Belgium already has,
 * and `poland.ts`, `italy.ts`, `germany.ts` would be five files with one shape
 * between them. The panels are grouped by country below and the ids carry the
 * country prefix, so the file stays navigable as it grows.
 *
 * ============================================================================
 * THE THREE POLAND PANELS ARE SCAFFOLDED AND DELIBERATELY EMPTY.
 *
 * The scene structure, cameras, anchors and layout are built and verified; only
 * the words are missing, because there is nothing in this repository about
 * Polish defence funding, the Polish quantum strategy, or the event in
 * question, and this project does not invent briefing content. See the
 * provenance discipline in deployments.ts and policy.ts — a sentence nobody
 * sourced is exactly what must never reach a panel.
 *
 * To fill them in: replace each `body` below. Nothing else changes — not the
 * deck, not the component, not the styles. If a panel needs the internal stamp
 * and an as-at date, add `internal: true` and `asAt`, as policy.ts does.
 * ============================================================================
 */
import type { Callout } from './callouts';

/** Marks a panel that is built but has no content yet. */
const PENDING = (subject: string) =>
  ({
    kind: 'sections',
    sections: [
      {
        heading: subject,
        note: 'Content to be supplied',
        items: [
          'This panel is scaffolded and intentionally blank. Supplying the text is a data-only edit in src/data/countryBriefs.ts — the scene, camera, anchor and layout are already in place.',
        ],
      },
    ],
  }) as const;

/* ---- Poland ---------------------------------------------------------- */

const POLAND_DEFENCE_FUNDING: Callout = {
  id: 'poland-defence-funding',
  heading: 'Poland · engagement',
  title: 'Defence funding',
  anchor: 'capital-POL',
  side: 'right',
  size: 'wide',
  body: PENDING('Defence funding'),
};

const POLAND_QUANTUM_STRATEGY: Callout = {
  id: 'poland-quantum-strategy',
  heading: 'Poland · engagement',
  title: 'Quantum strategy',
  anchor: 'capital-POL',
  side: 'right',
  size: 'wide',
  body: PENDING('Quantum strategy'),
};

const POLAND_EVENT_OPPORTUNITY: Callout = {
  id: 'poland-event-opportunity',
  heading: 'Poland · engagement',
  title: 'Event opportunity',
  anchor: 'capital-POL',
  side: 'right',
  size: 'wide',
  body: PENDING('Event opportunity'),
};

export const COUNTRY_BRIEF_CALLOUTS: readonly Callout[] = [
  POLAND_DEFENCE_FUNDING,
  POLAND_QUANTUM_STRATEGY,
  POLAND_EVENT_OPPORTUNITY,
];
