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
   * Show IonQ site markers (src/data/deployments.ts).
   *
   * A boolean rather than a marker-set name, deliberately: there is exactly
   * one marker set today and inventing a registry for it would be scaffolding
   * with nothing to hold up. State 3 introduces capital markers, and that is
   * the point to widen this into `markers?: string[]` — one field, one
   * migration, with a real second case to design against.
   */
  readonly deployments?: boolean;
}
