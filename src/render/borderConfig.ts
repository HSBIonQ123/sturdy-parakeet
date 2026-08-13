/**
 * borderConfig.ts — every tunable for the border network, in one object.
 *
 * CONTRACT: nothing in BorderMesh.tsx encodes a number. Every value below is
 * pushed to CSS custom properties, so changing anything here takes effect on
 * save with no component edit and no rebuild of render logic. Tune this file
 * live during rehearsal; that is what it is for.
 *
 * Units:
 *   - lengths and widths are SCREEN PIXELS, not map units. The border layers
 *     use `vector-effect: non-scaling-stroke`, so stroke geometry is resolved
 *     in screen space. The practical consequence is that the pulse keeps a
 *     constant apparent length and speed at every zoom level, instead of
 *     stretching into streaks at 8x.
 *   - speeds are pixels per second.
 *   - times are seconds.
 */

export interface PulseLayer {
  /** Stroke width, px. */
  readonly width: number;
  /** Peak opacity of this layer. */
  readonly opacity: number;
  /** Lit length, px. The largest value defines the comet's overall extent. */
  readonly length: number;
}

export const borderConfig = {
  /* ---- the always-lit conductor ------------------------------------ */
  /** Hairline width of the unpowered trace, px. */
  baseWidth: 0.55,
  /** Opacity of the unpowered trace. Deliberately low; it sets the floor. */
  baseOpacity: 0.78,

  /* ---- the static bloom beneath ------------------------------------ */
  /** feGaussianBlur stdDeviation. This is the ONLY filter in the document. */
  glowRadius: 2.4,
  glowWidth: 1.9,
  glowOpacity: 0.34,

  /* ---- the travelling charge --------------------------------------- */
  /**
   * Dashoffset travel in px/s. Start slow. Slow reads as expensive; fast reads
   * as a loading spinner. Below about 12 it stops reading as motion at all.
   */
  pulseSpeed: 24,
  /**
   * Dark gap between charges, px. With `pulseGap` far larger than the longest
   * `length` below, you see discrete travelling sparks. Shrink the ratio and
   * it degrades into a dashed line marching — the marching-ants failure mode
   * that makes this technique look cheap. Keep the lit fraction under ~10%.
   */
  pulseGap: 460,
  /**
   * The comet profile: stacked strokes sharing one speed and one phase, with
   * their leading edges aligned. A short bright core with a longer, dimmer
   * body behind it reads as a charge with a decaying tail rather than a flat
   * lit segment.
   *
   * Note these are plain stacked strokes, NOT a filter. A blur on an animated
   * element re-rasterises every frame and will not hold 60fps across a mesh
   * this size; stacked strokes cost nothing.
   */
  pulseProfile: [
    { width: 3.2, opacity: 0.1, length: 90 }, // outer haze, longest tail
    { width: 1.5, opacity: 0.34, length: 44 }, // body
    { width: 0.85, opacity: 1, length: 15 }, // core, at the leading edge
  ] as readonly PulseLayer[],

  /* ---- ambient modulation ------------------------------------------ */
  /**
   * Slow global opacity oscillation over the pulse group, independent of the
   * travelling charge. Long period; it should be felt, not seen.
   */
  breathe: {
    enabled: true,
    periodSeconds: 10,
    min: 0.72,
    max: 1,
  },

  /**
   * After load, run the pulse bright, then settle to a lower ambient
   * amplitude so the map calms down once you start speaking.
   */
  attenuate: {
    enabled: true,
    /** Seconds at full amplitude before the ramp begins. */
    holdSeconds: 6,
    /** Seconds to fall from `from` to `to`. */
    rampSeconds: 14,
    from: 1,
    to: 0.62,
  },

  /**
   * Every few seconds one border segment spikes to near-white, like a
   * discharge. One at a time, never more. Off by default: it draws the eye,
   * which is a cost you may not want to pay mid-sentence.
   */
  arcFlash: {
    enabled: false,
    /** Seconds between discharges. */
    intervalSeconds: 7,
    /** Duration of a single flash. */
    durationSeconds: 0.55,
    colour: '#FFE9C7',
    width: 1.8,
  },

  /**
   * Boot sequence: the network energises from dark before settling into the
   * ambient pulse. Skippable with any key or click; set `enabled: false` to
   * remove it entirely.
   */
  boot: {
    enabled: true,
    /** Total length of the energising sweep. */
    durationSeconds: 2.6,
    /** Pulse speed multiplier during boot. */
    speedMultiplier: 9,
    /** Lit-length multiplier during boot, so light floods rather than dots. */
    lengthMultiplier: 5,
  },

  /* ---- hover and selection ----------------------------------------- */
  /**
   * The hovered country's own outline is drawn on top, pulse-free.
   *
   * `underWidth` is the trick that makes it *still* rather than merely
   * brighter: a wider dark stroke underneath occludes the travelling pulse on
   * exactly those segments, so nothing moves inside the hovered outline. With
   * every border on the map already orange, stillness is the contrast that
   * survives — hue alone would not.
   */
  hover: {
    width: 1.3,
    underWidth: 3.4,
    underOpacity: 0.92,
  },
  selection: {
    width: 1.5,
    underWidth: 3.8,
    underOpacity: 0.95,
  },

  /* ---- membership layers ------------------------------------------- */
  /**
   * How much brighter the borders INTERNAL to an active membership layer run
   * than the ambient network. This is the difference between the EU reading as
   * an energised circuit and reading as a shape coloured in.
   *
   * Keep it moderate. Push the scales much past 2 and the bloc's interior
   * out-shouts its own outline, which inverts the thing you are showing.
   */
  member: {
    /** Multiplier on each pulse layer's width. */
    pulseWidthScale: 1.7,
    /** Multiplier on each pulse layer's opacity, clamped to 1. */
    pulseOpacityScale: 1.9,
    /** The always-lit conductor beneath, for member borders. */
    baseWidth: 0.9,
    baseOpacity: 0.95,
  },

  /* ---- disputed lines ---------------------------------------------- */
  /** De facto administrative lines. Dashed hairline, never pulses. */
  deFacto: {
    width: 0.55,
    opacity: 0.7,
    /** `stroke-dasharray`, px. */
    dash: '2.5 3',
  },

  /* ---- out-of-scope and neutral ------------------------------------ */
  outOfScope: {
    width: 0.4,
    /** The 25% called for in the brief. */
    opacity: 0.25,
  },
  coastline: {
    width: 0.5,
    opacity: 0.95,
  },
  /** Out-of-scope land keeps a coastline, or it reads as ocean, not land. */
  outOfScopeCoastline: {
    opacity: 0.3,
  },
  graticule: {
    width: 0.5,
    opacity: 0.3,
    /** Interval in degrees. */
    stepDegrees: 10,
  },
} as const;

export type BorderConfig = typeof borderConfig;

/** The dash cycle: one lit run plus one gap. Longest layer defines the span. */
export function pulseCycle(cfg: BorderConfig = borderConfig): number {
  const longest = Math.max(...cfg.pulseProfile.map((l) => l.length));
  return longest + cfg.pulseGap;
}

/** Seconds for one full cycle at `pulseSpeed`. */
export function pulsePeriod(cfg: BorderConfig = borderConfig): number {
  return pulseCycle(cfg) / cfg.pulseSpeed;
}

/**
 * Per-layer base dashoffset that aligns every layer's LEADING edge, so the
 * short bright core sits at the front of the comet and the long dim haze
 * trails behind it. Without this the layers align at their trailing edges and
 * the shape reads backwards.
 */
export function layerPhase(layer: PulseLayer, cfg: BorderConfig = borderConfig): number {
  const longest = Math.max(...cfg.pulseProfile.map((l) => l.length));
  return -(longest - layer.length);
}

/**
 * Everything above, flattened into CSS custom properties. This is the single
 * bridge between the config and the stylesheet: BorderMesh reads no numbers,
 * it just spreads this onto a style attribute.
 */
export function borderCssVars(cfg: BorderConfig = borderConfig): Record<string, string> {
  const cycle = pulseCycle(cfg);
  const period = pulsePeriod(cfg);

  const vars: Record<string, string> = {
    '--base-width': `${cfg.baseWidth}`,
    '--base-opacity': `${cfg.baseOpacity}`,
    '--glow-radius': `${cfg.glowRadius}`,
    '--glow-width': `${cfg.glowWidth}`,
    '--glow-opacity': `${cfg.glowOpacity}`,

    '--pulse-cycle': `${cycle}`,
    '--pulse-period': `${period}s`,
    '--pulse-gap': `${cfg.pulseGap}`,

    '--breathe-period': `${cfg.breathe.periodSeconds}s`,
    '--breathe-min': `${cfg.breathe.min}`,
    '--breathe-max': `${cfg.breathe.max}`,

    // Expressed as a delay plus a ramp rather than a percentage stop, because
    // @keyframes selectors cannot take a var().
    '--attenuate-hold': `${cfg.attenuate.holdSeconds}s`,
    '--attenuate-ramp': `${cfg.attenuate.rampSeconds}s`,
    '--attenuate-from': `${cfg.attenuate.enabled ? cfg.attenuate.from : cfg.attenuate.from}`,
    '--attenuate-to': `${cfg.attenuate.enabled ? cfg.attenuate.to : cfg.attenuate.from}`,

    '--boot-duration': `${cfg.boot.durationSeconds}s`,
    '--boot-period': `${period / cfg.boot.speedMultiplier}s`,

    '--flash-colour': cfg.arcFlash.colour,
    '--flash-width': `${cfg.arcFlash.width}`,
    '--flash-duration': `${cfg.arcFlash.durationSeconds}s`,

    '--hover-width': `${cfg.hover.width}`,
    '--hover-under-width': `${cfg.hover.underWidth}`,
    '--hover-under-opacity': `${cfg.hover.underOpacity}`,
    '--select-width': `${cfg.selection.width}`,
    '--select-under-width': `${cfg.selection.underWidth}`,
    '--select-under-opacity': `${cfg.selection.underOpacity}`,

    '--member-base-width': `${cfg.member.baseWidth}`,
    '--member-base-opacity': `${cfg.member.baseOpacity}`,

    '--defacto-width': `${cfg.deFacto.width}`,
    '--defacto-opacity': `${cfg.deFacto.opacity}`,
    '--defacto-dash': cfg.deFacto.dash,

    '--oos-width': `${cfg.outOfScope.width}`,
    '--oos-opacity': `${cfg.outOfScope.opacity}`,
    '--oos-coast-opacity': `${cfg.outOfScopeCoastline.opacity}`,
    '--coast-width': `${cfg.coastline.width}`,
    '--coast-opacity': `${cfg.coastline.opacity}`,
    '--graticule-width': `${cfg.graticule.width}`,
    '--graticule-opacity': `${cfg.graticule.opacity}`,
  };

  cfg.pulseProfile.forEach((layer, i) => {
    vars[`--pulse-${i}-width`] = `${layer.width}`;
    vars[`--pulse-${i}-opacity`] = `${layer.opacity}`;
    vars[`--pulse-${i}-dash`] = `${layer.length} ${cycle - layer.length}`;
    vars[`--pulse-${i}-phase`] = `${layerPhase(layer, cfg)}`;
    vars[`--pulse-${i}-end`] = `${layerPhase(layer, cfg) - cycle}`;
    vars[`--pulse-${i}-boot-dash`] =
      `${layer.length * cfg.boot.lengthMultiplier} ${cycle - layer.length * cfg.boot.lengthMultiplier}`;
  });

  return vars;
}
