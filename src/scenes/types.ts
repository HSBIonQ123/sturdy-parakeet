/**
 * types.ts — what a scene is.
 *
 * A scene is a saved, named position of the whole instrument: which layers are
 * lit, where the camera is, and what the plate says. Stepping between scenes is
 * how the talk is driven.
 *
 * WHY A SCENE IS NOT JUST A LAYER ID
 * ==================================
 * It would have been quicker to make "show the EU" a bare layer toggle. The
 * reason it is a scene instead: a later scene will need to zoom to Brussels
 * and put a caption on screen. If scenes started life as toggles, adding
 * camera and caption later would mean changing how every existing scene is
 * defined — a rewrite rather than an addition. Carrying the full shape from
 * the first scene costs almost nothing now and nothing at all later.
 *
 * Every field except `id` and `title` is optional, and every optional field
 * has a defined default, so a scene is complete by construction. That matters
 * live: stepping into a scene must always produce the same picture regardless
 * of what you were doing during the previous question.
 */
import type { Alpha3 } from '../data/iso';

/** A camera position, in geographic terms rather than pixels. */
export interface SceneCamera {
  readonly lon: number;
  readonly lat: number;
  /** Zoom, 1 to 8. */
  readonly k: number;
}

export interface Scene {
  /** Stable id. Used by the menu and, later, by saved decks. */
  readonly id: string;
  /** Shown on the title plate. Keep it short — it is read at a glance. */
  readonly title: string;
  /** One line under the title. Optional; omit rather than pad. */
  readonly caption?: string;
  /**
   * Layer ids from data/layers, active in this scene. Empty means the bare
   * base map. Order does not matter here — precedence comes from the LAYERS
   * registry, not from this array.
   */
  readonly layers?: readonly string[];
  /**
   * Camera for this scene. OMIT to return to the fitted EMEA frame.
   *
   * Omitting is not the same as "leave the camera where it is". Scenes are
   * absolute, never relative: if you zoomed into the Gulf to answer a
   * question, stepping to the next scene must restore the composition rather
   * than inherit your improvisation.
   */
  readonly camera?: SceneCamera;
  /** A country held selected when the scene opens. Rarely wanted. */
  readonly selectedIso?: Alpha3;
  /**
   * Markers to show, by id, resolved against src/data/markers.ts. Omit for
   * none.
   *
   * This was `deployments: boolean` while there was exactly one marker source,
   * with a note that it should widen to `markers?: string[]` once a real
   * second case existed to design against. The UK close-up is that case:
   * Westminster is a place the talk points at and explicitly NOT an IonQ site,
   * so it cannot live in deployments.ts, and the scene wants two markers
   * rather than all of them.
   *
   * Ids rather than set names. A scene saying `['westminster', 'oxford']` is
   * the honest description of that slide, and `DEPLOYMENT_IDS` covers the case
   * where a scene does want a whole set without spelling it out. An unknown id
   * throws at resolve time rather than quietly drawing nothing.
   */
  readonly markers?: readonly string[];
  /**
   * Callout panels, by id, resolved against src/data/presenter.ts. Omit for
   * none.
   *
   * A panel is tethered to a marker rather than to a coordinate, so the dot and
   * the line it points from cannot drift apart. Kept separate from `markers`
   * because they are different objects: a marker says where something is, a
   * callout says something about it, and a scene routinely wants one without
   * the other.
   */
  readonly callouts?: readonly string[];
}
