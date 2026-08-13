/**
 * palette.ts — the only place a colour is defined.
 *
 * These tokens are pushed onto :root as CSS custom properties at mount (see
 * applyPalette below), so the stylesheet references var(--tok) and never a
 * literal. One source of truth, no drift between CSS and TS.
 *
 * DISCIPLINE: orange is the sole brand accent and appears in exactly three
 * roles — the border network, selection, and the readout rule. Everything else
 * is neutral. Adding a fourth hue to this file is a design decision, not a
 * convenience; the instrument reads as an instrument because it is monochrome
 * plus one.
 *
 * On the orange: `ionq` below was sampled from assets/ionq-logo.webp, the
 * official wordmark in this repository. The mark is a three-stop gradient
 * (#FF5000 -> #FF8300 -> #FFB700); #FF8300 is the mid stop and the value that
 * reads as "IonQ orange" on its own. The brief specified #FF8200, which is one
 * unit of green away and visually identical — the sampled value is used.
 */

export const palette = {
  /** Canvas behind everything. */
  base: '#06080B',
  /** Panels: readout, telemetry strip. */
  panel: '#0D1116',

  /** Land inside EMEA. */
  landInScope: '#141A21',
  /** Land outside EMEA. Rendered, never clipped, but unlit. */
  landOutOfScope: '#0A0D11',

  /** The unpowered conductor. Every in-scope border carries this always. */
  borderBase: '#8A4200',
  /** The travelling charge. A filament at temperature, not a flat brand fill. */
  borderPulse: '#FFB04D',

  /** Coastline, exterior boundary, graticule. Neutral, never pulses. */
  neutralLine: '#2A3440',

  /** IonQ orange, sampled. Selection, active state, readout accent only. */
  ionq: '#FF8300',
  /** The logo gradient, recorded for reference. Not used in State 1. */
  ionqGradient: ['#FF5000', '#FF8300', '#FFB700'] as const,

  typePrimary: '#C9D3DD',
  typeMuted: '#5E6B79',
} as const;

/** Fill tints. Alpha applied to `ionq`, per the 8–14% band in the brief. */
export const tint = {
  hover: 0.1,
  selected: 0.14,
  /**
   * Layer members. The brief's 8-14% band was written for a highlight seen
   * close up; on a projector, which crushes low-end contrast, 8% over
   * #141A21 does not survive the room. 15% is the lowest value that still
   * reads as "these ones" from the back of a hall, and it stays inside the
   * spirit of the band. Verify on the actual display before changing it.
   */
  layer: 0.15,
} as const;

/** Push tokens onto :root so CSS can reference them. Called once at mount. */
export function applyPalette(root: HTMLElement = document.documentElement): void {
  const set = (k: string, v: string) => root.style.setProperty(k, v);
  set('--base', palette.base);
  set('--panel', palette.panel);
  set('--land-in', palette.landInScope);
  set('--land-out', palette.landOutOfScope);
  set('--border-base', palette.borderBase);
  set('--border-pulse', palette.borderPulse);
  set('--neutral-line', palette.neutralLine);
  set('--ionq', palette.ionq);
  set('--type', palette.typePrimary);
  set('--type-muted', palette.typeMuted);
}

/** `#RRGGBB` + alpha -> `rgba(...)`. Used by resolveCountryStyle for tints. */
export function withAlpha(hex: string, alpha: number): string {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
