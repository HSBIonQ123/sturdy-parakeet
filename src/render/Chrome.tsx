/**
 * Chrome.tsx — everything framing the map that is not the map.
 *
 * The instrument metaphor lives here as much as in the borders: corner
 * brackets read as a vacuum-chamber viewport, the vignette pulls focus to
 * centre frame, and the title plate is stamped rather than typeset.
 *
 * All of it is static. The pulsing borders are the only ambient motion on this
 * map; if anything here starts moving, it is competing with the one thing that
 * is meant to carry the room.
 */
import { useViewState, currentScene } from '../state/viewState';
import { LAYER_BY_ID } from '../data/layers';

/** Corner brackets. Thin orange rules with a gap, like a chamber viewport. */
export function CornerBrackets() {
  return (
    <div className="brackets" aria-hidden>
      <span className="bracket bracket-tl" />
      <span className="bracket bracket-tr" />
      <span className="bracket bracket-bl" />
      <span className="bracket bracket-br" />
    </div>
  );
}

/**
 * The title plate.
 *
 * The brand line is fixed and the scene line changes beneath it. Keeping the
 * brand persistent matters: the scene title is the slide, but the plate is
 * whose slide it is, and a deck that drops its own name the moment it shows
 * content looks like a demo rather than a product.
 *
 * The scene line is keyed on scene id so it re-enters on change — a short
 * fade, so a state change registers in peripheral vision without anyone
 * watching an animation finish.
 */
export function TitlePlate() {
  const scene = useViewState(currentScene);

  return (
    <header className="plate">
      <h1 className="plate-title">IonQ · EMEA Atlas</h1>
      <div className="plate-rule" />
      <div className="plate-scene" key={scene.id}>
        <p className="plate-scene-title">{scene.title}</p>
        {scene.caption ? <p className="plate-sub label">{scene.caption}</p> : null}
      </div>
    </header>
  );
}

/**
 * The key. Terse and low-contrast: it answers "why is that line dashed" for
 * anyone who asks, without inviting the question.
 *
 * The membership row appears only while a layer is active, so the base map
 * carries no legend it does not need.
 */
export function Legend() {
  const activeLayers = useViewState((s) => s.activeLayers);
  const active = activeLayers.map((id) => LAYER_BY_ID[id]).filter(Boolean);

  return (
    <div className="legend" aria-label="Key">
      {active.map((layer) => (
        <span className="legend-item" key={layer.id}>
          <svg className="legend-swatch" viewBox="0 0 24 6" aria-hidden>
            <rect x="1" y="0" width="22" height="6" className="legend-fill legend-member" />
          </svg>
          <span className="label">
            {layer.label} · {layer.description}
          </span>
        </span>
      ))}
      <span className="legend-item">
        <svg className="legend-swatch" viewBox="0 0 24 6" aria-hidden>
          <line x1="1" y1="3" x2="23" y2="3" className="legend-line legend-network" />
        </svg>
        <span className="label">In scope</span>
      </span>
      <span className="legend-item">
        <svg className="legend-swatch" viewBox="0 0 24 6" aria-hidden>
          <line x1="1" y1="3" x2="23" y2="3" className="legend-line legend-defacto" />
        </svg>
        <span className="label">De facto line</span>
      </span>
      <span className="legend-item">
        <svg className="legend-swatch" viewBox="0 0 24 6" aria-hidden>
          <line x1="1" y1="3" x2="23" y2="3" className="legend-line legend-oos" />
        </svg>
        <span className="label">Out of scope</span>
      </span>
    </div>
  );
}

/** Keyboard hints. Fades out once the map has been touched. */
export function KeyHints({ visible }: { readonly visible: boolean }) {
  return (
    <div className={`hints label${visible ? '' : ' is-hidden'}`} aria-hidden={!visible}>
      <span>
        <kbd>Pg↓</kbd> next
      </span>
      <span>
        <kbd>M</kbd> scenes
      </span>
      <span>
        <kbd>R</kbd> reset
      </span>
      <span>
        <kbd>F</kbd> fullscreen
      </span>
    </div>
  );
}
