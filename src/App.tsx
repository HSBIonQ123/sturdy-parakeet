/**
 * App.tsx — the shell.
 *
 * Composition only: the map fills the frame, the chrome sits in the margins.
 * EMEA is a tall region and presentation displays are wide, so the fitted map
 * is height-constrained and leaves margins at left and right. The title plate
 * and the readout live in those margins by design, not by accident, and never
 * overlap the landmass at 16:9.
 */
import { useEffect, useMemo } from 'react';
import type { CSSProperties } from 'react';
import { Map } from './render/Map';
import { Readout } from './render/Readout';
import { Telemetry } from './render/Telemetry';
import { CornerBrackets, TitlePlate, Legend } from './render/Chrome';
import { applyPalette } from './render/palette';
import { borderCssVars } from './render/borderConfig';
import { useViewState } from './state/viewState';

export function App() {
  const setReducedMotion = useViewState((s) => s.setReducedMotion);

  useEffect(() => {
    applyPalette();
  }, []);

  // Mirror prefers-reduced-motion into the store as well as honouring it in
  // the stylesheet, so the fallback is one decision rather than two that can
  // disagree, and so a future in-app toggle behaves identically.
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReducedMotion(query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, [setReducedMotion]);

  // Border tunables land on the app root, not on the mesh group, because the
  // hover and selection outlines and the legend are siblings of the mesh
  // rather than descendants — scoping the vars any lower silently drops them
  // back to CSS initial values.
  const vars = useMemo(() => borderCssVars() as CSSProperties, []);

  return (
    <div className="app" style={vars}>
      <Map />
      <CornerBrackets />
      <TitlePlate />
      <Readout />
      <Legend />
      <Telemetry />
    </div>
  );
}
