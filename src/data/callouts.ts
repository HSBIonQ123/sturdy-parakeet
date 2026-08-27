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
import { NINETY_DAY_CALLOUTS } from './ninetyDays';
import { EUQA_CALLOUTS } from './euQuantumAct';
import { GERMANY_CALLOUTS } from './germany';
import { POLAND_CALLOUTS } from './poland';
import { LITHUANIA_CALLOUTS } from './lithuania';
import { UK_CALLOUTS } from './uk';

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

/**
 * One row of a before/after register: a thing that was in one state and is now
 * in another.
 *
 * `topic` is what the row is ABOUT and is required, because the two states only
 * read as a pair once you know what pair they are — a grid of befores and afters
 * with no keys is a wall of prose. Adding a row is one object here and nothing
 * else; the guard against adding one too many is `verify.mjs`, which fails when
 * the panel stops fitting the frame.
 */
export interface StateChangeRow {
  readonly id: string;
  readonly topic: string;
  readonly from: string;
  readonly to: string;
}

/** How severe an exposure is. Three levels, drawn as a three-segment meter. */
export type RiskLevel = 'low' | 'medium' | 'high';

/** One end of a risk row: where it stood, at what severity. */
export interface RiskState {
  readonly level: RiskLevel;
  readonly title: string;
  readonly detail: string;
}

/**
 * One exposure, from where it was to where it is.
 *
 * `verb` is the source's own word for the shift — Reduced, Mitigated, Prepared.
 * There is deliberately NO direction field: the arrow is derived at render from
 * the two levels, so it can never point a way its own row contradicts. See the
 * note in ninetyDays.ts, where the source's glyphs disagree with its own levels
 * on one row.
 */
export interface RiskRow {
  readonly id: string;
  readonly from: RiskState;
  readonly verb: string;
  readonly to: RiskState;
  readonly drivers: readonly string[];
}

/**
 * One pillar of a market strategy: what we are doing, what we say, how it gets
 * done.
 *
 * The three parts are separate FIELDS rather than three bullets, because they
 * are three different kinds of sentence and the room needs to know which it is
 * hearing — a strategy is a position, a message is what comes out of your
 * mouth, and an execution step is a thing somebody has to go and do. Flattened
 * into a list they read as one undifferentiated paragraph of intent.
 */
export interface Pillar {
  readonly id: string;
  readonly name: string;
  readonly strategy: string;
  readonly message: string;
  readonly execution: string;
}

/** One person or body worth meeting, and why. */
export interface Stakeholder {
  readonly id: string;
  readonly name: string;
  /** A post, where the stakeholder is a person rather than an institution. */
  readonly role?: string;
  /** What they are, or what they do. */
  readonly what: string;
  /** What a meeting would achieve. Omitted where the source does not say. */
  readonly why?: string;
}

/** A category of stakeholder — political, institutional, and so on. */
export interface StakeholderGroup {
  readonly id: string;
  readonly label: string;
  readonly entries: readonly Stakeholder[];
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
    }
  | {
      /**
       * A register of before/after pairs, with one drive across the gutter they
       * all cross. The rows are ions in a trap and the drive is what flips them
       * — which is the deck's own metaphor rather than a chart borrowed into it.
       */
      readonly kind: 'state-change';
      readonly fromLabel: string;
      readonly toLabel: string;
      /** Printed once over the gutter: the one thing flipping every row. */
      readonly driveLabel: string;
      readonly rows: readonly StateChangeRow[];
      /**
       * For what belongs with the grid but is not a row. A state-change table
       * with a row that does not change teaches the eye to stop trusting the
       * arrows, so anything already where it needs to be goes here instead.
       */
      readonly footnote?: string;
    }
  | {
      /**
       * A risk register: severity, the shift, and what drove it.
       *
       * NOT merged with `state-change`, though both are before/after tables.
       * A risk row carries severity levels and a list of drivers, and it earns
       * a severity meter and a four-column layout that a state-change row would
       * have nothing to put in. The union exists precisely so a body cannot be
       * handed to a layout that cannot render it, and two kinds that differ by
       * three optional fields is how that guarantee gets given up.
       */
      readonly kind: 'risk-register';
      readonly fromLabel: string;
      readonly shiftLabel: string;
      readonly toLabel: string;
      readonly driversLabel: string;
      readonly rows: readonly RiskRow[];
    }
  | {
      /**
       * A market strategy as its pillars, side by side — a column each, so the
       * whole approach is one picture rather than four consecutive slides. The
       * pillars are numbered in the layout from their position, not in the data,
       * because a hand-written number is the thing that goes stale the moment
       * somebody reorders them.
       */
      readonly kind: 'pillars';
      readonly pillars: readonly Pillar[];
      readonly footnote?: string;
    }
  | {
      /**
       * A stakeholder map: who to meet, grouped by the kind of body they are.
       *
       * Grouped rather than ranked. A visit is not a priority list — a minister,
       * an agency and a trade association are three different KINDS of meeting
       * with three different purposes, and putting them in one ordered column
       * would imply a ranking the source does not make.
       */
      readonly kind: 'stakeholders';
      readonly groups: readonly StakeholderGroup[];
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
  /**
   * Where the panel's top edge sits, as a fraction of viewport height,
   * overriding the default for its size.
   *
   * `full`'s default is set for the timeline, which is a BAND across the lower
   * frame with the map legible above it. A full-width TABLE is a page: it starts
   * high and runs down. Rather than invent a second full-width size whose only
   * difference is one number, the number itself is the field — and it stays
   * optional, so the two panels that need it say so and nothing else changes.
   */
  readonly top?: number;
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
  ...NINETY_DAY_CALLOUTS,
  ...EUQA_CALLOUTS,
  ...GERMANY_CALLOUTS,
  ...POLAND_CALLOUTS,
  ...UK_CALLOUTS,
  ...LITHUANIA_CALLOUTS,
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
