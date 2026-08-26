/**
 * strategy.ts — IonQ's own engagement strategy, member state by member state.
 *
 * ============================================================================
 * INTERNAL, AND A THIRD KIND OF CLAIM.
 *
 * `presenter.ts` is personal. `policy.ts` reproduces external legislative
 * assessments — the EU's files, what they say, what they would do to us.
 * This file is neither: it is what IonQ intends to DO about them, in which
 * capital, through which relationship. It names a national agency we already
 * have access to and says what that access is to be used for.
 *
 * That is why it is a separate file rather than three more entries in
 * policy.ts, and the reason is the one §7g gives: splitting the sources is what
 * lets the sensitive one be found, reviewed or removed on its own. A reviewer
 * asked to check "what do we claim about the Italians" should not have to read
 * a procurement briefing to find it.
 *
 * Every panel built here carries `internal: true`, so it is stamped on screen.
 * ============================================================================
 *
 * CONFIRM BEFORE PRESENTING — and unlike policy.ts, the reason is not that the
 * text will age. It is that none of this is published. Two assertions in
 * particular are internal judgement rather than sourced fact:
 *
 *   1. That Italy is among the EU member states most supportive of American
 *      companies operating in the Union. It is a read of a government's
 *      posture, and a government's posture is exactly the thing that changes
 *      without anybody issuing a correction.
 *   2. That the AISI relationship reaches ENISA decision-making and the
 *      standard-setting downstream of it. That is a claim about what our access
 *      can be made to do, not a description of something already done.
 *
 * The panel states both as the assessments they are and the `sources` line says
 * so on screen. Do not let either harden into a fact between here and the room.
 *
 * ON "AISI". The acronym is reproduced as it was supplied and is deliberately
 * NOT expanded anywhere in this file or on the panel. Expanding it would be
 * this project asserting which Italian body is meant, and there is more than
 * one candidate — that is a §4 problem (state what is, and stop) wearing
 * different clothes. If the panel should name the agency in full, put the
 * expansion in `AISI_DETAIL` below, where exactly one line has to change.
 */
import type { Callout } from './callouts';

const AS_AT = '26 August 2026';

/**
 * The one place the agency is described. Held as a constant so that naming it
 * in full later is a single edit rather than a search — see the note above.
 */
const AISI_DETAIL = 'Government · AISI';

export const ITALY_CIRCUIT: Callout = {
  id: 'italy-circuit',
  heading: 'Engagement · Italy',
  title: 'Top-down and bottom-up',
  standfirst:
    'One circuit, two directions: Italy is a route into EU decision-making, and a ' +
    'market whose terms EU decisions set. Neither direction pays off without the other.',
  // Tethered to Rome. The diagram's two nodes are Rome and Brussels, and both
  // capitals are on the map at this scene's camera — so the leader lands on the
  // end of the circuit the slide is about.
  anchor: 'capital-ITA',
  side: 'right',
  size: 'wide',
  asAt: AS_AT,
  internal: true,
  body: {
    kind: 'circuit',
    top: {
      id: 'brussels',
      label: 'Brussels',
      detail: 'Commission · Council · ENISA · standards',
    },
    bottom: {
      id: 'rome',
      label: 'Rome',
      detail: AISI_DETAIL,
    },
    /*
     * ORDER IS COLUMN ORDER, LEFT THEN RIGHT, and the bottom-up arm is given
     * the left column deliberately: it is the one the slide is arguing for, and
     * the eye reaches the left column first. The top-down arm is the return
     * path and reads as the consequence, which is what it is.
     */
    arms: [
      {
        id: 'bottom-up',
        direction: 'up',
        label: 'Bottom-up · Rome into Brussels',
        claim:
          'Italy is a route into EU decision-making, not just a market at the end of ' +
          'one. A member state that will carry our position into Council, into ENISA ' +
          'and into the standards work moves the rules every other EMEA sale is then ' +
          'made under.',
        levers: [
          {
            id: 'favourable-member-state',
            label: 'A favourable member state',
            detail:
              'Assessed as among the EU member states most supportive of American ' +
              'companies operating in the Union — one of the few that will make that ' +
              'argument in the room rather than merely tolerate it. That posture is the ' +
              'asset, and it is what makes Rome worth the engagement before there is an ' +
              'Italian deal on the table.',
          },
          {
            id: 'aisi-enisa',
            label: 'AISI → ENISA',
            detail:
              'The existing AISI relationship is access already in hand. Leveraged, it ' +
              'reaches ENISA decision-making and the standard-setting that follows — the ' +
              'stage at which the technical criteria are written, which is earlier and ' +
              'cheaper to shape than the procurement that later applies them.',
          },
        ],
      },
      {
        id: 'top-down',
        direction: 'down',
        label: 'Top-down · Brussels into Rome',
        claim:
          'What is settled in Brussels sets the terms of the Italian sale. Eligibility ' +
          'tests, economic-security criteria and Union-level standards decide what can ' +
          'be bought in Rome and from whom — so favourable EU market conditions are a ' +
          'precondition for selling into Italy, not a separate workstream beside it.',
        levers: [
          {
            id: 'the-live-files',
            label: 'The live files',
            detail:
              'This arm is the procurement and Quantum Act briefings five scenes back, ' +
              'seen from the other end: the same two files that decide whether a group ' +
              'entity is a clean EU participant are what decide the Italian opportunity.',
          },
        ],
      },
    ],
    footnote:
      'Two directions, one circuit — not two campaigns. The access won in Rome is what ' +
      'shapes the Brussels rules; the Brussels rules are what make the Italian market ' +
      'sellable. Worked at either end alone, the other end does nothing.',
  },
  sources:
    'IonQ Government Affairs (EMEA) assessment, not a published position. The Italian ' +
    'posture towards US companies and the reach of the AISI relationship are both ' +
    'internal judgement — confirm each before presenting.',
};

/** What callouts.ts folds into the registry. */
export const STRATEGY_CALLOUTS: readonly Callout[] = [ITALY_CIRCUIT];
