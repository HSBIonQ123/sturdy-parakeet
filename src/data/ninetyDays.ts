/**
 * ninetyDays.ts — the first ninety days in role: what changed, and what it
 * de-risked.
 *
 * ============================================================================
 * INTERNAL, AND THE MOST SENSITIVE FILE IN THE PROJECT.
 *
 * Both panels reproduce slides marked "Confidential — internal use only"
 * (pages 03/16 and 04/16 of the source deck) VERBATIM, at the presenter's
 * instruction, for an internal company meeting.
 *
 * They name third parties: a lapsed agency contract, three named agencies, and
 * five individuals — an industry figure, IonQ's own counsel, two IonQ leaders
 * and the CEO by initials. They also set out, exposure by exposure, where the
 * business was judged to be at risk ninety days ago, including a live legal
 * decision-gate. This is exactly the file §7g's split exists to keep findable:
 * it is one import and two scenes to remove, and nothing else in the project
 * depends on it.
 *
 * Every panel here carries `internal: true`, which stamps it on screen with the
 * as-at date, so nobody can be on one of these scenes, in a room, and not know
 * what is behind them.
 * ============================================================================
 *
 * THE REGISTER IS THE SOURCE OF TRUTH, AND THE SUMMARY IS COUNTED FROM IT.
 *
 * The source deck disagreed with itself: the "Risks mitigated" row on page 03/16
 * said "Of 8 exposures identified, 4 reduced to low risk, 2 held at medium risk
 * under active mitigation, 1 prepared for with a defined gate for further
 * action, and 1 resolved", while the register on page 04/16 enumerated SEVEN.
 * Neither the count nor the distribution matched.
 *
 * The register wins, because it is the one that enumerates: every exposure on it
 * has a severity each side and a set of drivers behind it, so it can be checked
 * line by line in a way a summary sentence cannot. So `RISK_SUMMARY` below is
 * BUILT FROM `RISK_ROWS` — the count, and how many landed at each level, are
 * computed rather than typed. Add an exposure to the register and the summary
 * sentence on the previous scene updates with it; there is no second number to
 * keep in step, which is what let the two drift apart in the first place.
 * `verify.mjs` asserts the sentence and the register agree.
 *
 * "See next page" is left in. In the deck the next page IS the next scene, so
 * the sentence stays true — and it is the source's own wording.
 *
 * NAMES AND ACRONYMS ARE NOT EXPANDED. "NdM", "IC", "SoS BIST", "DG Technology",
 * "ProQure" appear as supplied. Expanding any of them would be this project
 * asserting a reading of an internal shorthand, which is the §4 rule (state what
 * is, and stop) applied to a briefing instead of a border.
 *
 * ON THE ARROWS. `verb` is the source's word — Reduced, Mitigated, Prepared —
 * and is data. The arrow's DIRECTION is not: it is derived at render from the two
 * severity levels. The source marked one row ("No visibility on changes in EMEA
 * priorities") with a sideways glyph while moving it MEDIUM to LOW; the levels
 * are right and the glyph was not, so the render follows the levels and the row
 * now draws a falling arrow with the source's own word beside it. A diagram that
 * argues against the numbers next to it is worse than one that simply follows
 * them, and deriving the direction means that can never happen again.
 */
import type { Callout, RiskLevel, RiskRow } from './callouts';

/**
 * The date these slides were SUPPLIED, not a date printed on them — the source
 * carries none. It is stamped on both panels so a stale build is visibly stale,
 * the same reasoning as policy.ts.
 */
const AS_AT = '26 August 2026';

/* ---- the register, and the numbers counted from it -------------------- */
/*
 * Declared first because BOTH scenes depend on it: scene 02 renders it, and the
 * summary row on scene 01 is counted from it. That dependency is the whole fix
 * for the two pages disagreeing — there is now one register and no second
 * number anywhere to fall out of step with it.
 */

/**
 * The register itself, as its own const so the summary sentence on the previous
 * scene can be COUNTED from it rather than written beside it. See the header.
 */
const RISK_ROWS: readonly RiskRow[] = [
  {
    id: 'uk-ic',
    from: {
      level: 'high',
      title: 'Lack of visibility with UK IC',
      detail: 'No official channels or structured credibility with UK Intel Community.',
    },
    verb: 'Reduced',
    to: {
      level: 'low',
      title: 'Active briefing channel',
      detail:
        'Direct access point established with route for policy alignment, and 13 ' +
        'further introductions across IC planned with Sir Peter Knight.',
    },
    drivers: [
      'Completed breakthrough meeting with DG Technology at GCHQ.',
      'Alignment with key industry figure, Sir Peter Knight, on need for IonQ to have ' +
        'greater say in policy discussions with IC; further introductions brokered.',
    ],
  },
  {
    id: 'uk-champion',
    from: {
      level: 'high',
      title: 'Not viewed as ‘UK champion’',
      detail: 'Perceived as a foreign entity; excluded from national priority lists.',
    },
    verb: 'Reduced',
    to: {
      level: 'low',
      title: 'Ministerial validation',
      detail: 'Formally positioned at the highest level of ministerial priority.',
    },
    drivers: [
      'Secured official ministerial advice nominating IonQ as first ‘quantum ' +
        'ministerial visit’ for SoS BIST.',
      'Secured call with Deputy Chief of Staff to Chancellor to directly advance ' +
        'NdM’s priorities.',
      'Approach to political relationships by senior leaders changed, to ensure asks ' +
        'are grounded in political reality and ladder to a broader political strategy.',
    ],
  },
  {
    id: 'us-company',
    from: {
      level: 'high',
      title: 'Geopolitical exposure as US company',
      detail:
        'Perception of IonQ as an ‘American company’ by some definitions drives risk ' +
        'to ability to access public sector procurement in the EU.',
    },
    verb: 'Reduced',
    to: {
      level: 'medium',
      title: 'Active EU lobbying strategy',
      detail:
        'IonQ is now active across key European capitals, ensuring that definitions ' +
        'adopted into law reduce risk of US-vendor lock-out.',
    },
    drivers: [
      'Formulated and adopted clear ‘quantum sovereignty’ policy framework.',
      'Prepared policy framework for EU Quantum Act, initiating deep engagement with ' +
        'DGs in Brussels and those that influence them.',
      'Ensured we are engaging on national level budgets and ministries as European ' +
        'procurement vehicles to de-risk future lock-out by EU by having member-state ' +
        'track record.',
    ],
  },
  {
    id: 'proqure',
    from: {
      level: 'high',
      title: 'ProQure commercial decision',
      detail: 'Risk of reputational harm due to failure to anchor work in UK pathways.',
    },
    // The one row that does not fall. Held at high and prepared for, which
    // is what the sideways arrow says — see the header note on directions.
    verb: 'Mitigated',
    to: {
      level: 'high',
      title: 'Legal engagement prepared',
      detail:
        'Paul Dacier briefed on the potential impact of a negative decision; gate ' +
        'identified for pursuing further action.',
    },
    drivers: [
      'Alignment sought and achieved with Chris Ballance and Tom Harty on what the ' +
        'decision-gate for moving forward with legal action would be, namely if there ' +
        'is no other way, based on feedback that the decision could have gone against ' +
        'IonQ unless US-ownership was considered a factor.',
      'Legal counsel briefed and suggestion made of law firm to use in the event we ' +
        'proceed.',
    ],
  },
  {
    id: 'comms',
    from: {
      level: 'high',
      title: 'Communications mis-step in translating US ambition to European context',
      detail: 'Communications previously designed for US market misses in EMEA.',
    },
    verb: 'Reduced',
    to: {
      level: 'low',
      title: 'EMEA translation layer live, and force multiplication in place',
      detail: 'Internal fix and external capacity brought to bear on the risk.',
    },
    drivers: [
      'European lens now offered on executive communications (op-eds etc. as produced ' +
        'for senior leadership approval).',
      'Focussed executive communications programme initiated through Edelman to build ' +
        'a repeatable engine for delivery of tailored EMEA messaging in key outlets.',
    ],
  },
  {
    id: 'horizon',
    from: {
      level: 'medium',
      title: 'No visibility on changes in EMEA priorities',
      detail:
        'Engagement was reactive; with no view on 3-5 year horizon. Business not ' +
        'prepared for change in EC Presidency or shifting sovereignty focus.',
    },
    verb: 'Mitigated',
    to: {
      level: 'low',
      title: 'Engagement on longer term horizon',
      detail:
        'First engagement conducted with opposition figures and new EC president ' +
        'engagement planned to insulate IonQ from political change.',
    },
    drivers: [
      'IonQ senior leaders have now met with Reform and Conservative leadership in ' +
        'the UK.',
      'Comprehensive engagement with Lithuanian government ahead of EC presidency ' +
        'planned.',
      'Longer-term stakeholder management now systematised and carried out across ' +
        'priority markets.',
    ],
  },
  {
    id: 'key-person',
    from: {
      level: 'medium',
      title: 'Single point of failure',
      detail: 'Entire international function will quickly run through one person.',
    },
    verb: 'Prepared',
    to: {
      level: 'low',
      title: 'Continuity tools created',
      detail:
        'Relationships tracked in a register; with policy positions now codified, not ' +
        'personal knowledge.',
    },
    drivers: [
      'Relationship register and engagement log built and current.',
      'Building out function in short-term reduces key person risk in international ' +
        'government affairs.',
    ],
  },
];

/** How many exposures the register holds. */
export const RISK_EXPOSURE_COUNT = RISK_ROWS.length;

/** How many landed at a given severity. */
const landingAt = (level: RiskLevel) => RISK_ROWS.filter((r) => r.to.level === level).length;

/**
 * The summary sentence for the "Risks mitigated" row on the previous scene.
 *
 * Every number in it is computed. The clauses are built conditionally and
 * phrased by LANDING STATE rather than by movement ("now sit at low risk", not
 * "reduced to low risk"), so the sentence stays true whatever a future register
 * contains — including a level that nothing lands on, which simply drops its
 * clause instead of printing a zero.
 */
const RISK_SUMMARY = (() => {
  const clauses = [
    [landingAt('low'), 'now sit at low risk'],
    [landingAt('medium'), 'at medium risk under active mitigation'],
    [landingAt('high'), 'held at high risk with a defined gate for further action'],
  ]
    .filter(([n]) => (n as number) > 0)
    .map(([n, text]) => `${n} ${text}`);
  const list =
    clauses.length > 1
      ? `${clauses.slice(0, -1).join(', ')}, and ${clauses[clauses.length - 1]}`
      : clauses.join('');
  return (
    'Risks have been broadly mitigated or materially reduced in 90 days. Of ' +
    `${RISK_EXPOSURE_COUNT} exposures identified, ${list}. See next page.`
  );
})();

/* ---- 01 · the four state changes ------------------------------------ */

export const STATE_CHANGES: Callout = {
  id: 'state-changes',
  heading: '01 · What is already being delivered?',
  title: 'Government Affairs is the state-change agent',
  /*
   * THE TWO READINGS, ON SCREEN. The pun is the whole reason the slide is
   * called what it is, and it does not survive being left to the voiceover: a
   * room that hears "state change" without them hears a project-status word.
   * They are the frame for reading the four rows, so they sit above the rows
   * rather than becoming two more of them.
   */
  standfirst:
    'Two readings, and the slide means both. Literally — changing the minds of ' +
    'governments. And how you measure us: moving the political status quo, which is ' +
    'what moves GTM. My first ninety days in role produced four state changes.',
  size: 'full',
  // A full-width TABLE starts high; `full`'s default top is set for the
  // timeline, which is a band across the lower frame. See Callouts.tsx.
  top: 0.13,
  asAt: AS_AT,
  internal: true,
  body: {
    kind: 'state-change',
    fromLabel: 'Day 0',
    toLabel: 'Day 90',
    // The one drive that flips every row — printed once, over the gutter they
    // all cross, so the layout makes the claim instead of a sentence doing it.
    driveLabel: 'Government Affairs',
    rows: [
      {
        id: 'representation',
        topic: 'Representation consolidated',
        from:
          'Engagement reactive, unowned, and where it exists not weighted toward ' +
          'priorities; no internal coverage or consultancy in place after lapse of ' +
          'Burson contract.',
        to:
          'A clear strategy in place to cover priority markets; with strategies for each ' +
          'market designed to drive market access and political influence. Six European ' +
          'capitals brought online as active theatres of engagement, with ‘air cover’ ' +
          'across the EMEA region from a political communications perspective provided ' +
          'by Edelman. Force multiplication achieved through a three-agency model.',
      },
      {
        id: 'policy-positions',
        topic: 'Public policy positions established',
        from:
          'No approved global public policy positions; country teams answering ' +
          'inconsistently, and senior leaders left exposed.',
        to:
          'Position on ‘quantum sovereignty’ debate adopted; asks on EU Quantum Act ' +
          'adopted; policy consultation engagement now taking place across Europe; single ' +
          'point of truth for briefings for senior leaders, and message house across key ' +
          'areas constantly updated to keep in line with developments.',
      },
      {
        id: 'access',
        topic: 'Access created',
        from:
          'Where government relationships existed they were informal, invisible to the ' +
          'company, and valued as commercial drivers exclusively.',
        to:
          'Relationships systematised and tracked across Europe, with a clear strategy ' +
          'for further expansion and deepening across the full range of government ' +
          'affairs competencies and responsibilities.',
      },
      {
        id: 'risks',
        topic: 'Risks mitigated',
        from:
          'Substantial risks to the business were identified at my onboarding from lack ' +
          'of current government affairs support in rest-of-world.',
        // COUNTED FROM THE REGISTER, not typed. The source's own summary said
        // eight exposures where its register enumerated seven; deriving the
        // sentence is what makes a second number impossible. See the header.
        to: RISK_SUMMARY,
      },
    ],
  },
  sources:
    'IonQ internal, page 03/16, "Confidential — internal use only". Reproduced verbatim, ' +
    'except the exposure counts in the final row, which are counted from the register on ' +
    'the next scene rather than restated.',
};

/* ---- 02 · the portfolio risk register -------------------------------- */

export const RISK_REGISTER: Callout = {
  id: 'risk-register',
  heading: '02 · Portfolio risk register (90-day review)',
  title: 'A systemic de-risking of our European market engagement',
  standfirst:
    `${RISK_EXPOSURE_COUNT} exposures identified at onboarding, and where each one stands ` +
    'after ninety days. Severity is the bar; the word is the source’s own.',
  size: 'full',
  // Clear of the readout in the top-right corner: at 0.1 the internal stamp
  // ran under it, and a stamp you cannot read is a stamp that is not there.
  top: 0.125,
  asAt: AS_AT,
  internal: true,
  body: {
    kind: 'risk-register',
    fromLabel: 'Identified exposure · Day 0',
    shiftLabel: 'Risk shift',
    toLabel: 'Current mitigated position · Day 90',
    driversLabel: 'Key de-risking mitigation drivers',
    rows: RISK_ROWS,
  },
  sources:
    'IonQ internal, page 04/16, "Confidential — internal use only". Reproduced verbatim. ' +
    'Names third parties and a live legal decision-gate.',
};

/** What callouts.ts folds into the registry. */
export const NINETY_DAY_CALLOUTS: readonly Callout[] = [STATE_CHANGES, RISK_REGISTER];
