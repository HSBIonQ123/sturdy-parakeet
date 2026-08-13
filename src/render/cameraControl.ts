/**
 * cameraControl.ts — a tiny imperative bridge to the camera.
 *
 * The camera lives inside Map.tsx, because d3-zoom must own the <svg> and its
 * own transform state. But scenes need to drive it, and scenes are applied
 * from the store, which sits above Map in the tree.
 *
 * Rather than lift zoom state into the store — which would mean React
 * re-rendering the whole map on every wheel tick, and d3's transform and the
 * store's transform arguing about which is authoritative — Map registers two
 * commands here at mount. Callers ask for a position; d3 remains the single
 * source of truth for what the transform actually is.
 *
 * This is the only imperative escape hatch in the project. It exists because
 * the alternative is worse, not because it is tidy.
 */
import type { SceneCamera } from '../scenes/types';

interface CameraCommands {
  /** Move to a geographic point at a scale, with a transition. */
  focus(lon: number, lat: number, k: number): void;
  /** Return to the fitted EMEA frame, with a transition. */
  reset(): void;
}

let commands: CameraCommands | null = null;

/** Called by Map on mount. Returns an unregister function. */
export function registerCamera(next: CameraCommands): () => void {
  commands = next;
  return () => {
    if (commands === next) commands = null;
  };
}

/**
 * Apply a scene's camera. `undefined` means the fitted frame — scenes are
 * absolute, so an omitted camera actively resets rather than leaving whatever
 * the previous question left behind.
 */
export function applySceneCamera(camera: SceneCamera | undefined): void {
  if (!commands) return;
  if (camera) commands.focus(camera.lon, camera.lat, camera.k);
  else commands.reset();
}

export function resetCamera(): void {
  commands?.reset();
}
