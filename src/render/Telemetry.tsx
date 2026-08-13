/**
 * Telemetry.tsx — the bottom strip.
 *
 * Real values, not decoration. Every field here is read from live state, and
 * if a number looks wrong on screen it IS wrong. That is the point of putting
 * an instrument readout on an instrument: it has to be load-bearing, or it is
 * just a sci-fi texture and the audience can tell.
 *
 * The integrity field is the one that earns its place — it reports the border
 * partition check from atlas.ts, so a data regression is visible on the screen
 * you are already looking at rather than buried in a console.
 */
import { EMEA_COUNT } from '../data/regions';
import { INTEGRITY } from '../data/atlas';
import { PROJECTION_NAME, CENTRAL_MERIDIAN } from './projection';
import { useViewState } from '../state/viewState';
import { DECK } from '../scenes/deck';

export function Telemetry() {
  const scale = useViewState((s) => s.camera.k);
  const sceneIndex = useViewState((s) => s.sceneIndex);
  const selectedIso = useViewState((s) => s.selectedIso);
  const activeLayers = useViewState((s) => s.activeLayers.length);
  const reducedMotion = useViewState((s) => s.reducedMotion);

  const healthy = INTEGRITY.problems.length === 0;

  return (
    <footer className="telemetry" aria-label="Map telemetry">
      <Item
        label="Scene"
        value={`${String(sceneIndex + 1).padStart(2, '0')}/${String(DECK.length).padStart(2, '0')}`}
      />
      <Item label="In scope" value={String(EMEA_COUNT)} />
      <Item label="Proj" value={`${PROJECTION_NAME} λ₀ ${CENTRAL_MERIDIAN}°E`} />
      <Item label="Scale" value={`${scale.toFixed(2)}×`} />
      <Item label="Layers" value={String(activeLayers)} />
      <Item label="Sel" value={selectedIso ?? '——'} />
      <Item
        label="Mesh"
        value={`${INTEGRITY.counts.network} net · ${INTEGRITY.counts.deFacto} de facto`}
      />
      <Item
        label="Integrity"
        value={healthy ? 'OK' : `${INTEGRITY.problems.length} FAULT`}
        fault={!healthy}
      />
      {reducedMotion ? <Item label="Motion" value="REDUCED" /> : null}
    </footer>
  );
}

function Item({
  label,
  value,
  fault,
}: {
  label: string;
  value: string;
  fault?: boolean;
}) {
  return (
    <span className={`telemetry-item${fault ? ' is-fault' : ''}`}>
      <span className="label">{label}</span>
      <span className="value">{value}</span>
    </span>
  );
}
