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
import { EU } from './eu';
import { EEA_EFTA_UK } from './eeaEftaUk';
import { HORIZON_EUROPE } from './horizonEurope';

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
  /**
   * Other layer ids whose members also count as connected when energising THIS
   * layer's borders.
   *
   * Without it a layer only lights borders between two of its own members,
   * which is right for a self-contained bloc and useless for one that is
   * defined by its relationship to another — the EEA states share almost no
   * borders with each other, but every one of them touches the EU.
   *
   * Arcs already claimed by a higher-precedence active layer are not redrawn.
   * MemberCircuit deduplicates in LAYERS order, so a border is stroked exactly
   * once no matter how many layers could claim it.
   */
  readonly circuitWith?: readonly string[];
  /**
   * How members are filled. Defaults to `solid`.
   *
   * `hatch` exists because colour alone cannot carry a second tier here. The
   * IonQ gradient (#FF5000 -> #FF8300 -> #FFB700) is a pure hue rotation
   * inside the orange band, so at the 15% alpha a fill needs, any two stops
   * differ by about 8 units of green — against a distance of 39 from a lit
   * country to an unlit one. Tier-to-tier separation would be a fifth of
   * tier-to-unlit, which does not survive a projector.
   *
   * A hatch separates on shape rather than tone, so it holds at any brightness,
   * and solid-versus-hatched is the convention this audience already reads as
   * member-versus-associated. The accent still shifts along the brand gradient,
   * so the tiers remain two states of one thing rather than two categories.
   */
  readonly fillPattern?: 'solid' | 'hatch';
}

/** Ordered layer registry. Precedence is array order. */
export const LAYERS: readonly MembershipLayer[] = [
  // EU first: where a country or a border could belong to both tiers, the
  // stricter membership wins. Precedence is this array's order.
  EU,
  EEA_EFTA_UK,
  HORIZON_EUROPE,
  // Still to come: NATO, EuroQCI, EU Quantum Flagship, Commonwealth, GCC,
  // Council of Europe. Each is one file here plus one entry in this array.
];

export const LAYER_BY_ID: Readonly<Record<string, MembershipLayer>> =
  Object.fromEntries(LAYERS.map((l) => [l.id, l]));
