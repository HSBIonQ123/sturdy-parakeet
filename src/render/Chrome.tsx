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
import { CENTRAL_MERIDIAN } from './projection';

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

export function TitlePlate() {
  return (
    <header className="plate">
      <h1 className="plate-title">IonQ · EMEA Atlas</h1>
      <div className="plate-rule" />
      <p className="plate-sub label">
        Equal-area · λ₀ {CENTRAL_MERIDIAN}°E · 1:50m
      </p>
    </header>
  );
}

/**
 * The key legend. Deliberately terse and low-contrast: it answers "why is that
 * line dashed" for anyone who asks, without inviting the question.
 */
export function Legend() {
  return (
    <div className="legend" aria-label="Key">
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
        <kbd>R</kbd> reset
      </span>
      <span>
        <kbd>F</kbd> fullscreen
      </span>
      <span>
        <kbd>Esc</kbd> deselect
      </span>
    </div>
  );
}
