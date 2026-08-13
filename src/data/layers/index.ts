/**
 * layers/ — membership layers. EMPTY IN STATE 1, BY DESIGN.
 *
 * THE LAYER CONTRACT
 * ==================
 * A membership layer is an array of alpha-3 codes and nothing else. No
 * geometry, no colours beyond an optional accent, no rendering logic.
 *
 * To add a layer in State 2:
 *   1. Create `src/data/layers/eu.ts` exporting a `MembershipLayer`.
 *   2. Add it to the `LAYERS` array below.
 *   3. Add one clause to `resolveCountryStyle` in render/resolveCountryStyle.ts.
 *
 * That is the whole procedure. If adding a layer requires touching Map.tsx,
 * BorderMesh.tsx, CountryPath.tsx or the store, the architecture has drifted
 * and should be corrected rather than worked around.
 *
 * The layer list is ordered. When a country belongs to several active layers,
 * `resolveCountryStyle` resolves by the first match in this array, so ordering
 * here is the precedence rule — it is deliberately data, not code.
 */
import type { Alpha3 } from '../iso';

export interface MembershipLayer {
  /** Stable machine id, used in scene definitions in State 4. */
  readonly id: string;
  /** Short label for the layer switcher and the telemetry strip. */
  readonly label: string;
  /** One line for the readout when the layer is active. */
  readonly description: string;
  /** The membership. Alpha-3 codes, resolved against iso.ts at load. */
  readonly members: readonly Alpha3[];
  /**
   * Optional accent. Omit to inherit IonQ orange. Reach for this sparingly —
   * the palette discipline is that orange is the only brand colour, and two
   * layers competing in different hues will read as a chart, not an instrument.
   */
  readonly accent?: string;
}

/** Ordered layer registry. Precedence is array order. */
export const LAYERS: readonly MembershipLayer[] = [
  // State 2 populates this: EU, NATO, EuroQCI, EU Quantum Flagship,
  // Commonwealth, GCC, Council of Europe.
];

export const LAYER_BY_ID: Readonly<Record<string, MembershipLayer>> =
  Object.fromEntries(LAYERS.map((l) => [l.id, l]));
