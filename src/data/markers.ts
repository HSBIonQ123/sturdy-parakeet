/**
 * markers.ts — every point the map can put a dot on, in one registry.
 *
 * WHY THIS FILE EXISTS NOW AND NOT BEFORE
 * =======================================
 * `deployments.ts` was the only marker source, so a scene said
 * `deployments: true` and the component read that one array. scenes/types.ts
 * recorded the migration to make when a real second source arrived — one
 * field, one change, designed against an actual second case rather than an
 * imagined one — and the UK close-up is that case: Westminster is a place the
 * talk needs to point at and emphatically NOT an IonQ site.
 *
 * So a scene now names the markers it wants by id, and a marker set is just an
 * array in a file. This is the same shape as the layer contract: data declares
 * membership, the renderer asks the registry, and adding a source touches no
 * rendering code.
 *
 * ONE COMPONENT, MANY SOURCES. render/Markers.tsx draws everything here.
 * CLAUDE.md §7e is explicit that State 3's capital markers must be that same
 * component with a different data source rather than a second marker system,
 * and this registry is what makes that a one-line addition: capitals.ts
 * becomes a third entry below.
 */
import type { Alpha3 } from './iso';
import { DEPLOYMENTS } from './deployments';
import { INSTITUTIONS } from './institutions';

export type MarkerKind =
  /** A national or metropolitan quantum key distribution network. */
  | 'network'
  /** An IonQ quantum computer installed and operating on site. */
  | 'system'
  /** Engineering, research or manufacturing presence. */
  | 'engineering'
  /**
   * A seat of government, parliament or institution. NOT an IonQ presence —
   * this kind exists precisely so that a place the talk points at can never be
   * mistaken for a place IonQ occupies. Drawn differently for the same reason;
   * see render/Markers.tsx.
   */
  | 'institution';

export interface Marker {
  /** Stable id. This is what a scene lists. */
  readonly id: string;
  /** Host, partner, programme or institution, as it should appear on screen. */
  readonly label: string;
  /** Place the marker sits on. */
  readonly place: string;
  readonly iso: Alpha3;
  readonly lat: number;
  readonly lon: number;
  readonly kind: MarkerKind;
  /** Whether the coordinate is the real site or a country-level stand-in. */
  readonly precision: 'site' | 'country';
  /** One line under the label. Keep it short — it is read at a glance. */
  readonly detail?: string;
  /**
   * Preferred side for the label. A preference, not a promise: Markers.tsx
   * flips it when the frame edge leaves no room on that side.
   */
  readonly labelSide?: 'left' | 'right';
  /** Vertical nudge in px, for when flipping the side is not enough. */
  readonly labelDy?: number;
  /** Where this came from. Every entry must have one. */
  readonly source: string;
}

/**
 * The registry. Order here is draw order, and it is stable regardless of what
 * order a scene lists its markers in — so two scenes showing the same pair
 * cannot stack them differently.
 */
export const MARKERS: readonly Marker[] = [...DEPLOYMENTS, ...INSTITUTIONS];

export const MARKER_BY_ID: Readonly<Record<string, Marker>> = Object.fromEntries(
  MARKERS.map((m) => [m.id, m]),
);

/**
 * Ids are the join key between a scene and this registry, exactly as alpha-3
 * is between a layer and the topology, so a typo must fail loudly rather than
 * silently drawing nothing. A scene listing an unknown marker is a broken
 * slide, and finding out at rehearsal is too late.
 */
const duplicates = MARKERS.map((m) => m.id).filter((id, i, all) => all.indexOf(id) !== i);
if (duplicates.length > 0) {
  throw new Error(`markers.ts: duplicate marker ids — ${duplicates.join(', ')}`);
}

/** Resolve a scene's marker ids, in registry order. Throws on an unknown id. */
export function resolveMarkers(ids: readonly string[]): readonly Marker[] {
  const unknown = ids.filter((id) => !MARKER_BY_ID[id]);
  if (unknown.length > 0) {
    throw new Error(`Unknown marker id(s): ${unknown.join(', ')}`);
  }
  return MARKERS.filter((m) => ids.includes(m.id));
}
