/**
 * resolveCountryStyle.ts — the ONLY place a country's appearance is decided.
 *
 * ENFORCED CONSTRAINT (see CLAUDE.md): no component may set a fill, a stroke
 * or an opacity on a country path. CountryPath.tsx spreads the result of this
 * function and does nothing else. If you find yourself wanting a conditional
 * colour anywhere in render/, it belongs here.
 *
 * Adding a membership layer in State 2 is:
 *   - a file in data/layers/
 *   - an entry in the LAYERS array
 *   - ONE clause in this function, in the marked block
 * Nothing else changes. That is the whole point of the file.
 *
 * Precedence, highest first:
 *   1. selected     — persistent, survives the pointer leaving
 *   2. hovered      — transient
 *   3. layer member — first active layer in LAYERS order that contains it
 *   4. in scope     — plain EMEA land
 *   5. out of scope — rendered, never clipped, unlit
 */
import { palette, tint, withAlpha } from './palette';
import { LAYERS } from '../data/layers';
import type { StyleContext } from '../state/viewState';
import type { Alpha3 } from '../data/iso';

export interface CountryStyle {
  readonly fill: string;
  readonly fillOpacity: number;
  /**
   * Country polygons carry NO stroke. Borders are drawn once, as a shared
   * mesh, so that no boundary is painted twice and no two pulses can drift out
   * of phase along the same line. This field exists to say so explicitly and
   * is always 'none'.
   */
  readonly stroke: 'none';
  /** Group opacity, for dimming non-members when a layer is active. */
  readonly opacity: number;
  /** Marker for the readout and for scene serialisation. Not a colour. */
  readonly state: 'selected' | 'hovered' | 'layer' | 'inScope' | 'outOfScope';
}

const OUT_OF_SCOPE: CountryStyle = {
  fill: palette.landOutOfScope,
  fillOpacity: 1,
  stroke: 'none',
  opacity: 1,
  state: 'outOfScope',
};

const IN_SCOPE: CountryStyle = {
  fill: palette.landInScope,
  fillOpacity: 1,
  stroke: 'none',
  opacity: 1,
  state: 'inScope',
};

const HOVERED: CountryStyle = {
  fill: withAlpha(palette.ionq, tint.hover),
  fillOpacity: 1,
  stroke: 'none',
  opacity: 1,
  state: 'hovered',
};

const SELECTED: CountryStyle = {
  fill: withAlpha(palette.ionq, tint.selected),
  fillOpacity: 1,
  stroke: 'none',
  opacity: 1,
  state: 'selected',
};

/**
 * When any layer is active, non-members recede rather than disappear. Tuned so
 * the map still reads as a whole region — a layer is an overlay on EMEA, not a
 * replacement for it.
 */
const NON_MEMBER_DIM = 0.55;

const IN_SCOPE_DIMMED: CountryStyle = { ...IN_SCOPE, opacity: NON_MEMBER_DIM };

/**
 * REFERENTIAL STABILITY MATTERS HERE.
 *
 * Components subscribe with `useViewState(s => resolveCountryStyle(...))` and
 * zustand compares with Object.is. If this function allocated a fresh object
 * per call, every one of the 238 country paths would re-render on every hover
 * and the pulse would visibly stutter. So every branch returns either a
 * module-level constant or a cached instance, and the cache is keyed on
 * everything that can vary.
 */
const layerStyleCache = new Map<string, CountryStyle>();

function layerStyle(accent: string): CountryStyle {
  let cached = layerStyleCache.get(accent);
  if (!cached) {
    cached = {
      fill: withAlpha(accent, tint.layer),
      fillOpacity: 1,
      stroke: 'none',
      opacity: 1,
      state: 'layer',
    };
    layerStyleCache.set(accent, cached);
  }
  return cached;
}

export function resolveCountryStyle(
  iso: Alpha3,
  inScope: boolean,
  ctx: StyleContext,
): CountryStyle {
  // 1. Selection.
  if (ctx.selectedIso === iso) return SELECTED;

  // 2. Hover.
  if (ctx.hoveredIso === iso) return HOVERED;

  // 3. Membership layers. -------------------------------------------------
  //    STATE 2 EXTENSION POINT. A layer with its own `accent` gets a tint of
  //    that accent; otherwise it gets the IonQ orange layer tint. Non-members
  //    dim. This block is the only edit a new layer requires.
  if (ctx.activeLayers.length > 0) {
    for (const layer of LAYERS) {
      if (!ctx.activeLayers.includes(layer.id)) continue;
      if (!layer.members.includes(iso)) continue;
      return layerStyle(layer.accent ?? palette.ionq);
    }
    if (inScope) return IN_SCOPE_DIMMED;
  }
  // -----------------------------------------------------------------------

  // 4 & 5.
  return inScope ? IN_SCOPE : OUT_OF_SCOPE;
}
