/**
 * viewState.ts — the single store.
 *
 * Everything that can change about what is on screen lives here and nowhere
 * else. Components subscribe with selectors so that a hover updates two nodes
 * rather than re-rendering 238 country paths; that selectivity is what holds
 * 60fps while the pulse is running.
 *
 * THE SCENE SEQUENCER
 * ===================
 * `sceneIndex` is the position in the deck (src/scenes/deck.ts), and it is the
 * only thing the presenter actually moves. Applying a scene writes
 * `activeLayers`, `selectedIso` and the camera — so a scene is absolute, not a
 * delta. Step into a scene after ten minutes of improvised zooming during
 * questions and you get exactly the picture you rehearsed.
 */
import { create } from 'zustand';
import type { Alpha3 } from '../data/iso';
import { DECK, clampSceneIndex } from '../scenes/deck';
import type { Scene } from '../scenes/types';
import { applySceneCamera } from '../render/cameraControl';

/** Camera as a d3-zoom transform. */
export interface Camera {
  readonly k: number;
  readonly x: number;
  readonly y: number;
}

export const IDENTITY_CAMERA: Camera = { k: 1, x: 0, y: 0 };

/**
 * What the map is showing.
 *   State 1: only `region`.
 *   State 3 adds `{ kind: 'capital', iso }` — zoom to a capital with a panel.
 */
export type View = { readonly kind: 'region'; readonly id: 'emea' };

export interface ViewState {
  view: View;
  /** Layer ids from data/layers. Written by the active scene. */
  activeLayers: string[];
  selectedIso: Alpha3 | null;
  hoveredIso: Alpha3 | null;
  camera: Camera;
  /** Whether the active scene shows IonQ site markers. */
  showDeployments: boolean;

  /** Position in the deck. The only thing the presenter moves. */
  sceneIndex: number;
  /** Whether the scene menu is open. Closed during presentation. */
  menuOpen: boolean;

  /** True once the boot sequence has finished or been skipped. */
  booted: boolean;
  /** Mirrors the `prefers-reduced-motion` media query. */
  reducedMotion: boolean;

  setHovered(iso: Alpha3 | null): void;
  select(iso: Alpha3 | null): void;
  clearSelection(): void;
  setCamera(camera: Camera): void;

  gotoScene(index: number): void;
  nextScene(): void;
  prevScene(): void;

  openMenu(): void;
  closeMenu(): void;
  toggleMenu(): void;

  /**
   * Toggle a layer outside the deck. Not bound to any key — the deck is the
   * presentation surface. Kept because it is the natural primitive, and
   * because it is what a future layer switcher would call.
   */
  toggleLayer(id: string): void;

  finishBoot(): void;
  setReducedMotion(value: boolean): void;
}

/** Everything a scene asserts about the store. Camera is applied separately. */
function sceneState(scene: Scene) {
  return {
    activeLayers: [...(scene.layers ?? [])],
    selectedIso: scene.selectedIso ?? null,
    hoveredIso: null,
    showDeployments: scene.deployments ?? false,
  };
}

export const useViewState = create<ViewState>((set, get) => ({
  view: { kind: 'region', id: 'emea' },
  ...sceneState(DECK[0]),
  camera: IDENTITY_CAMERA,
  sceneIndex: 0,
  menuOpen: false,
  booted: false,
  reducedMotion: false,

  setHovered: (iso) => set((s) => (s.hoveredIso === iso ? s : { hoveredIso: iso })),

  select: (iso) => set({ selectedIso: iso }),
  clearSelection: () => set({ selectedIso: null }),

  setCamera: (camera) => set({ camera }),

  gotoScene: (index) => {
    const next = clampSceneIndex(index);
    const scene = DECK[next];
    if (!scene) return;
    set({ sceneIndex: next, menuOpen: false, ...sceneState(scene) });
    // Camera is imperative and lives with d3 — see render/cameraControl.ts.
    applySceneCamera(scene.camera);
  },

  nextScene: () => get().gotoScene(get().sceneIndex + 1),
  prevScene: () => get().gotoScene(get().sceneIndex - 1),

  openMenu: () => set({ menuOpen: true }),
  closeMenu: () => set({ menuOpen: false }),
  toggleMenu: () => set((s) => ({ menuOpen: !s.menuOpen })),

  toggleLayer: (id) =>
    set((s) => ({
      activeLayers: s.activeLayers.includes(id)
        ? s.activeLayers.filter((l) => l !== id)
        : [...s.activeLayers, id],
    })),

  finishBoot: () => set((s) => (s.booted ? s : { booted: true })),
  setReducedMotion: (value) => set({ reducedMotion: value }),
}));

/**
 * Scene state exposed for scripts/verify.mjs, which drives the deck from
 * outside the bundle with real key presses rather than by calling the store.
 */
declare global {
  interface Window {
    __scene?: {
      index: number;
      total: number;
      layers: string[];
      scale: number;
    };
  }
}

if (typeof window !== 'undefined') {
  const publish = (s: ViewState) => {
    window.__scene = {
      index: s.sceneIndex,
      total: DECK.length,
      layers: s.activeLayers,
      scale: s.camera.k,
    };
  };
  publish(useViewState.getState());
  useViewState.subscribe(publish);
}

/** The scene currently on screen. */
export function currentScene(s: ViewState): Scene {
  return DECK[clampSceneIndex(s.sceneIndex)];
}

/**
 * A frozen snapshot, for the pure style resolver. Keeping the resolver's input
 * to plain data (rather than the store itself) is what makes it testable and
 * what lets a scene be replayed without mounting anything.
 */
export interface StyleContext {
  readonly activeLayers: readonly string[];
  readonly selectedIso: Alpha3 | null;
  readonly hoveredIso: Alpha3 | null;
}

export function styleContext(s: ViewState): StyleContext {
  return {
    activeLayers: s.activeLayers,
    selectedIso: s.selectedIso,
    hoveredIso: s.hoveredIso,
  };
}
