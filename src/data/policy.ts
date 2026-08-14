/**
 * policy.ts — the live EU files: public procurement, and the Quantum Act.
 *
 * ============================================================================
 * INTERNAL. Supplied as two Government Affairs information boxes dated
 * 13 August 2026, both marked "IonQ — Internal / Confidential", and reproduced
 * here VERBATIM at the presenter's instruction for an internal company meeting.
 *
 * The content states, among other things, that no group entity is a clean EU
 * participant, and it sets out where the negotiating leverage is. Every panel
 * built from this file therefore carries `internal: true`, which stamps it on
 * screen — the point being that nobody can be on one of these scenes, in a room,
 * and not know what is behind them.
 *
 * It is also the most perishable content in the project. The PPA publishes on
 * 9 September 2026 and the Quantum Act timeline says in its own words that every
 * date downstream of publication moves with the publication date. The as-at date
 * is printed on every panel so a stale build is visibly stale, the same
 * reasoning as the priority engagement layer in §7f.
 * ============================================================================
 *
 * TEXT IS REPRODUCED AS WRITTEN. Not condensed, not paraphrased, not tidied —
 * this is an assessment with named advisers behind it, and shortening a sentence
 * about a legal eligibility test is how a briefing turns into a claim nobody
 * checked. If a panel does not fit, the fix is the layout (see `size`) or a
 * split across two scenes, never the words.
 */
import type { Callout } from './callouts';

const AS_AT = '13 August 2026';

/* ---- EU Public Procurement Regulation ------------------------------- */

const PPA_TITLE = 'EU Public Procurement Regulation (PPA)';

const PPA_SITUATION: Callout = {
  id: 'ppa-situation',
  heading: 'EU file · procurement',
  title: PPA_TITLE,
  anchor: 'capital-BEL',
  side: 'right',
  size: 'wide',
  asAt: AS_AT,
  internal: true,
  body: {
    kind: 'sections',
    sections: [
      {
        heading: 'Situation',
        items: [
          'Commission proposal now due 9 September after repeated delay. Defence is explicitly out of scope (separate Defence Procurement revision, same day).',
          'Leaked draft embeds economic-security criteria: critical technologies, strategic dependency on third-country suppliers, foreign ownership and control, exposure to third-country law.',
          'Quantum is already an EU-designated critical technology. Final text is expected to differ from the leak.',
        ],
      },
      {
        heading: 'Risk',
        note: 'Material — severity not fixable until publication',
        items: [
          'Where governments, research institutions or critical-infrastructure operators buy quantum systems or quantum communication infrastructure, authorities could question dependence on a non-EU-controlled supplier — including from allied states.',
          'US and UK coverage under international procurement commitments gives real protection, but not where security or strategic-dependency grounds are invoked.',
          'Upside: heavier weighting of technical quality and innovation over lowest price.',
        ],
      },
    ],
  },
};

const PPA_ACTION: Callout = {
  id: 'ppa-action',
  heading: 'EU file · procurement',
  title: PPA_TITLE,
  anchor: 'capital-BEL',
  side: 'right',
  size: 'wide',
  asAt: AS_AT,
  internal: true,
  sources:
    'Rud Pedersen assessment, 13 Aug 2026; Alber & Geiger review of the leaked draft ' +
    '(not under contract). Course of action per Rud Pedersen recommendation.',
  body: {
    kind: 'sections',
    sections: [
      {
        heading: 'Timeline',
        items: [
          '9 Sep 2026 — publication. Text is already substantively closed; remaining process is internal.',
          'Sep–Nov 2026 — assess published provisions against IonQ’s EMEA footprint and pipeline.',
          'Late 2026 – early 2027 — Parliament and Council negotiations: the point of leverage.',
          '2027 — trilogues; Commission re-engages as co-negotiator.',
        ],
      },
      {
        heading: 'IonQ next steps',
        items: [
          'Monitor to publication. No Commission outreach now — external input will not move a closed text.',
          'On publication, assess clause by clause: eligibility tests, security grounds, ownership and control language.',
          'Build the position for the Parliament and Council phase: eligibility should turn on operational control, European footprint and where the work is done, not corporate domicile.',
          'Track the PPA / EU Quantum Act interaction — Quantum Act procurement provisions would likely apply as lex specialis.',
        ],
      },
    ],
  },
};

/* ---- EU Quantum Act -------------------------------------------------- */

const ACT_TITLE = 'EU Quantum Act';

const ACT_SITUATION: Callout = {
  id: 'quantum-act-situation',
  heading: 'EU file · Quantum Act',
  title: ACT_TITLE,
  anchor: 'capital-BEL',
  side: 'right',
  size: 'wide',
  asAt: AS_AT,
  internal: true,
  body: {
    kind: 'sections',
    sections: [
      {
        heading: 'Situation',
        items: [
          'A binding regulation delivering the Quantum Europe Strategy: R&I coordination, industrial capacity including pilot lines and a design facility, and supply-chain resilience and governance.',
          'Slipped from Q2 2026 in the Commission Work Programme. Now expected late 2026; Rud Pedersen indicate December. The institutions’ joint roadmap targets agreement by Q3 2027.',
          'France and Germany signed common positions on the Act on 17 July, reported to run to seven priorities including procurement, financing and governance. The text is not published.',
          'We did not respond to the Call for Evidence. The pre-publication window is where our first EU record is made.',
        ],
      },
      {
        heading: 'Risk',
        note: 'Structural — no group entity is a clean EU participant',
        items: [
          'An eligibility test built on ownership and ultimate control would close in law the channel already closed to us in practice. AGILE is the working template: establishment, control and asset-location conditions, on an associated-country list that excludes both the US and the UK — so Oxford Ionics confers no eligibility.',
          'SkyWater (completed 31 July) hardens the read of the group as US-anchored, vertically integrated and defence-adjacent.',
          'Quantum Act procurement provisions would likely apply as lex specialis over the general procurement regulation, making this the primary front rather than the PPA.',
        ],
      },
    ],
  },
};

const ACT_ACTION: Callout = {
  id: 'quantum-act-action',
  heading: 'EU file · Quantum Act',
  title: ACT_TITLE,
  anchor: 'capital-BEL',
  side: 'right',
  size: 'wide',
  asAt: AS_AT,
  internal: true,
  sources:
    'Commission Work Programme 2026; Quantum Europe Strategy; Franco-German sovereignty ' +
    'paper, 17 Jun 2026; Franco-German Quantum Act positions, 17 Jul 2026 (unpublished); ' +
    'Rud Pedersen.',
  body: {
    kind: 'sections',
    sections: [
      {
        heading: 'Timeline',
        note: 'Stage-by-stage engagement plan on the next slide',
        items: [
          'Q3–Q4 2026 — pre-publication. No public text, and the only window in which the drafting can still be shaped.',
          'Q4 2026 — Commission publishes the proposal.',
          'Q4 2026–2027 — Parliament committee work and Council working party negotiations run in parallel.',
          'H2 2027–H1 2028 — Council general approach and Parliament position. Eligibility language that survives to here is hard to reverse.',
          'Potentially H2 2027 / H1 2028 onwards — trilogues.',
        ],
      },
      {
        heading: 'IonQ next steps',
        items: [
          'Support European sovereignty as a legitimate goal, but contest domicile as the eligibility gate. Ask for eligibility on operational control, R&D and employment location, and where the work is done.',
          'Argue it in their own words. The Franco-German paper of 17 June admits trusted partner states on risk-based conditions and names place of operational control as an indicator.',
          'Enter the record before publication — position paper into DG CNECT and cabinet via Rud Pedersen, with technology neutrality and proportionate dual-use provisions.',
          'Hedge in parallel: member-state budgets remain the route to revenue if the eligibility test hardens.',
        ],
      },
    ],
  },
};

/* ---- The engagement timeline ----------------------------------------- */

const ACT_TIMELINE: Callout = {
  id: 'quantum-act-timeline',
  heading: 'EU Quantum Act · timeline and engagement plan',
  standfirst: 'Indicative. Every date downstream of publication moves with the publication date.',
  // No anchor. A timeline is about the calendar, not about a place, and a leader
  // line from it to Brussels would assert a relationship that is not there.
  size: 'full',
  asAt: AS_AT,
  internal: true,
  body: {
    kind: 'timeline',
    nowAtStage: 'pre-publication',
    nowLabel: 'August 2026 · you are here',
    footnote:
      'Indicative sequencing based on ordinary legislative procedure. Council presidency: ' +
      'Ireland to 31 Dec 2026, Lithuania Jan–Jun 2027, Greece Jul–Dec 2027, ' +
      'Italy Jan–Jun 2028.',
    stages: [
      {
        id: 'pre-publication',
        stage: 'Pre-publication engagement',
        timing: 'Q3–Q4 2026',
        what: 'Commission finalises the proposal ahead of publication. There is no public text to respond to.',
        engagement:
          'Continue engagement with Commission officials and cabinets; submit written input on the provisions that matter most, above all the eligibility test.',
      },
      {
        id: 'proposal',
        stage: 'Commission proposal',
        timing: 'Q4 2026',
        what: 'Commission publishes the proposal. First-day coverage sets a framing that carries through committee.',
        engagement:
          'Rapid legal and technical read; agree priority provisions and fallback positions; formal written response to the Commission.',
      },
      {
        id: 'committee',
        stage: 'Parliament committee work',
        timing: 'Q4 2026–2027',
        what: 'Lead committee takes the file; rapporteur and shadow rapporteurs appointed; amendments developed.',
        engagement:
          'Rapporteur, shadows and champion MEPs; technical briefings, suggested amendment text, and a hearing witness slot where one is available.',
      },
      {
        id: 'working-party',
        stage: 'Council working party negotiations',
        timing: 'Q4 2026–2027',
        what: 'Member States examine and negotiate the proposal. Positions form in capitals rather than in Brussels.',
        engagement:
          'National ministries and Permanent Representations in priority Member States; supporting evidence tailored to national research and industrial interests. Lithuania is a priority target at all levels of the media ecosystem as it takes the Council presidency (Jan–Jun 2027).',
      },
      {
        id: 'general-approach',
        stage: 'Council negotiating mandate / general approach',
        timing: 'H2 2027–H1 2028',
        what: 'Council agrees its position. Eligibility language that survives to this point becomes hard to reverse.',
        engagement:
          'Concentrate on the small number of Member States that can still move the text; work the Presidency and the blocking arithmetic.',
      },
      {
        id: 'parliament-position',
        stage: 'Parliament position',
        timing: 'H2 2027–H1 2028',
        what: 'Committee and plenary votes fix Parliament’s mandate for negotiation.',
        engagement:
          'Continue with relevant MEPs and political groups on priority amendments ahead of both votes.',
      },
      {
        id: 'trilogues',
        stage: 'Trilogues',
        timing: 'Potentially H2 2027 / H1 2028 onwards',
        what: 'Parliament, Council and Commission negotiate a compromise text behind closed doors.',
        engagement:
          'Quiet, targeted engagement with negotiators and their staff; technical drafting support where it is invited.',
      },
    ],
  },
};

export const POLICY_CALLOUTS: readonly Callout[] = [
  PPA_SITUATION,
  PPA_ACTION,
  ACT_SITUATION,
  ACT_ACTION,
  ACT_TIMELINE,
];
