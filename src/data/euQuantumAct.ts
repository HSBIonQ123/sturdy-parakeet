/**
 * euQuantumAct.ts — the EU Quantum Act core asks, as a summary grid.
 *
 * ============================================================================
 * INTERNAL. Condensed from "EU Quantum Act Core Asks Document — Pre-Bill Text
 * Iteration", marked Confidential, co-created with twelve named colleagues
 * across the business. It is the single source of truth for asks that will be
 * made of policymakers, and it is pending approval as part of the legislative
 * engagement strategy.
 * ============================================================================
 *
 * THIS PANEL IS NOT VERBATIM, AND THAT IS THE ONE THING TO KNOW ABOUT IT.
 *
 * `policy.ts` and `ninetyDays.ts` reproduce their sources word for word,
 * because those documents are assessments whose exact wording is the point.
 * This one is a summary GRID: the source runs to seven pages of rationale and
 * the slide has to be readable from the back of a room, so the asks are
 * condensed here at the presenter's explicit instruction. The `sources` line
 * says so on screen.
 *
 * The consequence: if a sentence on this panel is going to be quoted at a
 * policymaker, check it against the source document first. A condensed ask is a
 * prompt for the presenter, not an approved form of words.
 *
 * WHY THE STATE-CHANGE LAYOUT. An ask is only meaningful against the thing it
 * is asking to change, and every ask in the source is argued exactly that way —
 * here is how the bill could land, here is where we need it to land instead. So
 * the left column is the risk in the drafting and the right column is the ask,
 * which is the same before/after register the ninety-day slides use. It is the
 * deck's existing grammar carrying a different argument, which is what a
 * reusable body kind is for.
 *
 * Ask 2.5 in the source — four further, more technical metrics — is deliberately
 * NOT a row. The source itself judges them less likely to reach statute and
 * flags them for individual procurement competitions instead. Putting them on a
 * slide of legislative asks would overstate where they belong.
 */
import type { Callout } from './callouts';

export const EUQA_ASKS: Callout = {
  id: 'euqa-asks',
  heading: 'EU Quantum Act · core asks',
  title: 'The evergreen asks, before there is bill text',
  /*
   * THE SOVEREIGNTY DEFINITION IS THE STANDFIRST, not a row. Every one of the
   * five asks is an application of it, so it belongs above them as the frame
   * rather than beside them as a peer. Condensed from the source's own working
   * definition; the full text is in the core asks document.
   */
  standfirst:
    'Working definition, and everything below applies it: sovereignty in quantum is the ' +
    'assured ability to access, operate, secure and sustain quantum capabilities under ' +
    'the customer’s own authority and laws, without unacceptable external dependency — ' +
    'across the full stack, and compatible with trusted international partnership.',
  size: 'full',
  top: 0.125,
  asAt: '26 August 2026',
  internal: true,
  body: {
    kind: 'state-change',
    fromLabel: 'Risk in the drafting',
    toLabel: 'What we ask for',
    driveLabel: 'IonQ position',
    rows: [
      {
        id: 'modality-neutral',
        topic: 'Modality-neutral language',
        from:
          '‘Superconducting-by-default’ assumptions embedded in ostensibly neutral ' +
          'standards: qubit-count thresholds calibrated to superconducting roadmaps, ' +
          'infrastructure assumptions tied to heavy refrigeration, metrics that privilege ' +
          'scale over useful output. The risk is not exclusion of trapped ions — it is ' +
          'peer lobbying that never names us.',
        to:
          'Explicitly modality-neutral language across procurement frameworks, pilot ' +
          'lines, benchmarking, acceptance criteria, testbeds and infrastructure ' +
          'definitions. Europe benefits from architectural diversity; legislation should ' +
          'not select winners early. We play honest broker while others push for ' +
          'modality preference.',
      },
      {
        id: 'procurement-metrics',
        topic: 'Metrics beyond raw qubit count',
        from:
          'Evaluation frameworks in statute that measure physical-qubit scale, and a ' +
          'bill that addresses compute alone.',
        to:
          'Holistic evaluation: total cost of ownership, energy and financial cost per ' +
          'useful computation, interoperability, operational efficiency, commercial track ' +
          'record, alignment with existing protocols. Energy cost per useful computation ' +
          'carries the political value — Draghi, industrial-energy limits and grid ' +
          'congestion all point the same way, and our systems are cheap to run.',
      },
      {
        id: 'interoperability',
        topic: 'Cross-modal interconnects',
        from:
          'Infrastructure programmes that settle on a single modality and lock Europe in ' +
          'before the field has resolved.',
        to:
          'Programmes that preserve the option of heterogeneous quantum ecosystems. ' +
          'Framed as avoiding premature constraint rather than as opposition to any ' +
          'architecture: interoperability is itself a strategic capability, and it is one ' +
          'we lead on.',
      },
      {
        id: 'trusted-supplier',
        topic: 'Trusted supplier and European presence',
        from:
          'A ‘trusted supplier’ regime that hardens into de-facto exclusion of non-EU ' +
          'headquartered firms regardless of their operational ties to Europe.',
        to:
          'Eligibility that recognises substantive European operational presence rather ' +
          'than headquarters location. Acknowledge the legitimacy of the sovereignty ' +
          'concern, then argue that system-level sovereignty matters more than corporate ' +
          'domicile where operational control rests with the end user.',
      },
      {
        id: 'skills',
        topic: 'Funding, skills and training',
        from:
          'Workforce provisions drafted without industry, or written as a domestic-only ' +
          'capability test.',
        to:
          'Support language for a sovereign workforce capability: commitments to national ' +
          'training, and incentives for private collaboration with public initiatives. We ' +
          'point at our own record of upskilling customers’ teams as part of partnerships.',
      },
    ],
  },
  sources:
    'Condensed — not verbatim — from "EU Quantum Act Core Asks Document, Pre-Bill Text ' +
    'Iteration" (IonQ, Confidential), co-created with twelve colleagues and pending ' +
    'approval. Check any form of words against the source before quoting it.',
};

export const EUQA_CALLOUTS: readonly Callout[] = [EUQA_ASKS];
