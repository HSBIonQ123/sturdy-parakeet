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

/* ---- Lithuania ------------------------------------------------------- */

/*
 * The visit stakeholder mapping, reproduced verbatim, one scene per group.
 *
 * TWO THINGS ARE NOT VERBATIM, and both are deliberate.
 *
 * 1. The source runs several words together where the PDF's font kerning
 *    dropped the spaces — "DaliaMarkinienėservesasAdviser". The spaces are
 *    restored and nothing else is touched; this is transcription, not editing.
 *
 * 2. The National Cyber Security Centre's second bullet in the source is a
 *    copy-paste error: it repeats the Innovation Agency's meeting rationale
 *    word for word, down to naming the Innovation Agency. Reproducing it would
 *    put an obvious mistake on screen and attribute the wrong purpose to the
 *    wrong institution; inventing a replacement would be worse. So the entry
 *    carries what the NCSC IS — which is accurate and sourced — and says on
 *    screen that the rationale is still to come. Delete the `note` once the
 *    real sentence arrives.
 */
const LT_HEADING = 'Lithuania · visit';

const LITHUANIA_POLITICAL: Callout = {
  id: 'lithuania-political',
  heading: LT_HEADING,
  title: 'Political stakeholders',
  standfirst:
    'Three main stakeholder groups are recommended for the visit to Lithuania.',
  anchor: 'capital-LTU',
  side: 'right',
  size: 'wide',
  internal: true,
  body: {
    kind: 'sections',
    sections: [
      {
        heading: 'Ministry of the Economy and Innovation of the Republic of Lithuania',
        items: [
          'The Ministry of the Economy and Innovation of the Republic of Lithuania is responsible for shaping policies related to business environment, innovation, investment, digitalisation and economic competitiveness, making it a key governmental stakeholder for innovative companies entering Lithuania.',
          'A meeting with the Ministry would provide an opportunity to present the company’s plans, understand Lithuania’s policy priorities and available support mechanisms, and explore potential areas for cooperation.',
        ],
      },
      {
        heading: 'Dalia Markinienė — Adviser to the Prime Minister on IT and Digitalisation Issues',
        items: [
          'Dalia Markinienė serves as Adviser to the new Prime Minister, who took office in July 2026, on IT and Digitalisation, making her a relevant political-level contact for issues related to innovation, digital transformation and emerging technologies.',
          'A meeting with her would help establish a horizontal political-level connection within the new Prime Minister’s team, particularly on topics where innovation, digitalisation and quantum technologies may arise.',
        ],
      },
    ],
  },
};

const LITHUANIA_INSTITUTIONAL: Callout = {
  id: 'lithuania-institutional',
  heading: LT_HEADING,
  title: 'Institutional stakeholders',
  anchor: 'capital-LTU',
  side: 'right',
  size: 'wide',
  internal: true,
  body: {
    kind: 'sections',
    sections: [
      {
        heading: 'Innovation Agency',
        items: [
          'Innovation Agency Lithuania is a public agency operating under the Ministry of the Economy and Innovation.',
          'Innovation Agency Lithuania serves as an entry point for foreign businesses seeking to connect with the right partners in Lithuania and is responsible for developing the country’s innovation ecosystem.',
          'A meeting with Innovation Agency Lithuania would help identify relevant local partners, better understand Lithuania’s innovation ecosystem, and explore practical opportunities for entering the Lithuanian market.',
        ],
      },
      {
        heading: 'National Cyber Security Centre',
        // Reads on screen, in a room — not as a note to a developer.
        note: 'Meeting rationale to be supplied',
        items: [
          'National Cyber Security Centre under the Ministry of National Defence (NCSC) is the main Lithuanian cyber security institution, responsible for unified management of cyber incidents, monitoring and control of the implementation of cyber security requirements, accreditation of information resources.',
        ],
      },
    ],
  },
};

const LITHUANIA_ACADEMIC: Callout = {
  id: 'lithuania-academic',
  heading: LT_HEADING,
  title: 'Academic and business stakeholders',
  anchor: 'capital-LTU',
  side: 'right',
  size: 'wide',
  internal: true,
  body: {
    kind: 'sections',
    sections: [
      {
        heading: 'Lithuanian Quantum Technologies Association (“Quantum Lithuania”)',
        items: [
          'Quantum Lithuania is a dynamic community established to promote cooperation and innovation in the field of quantum technologies.',
          'The Association acts as a unifying platform, bringing together Lithuanian companies, universities and research institutes, as well as national defence and public sector institutions, to support the research, development and deployment of quantum technologies.',
          'A meeting with Quantum Lithuania would provide an opportunity to introduce the company to Lithuania’s quantum technology community, explore potential cooperation, and identify future opportunities.',
        ],
      },
      {
        heading: 'The American Chamber of Commerce in Lithuania',
        items: [
          'AmCham Lithuania is a non-profit, non-political, non-governmental business association representing more than 220 U.S., international and local companies in Lithuania.',
          'AmCham Lithuania provides a platform for U.S. - Lithuania business engagement, promoting trade and investment, advocating for members’ interests, and facilitating dialogue between the business community and political decision-makers.',
          'A meeting with AmCham Lithuania would provide an opportunity to strengthen business support for representing an American company in Lithuania, increase visibility, and access a broader network of business and policy stakeholders.',
        ],
      },
    ],
  },
};

const LITHUANIA_AGENDA: Callout = {
  id: 'lithuania-agenda',
  heading: LT_HEADING,
  title: 'IonQ Lithuania visit agenda',
  anchor: 'capital-LTU',
  side: 'right',
  size: 'wide',
  internal: true,
  sources: 'Stakeholder mapping supplied for IonQ’s visit to Lithuania.',
  body: {
    kind: 'sections',
    sections: [
      {
        heading: 'Agenda',
        items: [
          'Possible meeting dates: 7–11 September',
          'Please note that the autumn session of the Parliament starts on 10 September; therefore, this date is likely to be the least suitable for political meetings.',
          'Location: Most of the suggested stakeholders are based in Vilnius city centre. If needed, Fabula can also offer a meeting room at its office.',
        ],
      },
    ],
  },
};

export const COUNTRY_BRIEF_CALLOUTS: readonly Callout[] = [
  POLAND_DEFENCE_FUNDING,
  POLAND_QUANTUM_STRATEGY,
  POLAND_EVENT_OPPORTUNITY,
  LITHUANIA_POLITICAL,
  LITHUANIA_INSTITUTIONAL,
  LITHUANIA_ACADEMIC,
  LITHUANIA_AGENDA,
];
