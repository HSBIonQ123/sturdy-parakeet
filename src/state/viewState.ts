/**
 * viewState.ts — the single store.
 *
 * Everything that can change about what is on screen lives here and nowhere
 * else. Components subscribe with selectors so that a hover updates two nodes
 * rather than re-rendering 238 country paths; that selectivity is what holds
 * 60fps while the pulse is running.
 *
 * The shape is deliberately the State 4 shape already. `view` is a discriminated
 * scene descriptor rather than a boolean, so the scene sequencer serialises a
 * `ViewState` slice directly instead of needing a parallel format.
 */
import { create } from 'zustand';
import type { Alpha3 } from '../data/iso';

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
 *   State 4 walks an ordered list of these.
 */
export type View = { readonly kind: 'region'; readonly id: 'emea' };

export interface ViewState {
  view: View;
  /** Layer ids from data/layers. Empty in State 1. Order is activation order. */
  activeLayers: string[];
  selectedIso: Alpha3 | null;
  hoveredIso: Alpha3 | null;
  camera: Camera;

  /** True once the boot sequence has finished or been skipped. */
  booted: boolean;
  /** Mirrors the `prefers-reduced-motion` media query. */
  reducedMotion: boolean;

  setHovered(iso: Alpha3 | null): void;
  select(iso: Alpha3 | null): void;
  clearSelection(): void;
  setCamera(camera: Camera): void;
  resetCamera(): void;
  toggleLayer(id: string): void;
  finishBoot(): void;
  setReducedMotion(value: boolean): void;
}

export const useViewState = create<ViewState>((set) => ({
  view: { kind: 'region', id: 'emea' },
  activeLayers: [],
  selectedIso: null,
  hoveredIso: null,
  camera: IDENTITY_CAMERA,
  booted: false,
  reducedMotion: false,

  setHovered: (iso) =>
    set((s) => (s.hoveredIso === iso ? s : { hoveredIso: iso })),

  select: (iso) => set({ selectedIso: iso }),
  clearSelection: () => set({ selectedIso: null }),

  setCamera: (camera) => set({ camera }),
  resetCamera: () => set({ camera: IDENTITY_CAMERA }),

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
 * A frozen snapshot, for the pure style resolver. Keeping the resolver's input
 * to plain data (rather than the store itself) is what makes it testable and
 * what keeps State 4 able to replay a scene without mounting anything.
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
