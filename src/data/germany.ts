/**
 * germany.ts — the Franco-German position paper, and what we need to move.
 *
 * ============================================================================
 * INTERNAL. Built from two sources: a note to the group dated 28 July 2026, and
 * the clause-by-clause assessment behind it, "Franco-German Joint Position Paper
 * on the EU Quantum Act" (Confidential, nine pages, addressed to the Global Head
 * of Government Affairs).
 *
 * The assessment states where IonQ would struggle to comply with the paper as
 * drafted, names the French national champions it holds responsible for the
 * protectionist line, and sets out the trade associations to join for air cover.
 * It also names the acquisition that would be affected. Removing it is one
 * import and two scenes.
 * ============================================================================
 *
 * THE SPLIT BETWEEN THE TWO PANELS IS THE ARGUMENT.
 *
 * The first panel is what the paper SAYS and what we make of it: the top lines,
 * the assessment that this is a maximalist opening bid rather than settled
 * policy, and the engagement already in delivery. It is a briefing.
 *
 * The second is what we have to MOVE, clause by clause, and it uses the same
 * state-change register as the ninety-day slides — because that is exactly what
 * these are. The left column is the paper as agreed; the right is the position
 * the bill has to reach for IonQ to be able to sell into the EU. Reading them as
 * state changes rather than as objections is the difference between a lobbying
 * plan and a complaint.
 *
 * WHAT IS NOT ON THESE PANELS. The assessment grades every clause, and two of
 * them — research and talent, and technological breadth — are graded "strongly
 * support" with nothing to shift. They are the footnote on the second panel
 * rather than empty rows: a state-change grid with a row that does not change
 * teaches the eye to stop trusting the arrows.
 *
 * VERBATIM WHERE IT IS QUOTED. The paper's own language appears in quotation
 * marks and is reproduced exactly; the assessment around it is condensed. The
 * distinction matters — the quoted clauses are what member states have actually
 * signed up to, and a paraphrase of those would be the one thing this deck must
 * not put in front of a room.
 */
import type { Callout } from './callouts';

const AS_AT = '28 July 2026';

/* ---- the paper, and what we make of it ------------------------------- */

export const FRANCO_GERMAN: Callout = {
  id: 'germany-franco',
  heading: 'Germany · Franco-German position paper',
  title: 'A maximalist opening bid, not settled policy',
  standfirst:
    'Signed at Augustusburg Palace on 17 July 2026 and released on 28 July. Our assessment ' +
    'is that Germany will moderate, as it routinely does after aligning with France early ' +
    'in protectionist negotiations.',
  anchor: 'capital-DEU',
  side: 'right',
  size: 'wide',
  asAt: AS_AT,
  internal: true,
  body: {
    kind: 'sections',
    sections: [
      {
        heading: 'The top lines',
        items: [
          'EU-level procurement of quantum computers to be “entirely designed and manufactured in Europe by European companies”.',
          'A demand that the EU “achieve quantum sovereignty, free from any extraterritorial effects of foreign legislation and regulations”.',
          'Coverage of “the full quantum stack, computing and simulation, communication, and sensing”.',
          'For international companies, access to EU funds only where they are “a strategic asset”, with collaboration “not an obligation”.',
        ],
      },
      {
        heading: 'IonQ assessment',
        note: 'Heavily protectionist — but a negotiating position, not the final word',
        items: [
          'France was always going to take this line; Alice & Bob and Pasqal have advocated consistently for an aggressively pro-European procurement policy enshrined in the EUQA.',
          'Germany’s adoption of it is the surprise, and reads as tactics: its own May 2026 quantum strategy acknowledges that national capability lies substantially behind the cutting edge and that systems must be procured from industry leaders outside Germany.',
          'Germany is committed elsewhere — in the Italian-German Plan of Action — to recognising the importance of the US to Europe in technology and defence. Partnering with France now buys German negotiators the standing to pull them toward the centre later.',
          'Be clear-eyed regardless: the political centre of gravity of the bill now begins thoroughly in the protectionist camp.',
        ],
      },
      {
        heading: 'Engagement already in delivery',
        items: [
          'Commission: agreement secured from the three directorates-general writing the bill — DG-CNECT, DG-JRC and DG-RTD — to meet in August, using the paper itself as the hook.',
          'National capitals: outreach underway to the French, German and Italian technology-policy attachés in Brussels, alongside approaches to national ministries.',
          'Council Presidency: Lithuania holds the Presidency when the bill is debated, so their delegation and ministers are a priority.',
          'Trade associations: joining bodies that can make a pro-US tech argument backed by a broader membership — without that air cover we lobby alone, and risk becoming the poster-child for American tech-imperialism in quantum.',
        ],
      },
    ],
  },
  sources:
    'IonQ internal memo, 28 July 2026, and the clause-by-clause assessment behind it ' +
    '(Confidential). Quoted clauses are verbatim from the position paper; the assessment ' +
    'is condensed.',
};

/* ---- what has to move ------------------------------------------------ */

export const GERMANY_STATE_CHANGES: Callout = {
  id: 'germany-state-changes',
  heading: 'Germany · state changes to drive',
  title: 'From the paper as agreed, to a bill we can sell under',
  standfirst:
    'Four clauses to move and one posture to hold Germany to. The left column is what has ' +
    'been signed; the right is where the text has to land.',
  size: 'full',
  top: 0.125,
  asAt: AS_AT,
  internal: true,
  body: {
    kind: 'state-change',
    fromLabel: 'The paper as agreed',
    toLabel: 'Where the bill has to land',
    driveLabel: 'Engagement',
    rows: [
      {
        id: 'procurement-eligibility',
        topic: 'Procurement eligibility',
        from:
          '“The quantum computers procured should be entirely designed and manufactured ' +
          'in Europe by European companies.” As a hard domicile-and-management test we ' +
          'would struggle to comply without the kind of corporate restructuring AWS and ' +
          'others have adopted in Europe.',
        to:
          '‘European’ defined by operational control and substantive presence, not ' +
          'corporate domicile. Our computing R&D and manufacture are substantially based ' +
          'in Europe, if not in the EU — there is a version of this clause we can back, ' +
          'and the text as agreed leaves the definitions open.',
      },
      {
        id: 'sovereignty',
        topic: 'What sovereignty means',
        from:
          'Sovereignty as freedom “from any extraterritorial effects of foreign ' +
          'legislation and regulations”, delivered through a programme consolidating ' +
          'domestic industrial leaders. Drafted to taint non-European — read American — ' +
          'companies with an inability to operate independently of the US government.',
        to:
          'The owner-operator definition: sovereignty is assured control by the customer, ' +
          'which a vendor can supply. Freedom from extraterritorial effect achieved ' +
          'through where operational control sits, not through where a company is ' +
          'registered.',
      },
      {
        id: 'budget-centralisation',
        topic: 'Where the budget sits',
        from:
          'A significant EU-level procurement programme “coordinated between Member ' +
          'States and the European Commission to avoid budget fragmentation”.',
        to:
          'National quantum programmes preserved alongside EU coordination. ' +
          'Centralisation removes exactly the states most favourable to us — Italy, ' +
          'Sweden, the Baltics — as independent buyers, and with them their ability to ' +
          'build pro-IonQ national strategies.',
      },
      {
        id: 'red-lines',
        topic: 'International cooperation red lines',
        from:
          'Openness to like-minded partners as “a strategic asset, not an obligation”, ' +
          'beside red lines on “unwanted technology transfer” and “foreign ownership of ' +
          'critical quantum infrastructure”. The language is meant for China and is loose ' +
          'enough to catch the United States.',
        to:
          'Name the threat plainly, so allies and adversaries are unambiguous — and press ' +
          'the cooperation framing the same section already contains. Collaboration with a ' +
          'market leader is precisely the “strategic asset” it invites, which differentiates ' +
          'us from wholesale US access.',
      },
      {
        id: 'german-posture',
        topic: 'German posture',
        from:
          'Aligned with France on a maximalist opening bid, at odds with its own May 2026 ' +
          'quantum strategy.',
        to:
          'Germany moves the debate to the middle, as it has before. Its commitments in ' +
          'the Italian-German Plan of Action on the importance of the US in technology and ' +
          'defence are the lever — meet German representation in the EU as a priority, and ' +
          'map which of the French delegation are amenable to a less protectionist posture.',
      },
    ],
    footnote:
      'Two clauses need no shifting and are not rows here: research and talent, and ' +
      'technological breadth. Both are strongly supported — the acquisition of Oxford ' +
      'Ionics relied on the company staying in the Oxford ecosystem, and the full stack ' +
      'the paper describes does not currently exist in Europe without American companies. ' +
      'Say so.',
  },
  sources:
    'IonQ clause-by-clause assessment of the Franco-German position paper (Confidential, ' +
    '28 July 2026). Quoted clauses verbatim; positions condensed.',
};

export const GERMANY_CALLOUTS: readonly Callout[] = [FRANCO_GERMAN, GERMANY_STATE_CHANGES];
