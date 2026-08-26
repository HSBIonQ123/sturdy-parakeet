/**
 * callouts.ts — every panel the deck can put beside the map, in one registry.
 *
 * Same shape as markers.ts, and for the same reason: the panels come from
 * sources that make completely different claims. `presenter.ts` is personal
 * — a family and a career. `policy.ts` is an internal legislative assessment
 * with named advisers and a leaked draft behind it. `strategy.ts` is neither:
 * it is what IonQ intends to do about those files, in which capital and through
 * which relationship. Keeping them in separate files means the sensitive ones
 * can be found, reviewed or removed on their own, and it means no source file
 * has to know how a panel is drawn.
 *
 * ONE COMPONENT, MANY BODIES. render/Callouts.tsx draws everything here. A body
 * is a discriminated union rather than one shape with optional fields, because a
 * figure row, a numbered list, a sectioned briefing, a seven-stage timeline and
 * a two-way circuit lay out nothing like each other — the union is what stops a
 * panel being handed to a layout that cannot render it.
 */
import type { FigureIconId } from '../render/FigureIcon';
import { PRESENTER_CALLOUTS } from './presenter';
import { POLICY_CALLOUTS } from './policy';
import { STRATEGY_CALLOUTS } from './strategy';

/** A figure in the family panel: one glyph, one name under it. */
export interface Figure {
  readonly id: string;
  /** Which glyph to draw. The shapes live in render/, this file only names one. */
  readonly icon: FigureIconId;
  /** Name printed under the glyph. */
  readonly label: string;
}

/**
 * A block of a briefing panel: a heading, an optional standing note, and the
 * points themselves.
 *
 * `note` exists because the source documents put a one-line verdict under two
 * of the four headings — "Material — severity not fixable until publication" —
 * and that line is the most important thing in the section. It is typed
 * separately so it can be given the accent rather than being lost as the first
 * bullet of four.
 */
export interface Section {
  readonly heading: string;
  readonly note?: string;
  readonly items: readonly string[];
}

/**
 * One end of an influence circuit — a place where decisions are taken.
 *
 * Deliberately NOT a marker id. The circuit nodes are Rome and Brussels as
 * institutions, and the diagram is about the relationship between them rather
 * than about where they sit; tying a node to a coordinate would invite someone
 * to draw a line from the box to the dot, which would be the panel making a
 * geographic claim the argument does not need. The panel's one leader line
 * still tethers to a marker, as every anchored panel does.
 */
export interface CircuitNode {
  readonly id: string;
  readonly label: string;
  /** What sits there, in the key register — 'Commission · Council · ENISA'. */
  readonly detail: string;
}

/**
 * A named lever on one arm of the circuit: the thing that makes that direction
 * actually work. Kept as its own type rather than a second list of strings
 * because a lever has a name AND a case for it, and the name is what the room
 * remembers.
 */
export interface CircuitLever {
  readonly id: string;
  readonly label: string;
  readonly detail: string;
}

/** One direction of travel round the circuit. */
export interface CircuitArm {
  readonly id: string;
  /** Which way the current runs. Decides which end the arrowhead is drawn at. */
  readonly direction: 'up' | 'down';
  readonly label: string;
  readonly claim: string;
  readonly levers?: readonly CircuitLever[];
}

/** One stage of a legislative timeline. */
export interface Stage {
  readonly id: string;
  readonly stage: string;
  readonly timing: string;
  readonly what: string;
  readonly engagement: string;
}

export type CalloutBody =
  | { readonly kind: 'figures'; readonly figures: readonly Figure[] }
  | { readonly kind: 'list'; readonly items: readonly string[] }
  | { readonly kind: 'prose'; readonly heading: string; readonly text: string }
  | { readonly kind: 'sections'; readonly sections: readonly Section[] }
  | {
      readonly kind: 'timeline';
      readonly stages: readonly Stage[];
      /**
       * Where the talk is standing on the track, as a stage id. A stage id
       * rather than a date or a fraction: the marker then sits on a node the
       * layout has already placed, so it cannot drift when the stages change,
       * and it says something true — we are IN that stage, not at a point
       * between two of them.
       */
      readonly nowAtStage: string;
      /** Label for the marker. Read aloud as much as read off the screen. */
      readonly nowLabel: string;
      readonly footnote?: string;
    }
  | {
      /**
       * Two nodes and the two directions of travel between them — the shape an
       * argument takes when it is a loop rather than a list.
       *
       * `arms` is a TUPLE of exactly two, not an array, because the layout is a
       * circuit: two columns between two nodes. A third arm has nowhere to go
       * and a single arm is not a circuit, so the type says two and the
       * renderer never has to decide what to do with a number it cannot draw.
       * Which way each one runs is `direction`, not position, so swapping the
       * columns is a reorder in the data and the arrowheads follow.
       */
      readonly kind: 'circuit';
      readonly top: CircuitNode;
      readonly bottom: CircuitNode;
      readonly arms: readonly [CircuitArm, CircuitArm];
      readonly footnote?: string;
    };

/** Panel width. `full` spans the frame and takes no leader line. */
export type CalloutSize = 'standard' | 'wide' | 'full';

export interface Callout {
  readonly id: string;
  /** Small key-register heading, in the same idiom as READOUT on the panel. */
  readonly heading: string;
  /**
   * A second heading line, for panels whose subject needs naming as well as
   * labelling — the policy briefings carry the document title here.
   */
  readonly title?: string;
  /**
   * A quiet line under the heading, for a caveat or a standing qualification.
   * Separate from `title` because the timeline's caveat — every date moves with
   * the publication date — was set as a title and rendered as the largest text
   * on screen, which made a disclaimer the headline.
   */
  readonly standfirst?: string;
  /**
   * The marker id this panel's leader line is drawn from, if any. A marker
   * rather than a coordinate, so the dot and the line can never drift apart.
   *
   * OPTIONAL, because a full-width panel has nothing to point at: a timeline
   * across the bottom of the frame is about the calendar, not about a place, and
   * a line running from it to a dot would be asserting a relationship that is
   * not there.
   */
  readonly anchor?: string;
  /** Which side of the frame the panel sits on. Ignored when size is `full`. */
  readonly side?: 'left' | 'right';
  readonly size?: CalloutSize;
  /** Provenance, printed small at the foot of the panel. */
  readonly sources?: string;
  /** As-at date of the content, printed with the heading. */
  readonly asAt?: string;
  /**
   * Marks the panel's content as internal. Stamps the panel, so nobody can be
   * on one of these scenes and not know what is on screen.
   */
  readonly internal?: boolean;
  readonly body: CalloutBody;
}

/** Ordered registry. Order is draw order when a scene shows more than one. */
export const CALLOUTS: readonly Callout[] = [
  ...PRESENTER_CALLOUTS,
  ...POLICY_CALLOUTS,
  ...STRATEGY_CALLOUTS,
];

export const CALLOUT_BY_ID: Readonly<Record<string, Callout>> = Object.fromEntries(
  CALLOUTS.map((c) => [c.id, c]),
);

const duplicates = CALLOUTS.map((c) => c.id).filter((id, i, all) => all.indexOf(id) !== i);
if (duplicates.length > 0) {
  throw new Error(`callouts.ts: duplicate callout ids — ${duplicates.join(', ')}`);
}

/**
 * Resolve a scene's callout ids. Throws on an unknown id for the same reason
 * `resolveMarkers` does: a panel that silently fails to appear is a blank half
 * of a slide, and rehearsal is too late to find out.
 */
export function resolveCallouts(ids: readonly string[]): readonly Callout[] {
  const unknown = ids.filter((id) => !CALLOUT_BY_ID[id]);
  if (unknown.length > 0) {
    throw new Error(`Unknown callout id(s): ${unknown.join(', ')}`);
  }
  return CALLOUTS.filter((c) => ids.includes(c.id));
}
