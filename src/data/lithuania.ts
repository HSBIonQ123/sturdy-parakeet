/**
 * lithuania.ts — the stakeholder map and visit agenda for Vilnius.
 *
 * ============================================================================
 * INTERNAL. Built from "Stakeholder Mapping for IonQ's Visit to Lithuania",
 * prepared by Fabula. It names an adviser to the Prime Minister and proposes
 * dates for a visit that has not happened. Removing it is one import and two
 * scenes.
 * ============================================================================
 *
 * WHY LITHUANIA GETS THIS AND THE OTHER SPOKES DO NOT. Lithuania holds the
 * Presidency of the Council of the EU when the Quantum Act is debated — the
 * Franco-German assessment names shaping their view of the bill as a priority,
 * and the ninety-day register lists engagement with them as a de-risking driver.
 * So the last spoke in the deck is the one with an actual visit behind it, and
 * the deck ends on a plan rather than on a picture.
 *
 * GROUPED, NOT RANKED. The three groups are the source's own. A minister, an
 * agency and a trade association are three different KINDS of meeting with three
 * different purposes; putting six names in one ordered column would imply a
 * priority order the source does not state and the presenter would then be asked
 * to defend.
 *
 * ONE SOURCE ERROR IS NOT REPRODUCED. The National Cyber Security Centre entry
 * in the source carries the Innovation Agency's "a meeting would help identify
 * relevant local partners…" sentence verbatim — plainly a copy-paste from the
 * preceding page, since it describes the wrong body. It is omitted rather than
 * repaired: `why` is optional on a stakeholder precisely so that a gap in the
 * source can stay a gap instead of becoming an invention. Ask Fabula for the
 * real line and add it here.
 *
 * THE DATES ARE THE PERISHABLE PART. 7–11 September 2026, with the caveat about
 * the parliamentary session, is a proposal and not a booking. Confirm before
 * this goes up.
 */
import type { Callout } from './callouts';

const AS_AT = '26 August 2026';

export const LITHUANIA_STAKEHOLDERS: Callout = {
  id: 'lithuania-stakeholders',
  heading: 'Lithuania · stakeholder map',
  title: 'Three groups, six meetings',
  standfirst:
    'Prepared for a visit to Vilnius. Lithuania holds the Presidency of the Council when ' +
    'the Quantum Act is debated, which is what makes this the one spoke with a plan behind ' +
    'it rather than a picture.',
  size: 'full',
  top: 0.125,
  asAt: AS_AT,
  internal: true,
  body: {
    kind: 'stakeholders',
    groups: [
      {
        id: 'political',
        label: 'Political',
        entries: [
          {
            id: 'ministry-economy',
            name: 'Ministry of the Economy and Innovation',
            what:
              'Shapes policy on the business environment, innovation, investment, ' +
              'digitalisation and economic competitiveness — the key governmental ' +
              'stakeholder for an innovative company entering Lithuania.',
            why:
              'Present our plans, understand Lithuania’s policy priorities and the support ' +
              'mechanisms available, and explore where cooperation could sit.',
          },
          {
            id: 'pm-adviser',
            name: 'Dalia Markinienė',
            role: 'Adviser to the Prime Minister on IT and digitalisation',
            what:
              'Adviser to the new Prime Minister, who took office in July 2026 — the ' +
              'political-level contact for innovation, digital transformation and emerging ' +
              'technologies.',
            why:
              'Establish a horizontal political-level connection inside the new Prime ' +
              'Minister’s team, on the topics where quantum will surface.',
          },
        ],
      },
      {
        id: 'institutional',
        label: 'Institutional',
        entries: [
          {
            id: 'innovation-agency',
            name: 'Innovation Agency Lithuania',
            what:
              'A public agency under the Ministry of the Economy and Innovation, and the ' +
              'entry point for foreign businesses looking for the right partners. ' +
              'Responsible for developing the national innovation ecosystem.',
            why:
              'Identify local partners, understand the ecosystem, and find the practical ' +
              'routes into the market.',
          },
          {
            id: 'ncsc',
            name: 'National Cyber Security Centre',
            role: 'Under the Ministry of National Defence',
            what:
              'The main Lithuanian cyber security institution: unified management of cyber ' +
              'incidents, monitoring and control of cyber security requirements, and ' +
              'accreditation of information resources.',
            // `why` deliberately absent — see the note on the source error in
            // the header. Do not fill this in from the Innovation Agency entry.
          },
        ],
      },
      {
        id: 'academic-business',
        label: 'Academic and business',
        entries: [
          {
            id: 'quantum-lithuania',
            name: 'Quantum Lithuania',
            role: 'Lithuanian Quantum Technologies Association',
            what:
              'A unifying platform bringing together Lithuanian companies, universities and ' +
              'research institutes with national defence and public sector institutions, to ' +
              'support research, development and deployment of quantum technologies.',
            why:
              'Introduce IonQ to the national quantum community, explore cooperation, and ' +
              'identify what comes next.',
          },
          {
            id: 'amcham',
            name: 'The American Chamber of Commerce in Lithuania',
            what:
              'A non-profit, non-political business association representing more than 220 ' +
              'US, international and local companies, and the platform for US–Lithuania ' +
              'business engagement and dialogue with political decision-makers.',
            why:
              'Strengthen business support for representing an American company in ' +
              'Lithuania, increase visibility, and reach a broader network of business and ' +
              'policy stakeholders.',
          },
        ],
      },
    ],
    footnote:
      'Prepared by Fabula. The Cyber Security Centre entry carries no meeting rationale ' +
      'because the source repeated the Innovation Agency’s by mistake; it is left blank ' +
      'rather than guessed at — see data/lithuania.ts.',
  },
  sources: 'Fabula, "Stakeholder Mapping for IonQ’s Visit to Lithuania". Condensed.',
};

export const LITHUANIA_VISIT: Callout = {
  id: 'lithuania-visit',
  heading: 'Lithuania · visit agenda',
  title: 'Vilnius, September',
  anchor: 'capital-LTU',
  /*
   * LEFT, and this is the one panel in the deck that sits there.
   *
   * Vilnius is in the far east of Lithuania, so at any camera that frames the
   * country the dot lands in the right of the frame — exactly where a right-hand
   * panel goes, and its label ran under the box. Brussels and Rome were fixed by
   * shifting the camera east (§7h), but that only works when the subject can
   * afford to move left; here it cannot without pushing Lithuania off-frame.
   * Moving the PANEL costs nothing and needs no camera at all, so the spoke's own
   * framing carries straight through.
   */
  side: 'left',
  size: 'wide',
  asAt: AS_AT,
  internal: true,
  body: {
    kind: 'sections',
    sections: [
      {
        heading: 'Possible dates',
        note: '7–11 September — proposed, not booked',
        items: [
          'The autumn session of the Parliament starts on 10 September, so that date is likely to be the least suitable for political meetings.',
        ],
      },
      {
        heading: 'Location',
        items: [
          'Most of the suggested stakeholders are based in Vilnius city centre.',
          'Fabula can offer a meeting room at its office if one is needed.',
        ],
      },
      {
        heading: 'Why this visit, and why now',
        items: [
          'Lithuania holds the Presidency of the Council of the EU when the Quantum Act is debated; shaping their view of the bill and its implementation is a stated engagement priority.',
          'It is already logged as a de-risking driver against the EMEA-horizon exposure on the ninety-day register — this is the delivery of it.',
        ],
      },
    ],
  },
  sources:
    'Fabula, "IonQ Lithuania Visit Agenda". Dates are a proposal; confirm before presenting.',
};

export const LITHUANIA_CALLOUTS: readonly Callout[] = [
  LITHUANIA_STAKEHOLDERS,
  LITHUANIA_VISIT,
];
