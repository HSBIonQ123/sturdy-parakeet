/**
 * CountryPath.tsx — one country polygon.
 *
 * This component decides NOTHING about appearance. It subscribes to the store,
 * hands the snapshot to `resolveCountryStyle`, and spreads the answer. If you
 * want to change how a country looks, that file is the only place to go.
 *
 * The path string is computed once by the parent and passed in, because
 * `geoPath` on a 1:50m MultiPolygon is not cheap and must never run on hover.
 * Panning and zooming move a parent <g> instead of re-projecting.
 *
 * NOTE ON STROKES: country polygons carry no stroke at all. Every boundary is
 * drawn exactly once by BorderMesh. Adding a stroke here would paint each
 * internal border twice — once from each side — and the two pulses would drift
 * visibly out of phase along every shared line.
 */
import { memo } from 'react';
import { useViewState } from '../state/viewState';
import { resolveCountryStyle } from './resolveCountryStyle';
import type { Alpha3 } from '../data/iso';

interface Props {
  readonly iso: Alpha3;
  readonly name: string;
  readonly inScope: boolean;
  readonly d: string;
}

function CountryPathImpl({ iso, name, inScope, d }: Props) {
  // `resolveCountryStyle` returns referentially stable objects, so this
  // subscription only fires a re-render when this country's style actually
  // changes — not on every pointer move across the map.
  const style = useViewState((s) => resolveCountryStyle(iso, inScope, s));

  const setHovered = useViewState((s) => s.setHovered);
  const select = useViewState((s) => s.select);

  return (
    <path
      d={d}
      fill={style.fill}
      fillOpacity={style.fillOpacity}
      stroke={style.stroke}
      opacity={style.opacity}
      className="country"
      data-iso={iso}
      tabIndex={inScope ? 0 : -1}
      role={inScope ? 'button' : undefined}
      aria-label={inScope ? name : undefined}
      onPointerEnter={() => setHovered(iso)}
      onPointerLeave={() => setHovered(null)}
      onFocus={() => setHovered(iso)}
      onBlur={() => setHovered(null)}
      onClick={(e) => {
        e.stopPropagation();
        select(iso);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          select(iso);
        }
      }}
    />
  );
}

export const CountryPath = memo(CountryPathImpl);
