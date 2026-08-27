/**
 * lithuania.ts — the stakeholder map for the Vilnius visit.
 *
 * ============================================================================
 * INTERNAL. Built from "Stakeholder Mapping for IonQ's Visit to Lithuania",
 * prepared by Fabula. It names an adviser to the Prime Minister, for a visit
 * that has not happened. Removing it is one import and one scene.
 * ============================================================================
 *
 * WHY LITHUANIA GETS THIS AND THE OTHER SPOKES DO NOT. Lithuania holds the
 * Presidency of the Council of the EU when the Quantum Act is debated — the
 * Franco-German assessment names shaping their view of the bill as a priority,
 * and the ninety-day register lists engagement with them as a de-risking driver.
 * So the last spoke in the deck is the one with an actual visit behind it, and
 * the deck ends on a plan rather than on a picture.
 *
 * THE VISIT AGENDA IS GONE. A second panel here carried the proposed dates, the
 * location and the case for going; it was cut from the deck and removed from
 * this file rather than left unreferenced. Dead content in a file that names a
 * real adviser is exactly what §7g's separation exists to prevent, and the
 * history has it if the visit comes back.
 *
 * GROUPED, NOT RANKED. The three groups are the source's own. A minister, an
 * agency and a trade association are three different KINDS of meeting with three
 * different purposes; putting six names in one ordered column would imply a
 * priority order the source does not state and the presenter would then be asked
 * to defend.
 *
 * ONE ENTRY'S RATIONALE IS OURS, NOT FABULA'S, AND THE SOURCES LINE SAYS SO.
 * The National Cyber Security Centre entry in the source carried the Innovation
 * Agency's "a meeting would help identify relevant local partners…" sentence —
 * plainly pasted from the preceding page, since it describes the wrong body. It
 * is replaced with a rationale written here, drawn from nothing but the NCSC's
 * own stated remit on the same page: incident management, cyber security
 * requirements and accreditation of information resources. That is a short step
 * to why IonQ would want the meeting, and it is a step this file takes in its
 * own name rather than attributing it to Fabula. `why` stays optional on a
 * stakeholder so a future gap can still be left as one.
 *
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
            // Written here, not by Fabula — see the header. It follows from the
            // remit above and from nothing else.
            why:
              'Open the technical channel where their remit meets ours: quantum-safe ' +
              'cryptography and the post-quantum transition, and what the accreditation ' +
              'of information resources will come to require of it.',
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
  },
  sources:
    'Fabula, "Stakeholder Mapping for IonQ’s Visit to Lithuania". Condensed. The Cyber ' +
    'Security Centre meeting rationale is IonQ’s own — the source repeated the Innovation ' +
    'Agency’s in error.',
};

export const LITHUANIA_CALLOUTS: readonly Callout[] = [LITHUANIA_STAKEHOLDERS];
