/**
 * closing.ts — the last slide: what the presenter needs from the room.
 *
 * ============================================================================
 * INTERNAL. Four asks, in the presenter's own words, addressed to IonQ
 * colleagues at an internal meeting. It names a colleague, sets a headcount and
 * agency target with a date on it, and asks to be brought into meetings with
 * government officials. Removing it is one import and one scene.
 * ============================================================================
 *
 * A SOURCE FILE OF ITS OWN, because it makes a fifth kind of claim. `presenter`
 * is personal, `policy` is the EU's assessment of us, `strategy`, `poland`,
 * `germany`, `uk` and `lithuania` are what we intend to do in a market, and
 * `ninetyDays` is what has already been done. This is none of those: it is a
 * request FROM the presenter TO his colleagues, written in the first person.
 * That is why the panel's voice ("I", "me", "you") reads differently from every
 * other panel in the deck, and it is why it should not be filed with them.
 *
 * THE FIRST PERSON IS PRESERVED, NOT NEUTRALISED. Every other panel is written
 * about a third party; this one is the presenter speaking to the room. Rewriting
 * "I want to be there" into "Government Affairs should attend" would turn a
 * request between colleagues into a policy, which is a different and much
 * heavier thing to put on a screen — and would be this project editing a person's
 * words in the one place where whose words they are is the whole point.
 *
 * THE TARGET IN ASK 2 IS THE PERISHABLE PART. "Two agencies, two FTE inside IonQ
 * by end of year" is a commitment with a date on it. After that date the slide
 * either reports success or it is out of date, and neither is something a build
 * can work out for itself. The as-at stamp is what makes a stale one visible.
 */
import type { Callout } from './callouts';

export const CLOSING_ASKS: Callout = {
  id: 'closing-asks',
  heading: 'What I need from you',
  title: 'Four asks',
  standfirst:
    'Back out to the whole region, because these apply to all of it — not to the market ' +
    'the talk happened to finish in.',
  /*
   * NO ANCHOR, AND NO MARKER ON THE SCENE. `full` panels take no leader (§7h),
   * and this one has nothing to point at: the asks are about how the team works,
   * not about a place. A line from here to any capital would assert a
   * relationship that is not being claimed — the same reasoning the Quantum Act
   * timeline uses.
   */
  size: 'full',
  asAt: '26 August 2026',
  internal: true,
  body: {
    kind: 'asks',
    asks: [
      {
        id: 'country-plans',
        title: 'Country-by-country plans',
        text:
          'I want to produce them for all your markets. And I want to understand the ' +
          'problems you actually face — as opposed to the problems that I, as a political ' +
          'nerd, think you have.',
      },
      {
        id: 'emea-strategy',
        title: 'A very clear EMEA strategy',
        text:
          'Two agencies and two FTE inside IonQ by end of year. Which means we have to be ' +
          'laser focused.',
      },
      {
        id: 'government-meetings',
        title: 'Talk to me about meetings with government officials',
        text:
          'I am not here to stop you meeting prospects. But if a meeting tips over into ' +
          'shaping policy, I want to be there — to make sure we are not promising things ' +
          'we cannot deliver.',
      },
      {
        id: 'use-me-to-prep',
        title: 'Use me to prep',
        text:
          'It is very clear that Marty knows what you should be focusing your time on. If ' +
          'you need backgrounders on government approaches or on people, we have the ' +
          'capacity to help.',
      },
    ],
  },
  sources: 'IonQ Government Affairs (EMEA). The presenter’s own words, in the first person.',
};

export const CLOSING_CALLOUTS: readonly Callout[] = [CLOSING_ASKS];
