/**
 * poland.ts — the Poland strategy, in four pillars.
 *
 * ============================================================================
 * INTERNAL. Four pillars as supplied by Government Affairs (EMEA). It names a
 * consultancy and the individual leading its defence practice, names two IonQ
 * executives as speaking assets, and sets out an intention to keep public
 * executive branding and private lobbying channels separate. Removing it is one
 * import and one scene.
 * ============================================================================
 *
 * WHY THE PILLARS ARE A ROW AND NOT FOUR SCENES. Each one on its own is a
 * reasonable slide, and four of them in sequence would be four minutes of the
 * room forgetting pillar one. Side by side they are a single picture of an
 * approach, and the eye can see that pillars 1 and 2 are the commercial case
 * while 3 and 4 are the routes in. That is a thing the presenter would otherwise
 * have to say out loud, four slides after it stopped being visible.
 *
 * THE THREE FIELDS ARE KEPT APART for the reason typed into callouts.ts: a
 * strategy, a message and an execution step are three different kinds of
 * sentence, and a room needs to know which one it is being handed. Flattened
 * into bullets they read as undifferentiated intent.
 *
 * THE FACTUAL CLAIMS ARE CONFIRMED, AND CARRY NO CAVEAT ON SCREEN. The component
 * sourcing through Warsaw University of Technology and Creotech, the €1bn scale
 * of the national policy and its funding state, that the policy text considers
 * buying quantum computers outright rather than funding further research
 * testbeds, and that PIAST-Q is trapped-ion are all confirmed by Government
 * Affairs (EMEA). They are stated plainly and the panel carries no footnote,
 * because a hedge on a slide reads as doubt about the claim it hedges — and
 * pillar 1 is the strongest position IonQ holds in this market, not one to
 * apologise for.
 *
 * If any of them ever changes, the pillar resting on it changes with it: the
 * whole of pillar 1 is the supply-chain position, and pillar 2 turns on the
 * policy preferring outright purchase. That is a reason to update this file, not
 * a reason to qualify it in front of a room.
 */
import type { Callout } from './callouts';

export const POLAND_STRATEGY: Callout = {
  id: 'poland-strategy',
  heading: 'Poland · engagement strategy',
  title: 'Four pillars',
  standfirst:
    'Poland is the one market where the protectionist test is one we can pass rather than ' +
    'argue around — so the strategy starts from the supply chain and works outward.',
  size: 'full',
  top: 0.125,
  asAt: '26 August 2026',
  internal: true,
  body: {
    kind: 'pillars',
    pillars: [
      {
        id: 'supply-chain',
        name: 'Architectural leverage and the native supply chain',
        strategy:
          'Position IonQ not as an outside American vendor seeking to export capital, but ' +
          'as the only global vendor that natively meets the criteria of Poland’s ' +
          'forthcoming national quantum policy.',
        message:
          'Through Oxford Ionics, Warsaw University of Technology and Creotech, IonQ ' +
          'already uses Polish and EU-based manufacturing components for electronic ' +
          'control systems.',
        execution:
          'Contrast that embedded infrastructure against US vendors who have to argue ' +
          'around Poland’s protectionist preferences, establishing IonQ as a local ' +
          'ecosystem partner rather than an exception to be made.',
      },
      {
        id: 'procurement',
        name: 'High-value sovereign procurement capture',
        strategy:
          'Target the procurement categories being drafted by newly appointed task groups, ' +
          'before the €1bn national policy is formally funded.',
        message:
          'Poland’s policy text explicitly considers purchasing quantum computers outright ' +
          'rather than funding further primary research testbeds. That is a buyer, not a ' +
          'grant-maker.',
        execution:
          'Align it with the broader European narrative — sovereign approaches shifting ' +
          'toward ROI for taxpayers and commercial readiness — and use the trapped-ion ' +
          'architecture of Poland’s PIAST-Q project as the technical baseline for ' +
          'establishing modality preference.',
      },
      {
        id: 'defence',
        name: 'Dual-use and defence sector integration',
        strategy:
          'Intersect directly with Poland’s military re-armament programme and incoming ' +
          'EU SAFE defence funding allocations.',
        message:
          'Quantum readiness as a near-term cyber-resilience requirement. The threat-clock ' +
          'argument — harvest now, decrypt later — says cryptographically relevant ' +
          'timelines have shortened, so defence procurement cannot run to standard ones.',
        execution:
          'Partner with Rud Pedersen’s Defence & Security practice, led by Line Tresselt, ' +
          'to navigate the institutional boundaries between the Ministry of National ' +
          'Defence and the National Security Bureau.',
      },
      {
        id: 'summit',
        name: 'Controlled executive positioning',
        strategy:
          'Use the Warsaw Summit in late October or early November as a targeted mechanism ' +
          'for building elite, cross-party relationships quickly, without high public ' +
          'exposure.',
        message:
          'A high-prestige industrial keynote on allied quantum supply chains and regional ' +
          'tech sovereignty, delivered by the CEO or the Chief Business Officer.',
        execution:
          'Maintain strict separation between public executive branding and private ' +
          'lobbying channels. The summit buys the relationships; it is not where the asks ' +
          'are made.',
      },
    ],
  },
  sources:
    'IonQ Government Affairs (EMEA). Names a consultancy and its defence practice lead, and ' +
    'two IonQ executives as speaking assets.',
};

export const POLAND_CALLOUTS: readonly Callout[] = [POLAND_STRATEGY];
