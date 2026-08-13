/**
 * Readout.tsx — the right-hand rail.
 *
 * Shows the hovered country, or the selected one when nothing is hovered.
 * The panel is always present, even when empty, so that nothing on screen
 * reflows when you move the pointer — a panel that pops in and out during a
 * live talk reads as a bug and pulls the eye away from the map.
 *
 * It prints a name, a code, a capital and a region. It does not print a
 * status. See the policy in disputed.ts: no label in this application asserts
 * a sovereignty position. The one thing it does say is when a code is
 * user-assigned rather than ISO-allocated, because presenting XKX as though it
 * were an ISO code would be a factual error.
 */
import { COUNTRY_BY_ISO } from '../data/atlas';
import { CAPITAL_OF } from '../data/capitals';
import { isIsoAssigned, NUMERIC_TO_ALPHA3 } from '../data/iso';
import { useViewState } from '../state/viewState';

/** alpha-3 -> numeric, built once, for the readout's secondary code line. */
const NUMERIC_OF: Readonly<Record<string, string>> = Object.fromEntries(
  Object.entries(NUMERIC_TO_ALPHA3).map(([numeric, a3]) => [a3, numeric]),
);

export function Readout() {
  const hoveredIso = useViewState((s) => s.hoveredIso);
  const selectedIso = useViewState((s) => s.selectedIso);
  const iso = hoveredIso ?? selectedIso;

  const country = iso ? COUNTRY_BY_ISO[iso] : null;
  const capital = iso ? CAPITAL_OF[iso] : null;
  const pinned = Boolean(selectedIso) && hoveredIso === null;

  return (
    <aside className="readout" aria-live="polite">
      <div className="readout-rule" />
      <div className="readout-head">
        <span className="label">Readout</span>
        {pinned ? <span className="label readout-pin">Held</span> : null}
      </div>

      {country ? (
        <>
          <h2 className="readout-title">{country.name}</h2>
          <dl className="readout-fields">
            <Field label="ISO">
              {country.iso}
              {NUMERIC_OF[country.iso] ? (
                <span className="muted"> · {NUMERIC_OF[country.iso]}</span>
              ) : null}
              {!isIsoAssigned(country.iso) ? (
                <span className="muted"> · user-assigned</span>
              ) : null}
            </Field>
            <Field label="Capital">
              {capital ? capital.name : <span className="muted">—</span>}
            </Field>
            <Field label="Region">
              {country.subRegion ?? <span className="muted">Out of scope</span>}
            </Field>
            <Field label="Scope">{country.inScope ? 'EMEA' : 'Out of scope'}</Field>
          </dl>
        </>
      ) : (
        <p className="readout-empty">
          <span className="muted">Hover a country</span>
        </p>
      )}
    </aside>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="field">
      <dt className="label">{label}</dt>
      <dd className="value">{children}</dd>
    </div>
  );
}
