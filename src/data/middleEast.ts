/**
 * middleEast.ts — the Gulf engagement strategy: the route in, the two
 * workstreams, and the 120-day sprint.
 *
 * ============================================================================
 * INTERNAL. Condensed from a memo proposing that the Government Affairs remit
 * expand from Europe to EMEA, with a 120-day sprint in the Middle East as the
 * priority. It names the specific bodies to be approached, states which
 * national programmes create a barrier IonQ has to clear, and sets a target
 * pipeline figure with a date on it. Removing it is one import and three scenes.
 * ============================================================================
 *
 * CONDENSED, NOT VERBATIM, AND THE PANELS SAY SO. `policy.ts` and
 * `ninetyDays.ts` reproduce their sources word for word because the wording is
 * the point — they are assessments with named advisers behind them. This memo is
 * an internal proposal written to be argued with, so condensing it is right; but
 * a condensed proposal is a prompt for the presenter, not an approved form of
 * words, and the `sources` line on each panel says which it is (§7j rule 2).
 *
 * WHAT WAS DELIBERATELY LEFT OFF, and it is most of the memo's sensitive half:
 *
 *   - The compensation ask, and the recognition of a change in scope and risk.
 *   - The sovereign-capital question — whether IonQ wants Gulf equity, which the
 *     memo itself flags as an ELT call.
 *   - The Israel handling, which the memo flags for possible US ownership.
 *   - The four open questions, which are unresolved by the memo's own account.
 *
 * None of them is a claim about the map, all of them are live internal
 * decisions, and a slide is the wrong place to settle any of them. They are
 * absent rather than summarised, because a one-line summary of an open question
 * reads as a position.
 *
 * NAMES. The memo names five people. Only HM Trade Commissioner Sarah Mooney is
 * kept, because that is a public post being named as a route rather than a
 * colleague being characterised. The rest are dropped: an internal name on a
 * screen is a different exposure from an internal name in a file, and none of
 * them was load-bearing for the argument.
 *
 * THE MEMO'S OWN CAVEAT IS CARRIED, NOT DROPPED. It says at the top that it was
 * written without speaking to anyone else and against publicly available
 * information, so it may not match the business's actual engagement. That
 * caveat is on every one of these three panels' `sources` line, because it is
 * the single most important thing a room could be told about this content.
 *
 * NOT REPRODUCED: THE TIER TABLE. Its Tier 1 row is headed "Gulf + UK" and then
 * lists "UK, Belgium (EU Institutions)". Those do not agree, and this project
 * does not pick a reading of a source that contradicts itself (§7j rule 3 — and
 * unlike the risk register, there is no enumerating side here to prefer). If a
 * tiering scene is wanted, the source needs fixing first.
 */
import type { Callout } from './callouts';

const AS_AT = '26 August 2026';

/**
 * The memo's own health warning, on every panel built from it. Held once so it
 * cannot drift between the three.
 */
const CAVEAT =
  'IonQ Government Affairs (EMEA) memo, condensed — not an approved form of words. The memo ' +
  'states that it was written without internal consultation and against publicly available ' +
  'information, so the current pipeline position may differ.';

/* ---- 01 · how IonQ shows up ------------------------------------------ */

export const ME_ROUTE_IN: Callout = {
  id: 'me-route-in',
  heading: 'Middle East · engagement',
  title: 'The UK is the route in',
  standfirst:
    'Rooted in the connectivity between the UK and the GCC — and in the UK–GCC Free Trade ' +
    'Agreement, the first the Gulf has signed with a G7 state. The structures already exist; ' +
    'the job is to use them.',
  side: 'right',
  size: 'wide',
  asAt: AS_AT,
  internal: true,
  body: {
    kind: 'sections',
    sections: [
      {
        heading: 'Defend the beachhead',
        items: [
          'IonQ renewed and expanded its agreement with Abu Dhabi’s Technology Innovation Institute and its Quantum Research Center on 27 January 2025, adding Forte access.',
          'TII is deliberately multi-vendor: it also signed Quantinuum, and uses D-Wave, QuEra, Rigetti and IQM via AWS Braket. The beachhead is real, and it is contested.',
        ],
      },
      {
        heading: 'The field is already political',
        items: [
          'Saudi Arabia — RDIA has named quantum a national moonshot, targeting a scalable, fault-tolerant machine by 2045, with Vision 2030 projects including KACST behind it.',
          'UAE — one of the world’s first coordinated National Post-Quantum Migration Programmes. TII/ATRC anchors federal quantum R&D and is our current in-region deployment.',
          'Qatar — Invest Qatar’s incentive programme covers up to 40% of eligible local costs over five years and lists quantum computing explicitly as an eligible activity. QC2 at Hamad Bin Khalifa University is the research anchor.',
        ],
      },
      {
        heading: 'Which is why there is a barrier to entry',
        note: 'Government-led progress is a political gate, not only an opportunity',
        items: [
          'State funding flows through government, so clearing the political barrier is a precondition for benefiting from it rather than a parallel workstream.',
          'Saudi Arabia’s RHQ rule requires a Riyadh presence: without one, a multinational can win a government contract only by bidding 25% below the next best competitor.',
        ],
      },
    ],
  },
  sources: CAVEAT,
};

/* ---- 02 · the two workstreams ---------------------------------------- */

export const ME_WORKSTREAMS: Callout = {
  id: 'me-workstreams',
  heading: 'Middle East · engagement',
  title: 'Quick wins, then the moat',
  standfirst:
    'Two workstreams on different clocks, run at the same time. The first buys the standing ' +
    'the second needs; the second is what makes the first repeatable.',
  side: 'right',
  size: 'wide',
  asAt: AS_AT,
  internal: true,
  body: {
    kind: 'sections',
    sections: [
      {
        heading: 'Workstream 1 · Quick wins',
        // `note` takes the accent, which is where the objective belongs: it is
        // the line the room should leave with, not the first of three bullets.
        note: 'Near-term political and commercial capital',
        items: [
          'Work with GTM to identify, qualify and politically accelerate a deal they are already working on.',
          'Target: at least nine qualified opportunities across three countries by Day 60, each with a political engagement strategy of its own to move the deal faster.',
        ],
      },
      {
        heading: 'Workstream 2 · Moat-building',
        note: 'A two-to-three year regulatory and reputational moat',
        items: [
          'Embed IonQ’s technology and benchmarks into national quantum-strategy design and procurement criteria.',
          'Engage advisers on policy and standards, build the academic relationships, and establish leadership relationships at MISA, ADIO, Invest Qatar, KACST, SDAIA, TII/ATRC and QSTP.',
          'Success is being sought out for our counsel on the quality of our submissions — not merely being heard.',
        ],
      },
    ],
  },
  sources: CAVEAT,
};

/* ---- 03 · the 120-day sprint ----------------------------------------- */

export const ME_SPRINT: Callout = {
  id: 'me-sprint',
  heading: 'Middle East · engagement',
  title: 'The 120-day sprint',
  standfirst:
    'Three phases, three decision gates. The gates are the point: each one either opens or it ' +
    'does not, so the sprint can be stopped on evidence rather than run to its end on momentum.',
  size: 'full',
  // Lower than the `full` default of 0.33. The band is tall — three phases with
  // a gate each — and the Gulf has to stay legible above it, so the panel gives
  // the map the upper half rather than the upper third. `top` exists for
  // exactly this (§7j).
  top: 0.47,
  asAt: AS_AT,
  internal: true,
  body: {
    kind: 'timeline',
    /*
     * THE SECOND PARAGRAPH IS A GATE, NOT AN ENGAGEMENT — which is why the
     * timeline body gained `engagementLabel`. The legislative timeline's second
     * paragraph is what IonQ does during a stage that is happening anyway; this
     * one is a decision that decides whether the next stage happens at all.
     * Labelling it "IonQ engagement" would read the track as continuous when
     * its whole design is that it stops three times.
     */
    engagementLabel: 'Decision gate',
    stages: [
      {
        id: 'foundation',
        timing: 'Days 1–30',
        stage: 'Foundation, intelligence and mapping',
        what:
          'Audit the pipeline for where it can be politically optimised and where it is ' +
          'politically exposed, and audit engagement outside the commercial pipeline as ' +
          'Europe has already done. Build the stakeholder map. Register with DBT’s Export ' +
          'Support Service and request political and commercial introductions via HM Trade ' +
          'Commissioner Sarah Mooney and the embassy commercial teams. Map the 2026–2027 ' +
          'convening moments and decide which to attend.',
        engagement: 'Day 30 — strategy approved by internal stakeholders.',
      },
      {
        id: 'positioning',
        timing: 'Days 31–60',
        stage: 'Engagement and positioning',
        what:
          'TII/ATRC, on where we can advocate together for the UAE’s quantum ambitions and ' +
          'on the refresh of "We Are The UAE 2031". MISA/Invest Saudi, including a dialogue ' +
          'on the RHQ requirement. KACST/RDIA on Quantum Valley participation. Invest Qatar ' +
          'on the technology incentive package. Academic outreach begins — KAUST, HBKU and ' +
          'the UAE universities.',
        engagement:
          'Day 60 — which two or three opportunities are most credible for GTM in the short ' +
          'term. Concentrate resources there.',
      },
      {
        id: 'enablement',
        timing: 'Days 61–120',
        stage: 'Deal-enablement and UK trade integration',
        what:
          'Use DBT and the embassy commercial teams to secure high-level access and formalise ' +
          'pathways for the priority opportunities. Use the UK–GCC Free Trade Agreement ' +
          'tailwind to reach the ministries and entities that decide, and keep IonQ’s ' +
          'technology embedded in national quantum-strategy design and procurement criteria.',
        engagement:
          'Day 120 — an in-region hire, retained consultancy support, an RHQ in Saudi Arabia, ' +
          'or continue on the single-person model.',
      },
    ],
    /*
     * The marker sits on stage one because that is where the talk is: the
     * sprint is being PROPOSED, not reported. Placed by stage id, so it cannot
     * drift if the phases change — see §7h.
     */
    nowAtStage: 'foundation',
    nowLabel: 'Day 0 · proposed',
    footnote:
      'A proposal, not a plan in flight. The sprint has not been approved and Day 0 has not ' +
      'happened; the gates below are what would be asked for, not what has been agreed.',
  },
  sources: CAVEAT,
};

export const MIDDLE_EAST_CALLOUTS: readonly Callout[] = [
  ME_ROUTE_IN,
  ME_WORKSTREAMS,
  ME_SPRINT,
];
