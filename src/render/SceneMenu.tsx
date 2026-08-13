/**
 * SceneMenu.tsx — the deck, on demand.
 *
 * Closed by default and invisible when closed, because during the talk the map
 * is the only thing that should be on screen. Open it with the button in the
 * corner or with `M`, and it lists the deck so you can jump straight to a scene
 * — which is what a question needs, since a clicker can only say "next".
 *
 * The button is deliberately quiet: a small bracketed glyph that reads as part
 * of the instrument chrome rather than as an app control. It brightens on
 * hover and focus so it is findable when you go looking for it, and recedes
 * when you are not.
 *
 * Accessibility is not decoration here: you will sometimes drive this from a
 * lectern keyboard with no mouse. Arrow keys move through the list, Enter
 * jumps, Esc closes and returns focus to the button.
 */
import { useEffect, useRef } from 'react';
import { DECK } from '../scenes/deck';
import { LAYER_BY_ID } from '../data/layers';
import { useViewState } from '../state/viewState';

export function SceneMenu() {
  const open = useViewState((s) => s.menuOpen);
  const toggleMenu = useViewState((s) => s.toggleMenu);
  const closeMenu = useViewState((s) => s.closeMenu);
  const gotoScene = useViewState((s) => s.gotoScene);
  const sceneIndex = useViewState((s) => s.sceneIndex);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Move focus into the list when it opens, and back to the button when it
  // closes, so keyboard-only operation never strands focus on the page body.
  useEffect(() => {
    if (!open) return;
    const active = listRef.current?.querySelector<HTMLButtonElement>('[data-current="true"]');
    (active ?? listRef.current?.querySelector('button'))?.focus();
  }, [open]);

  const onListKeyDown = (e: React.KeyboardEvent) => {
    const items = [...(listRef.current?.querySelectorAll('button') ?? [])];
    const here = items.indexOf(document.activeElement as HTMLButtonElement);
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      // Stop these reaching the presenter shortcuts, or opening the menu would
      // also step the deck underneath it.
      e.preventDefault();
      e.stopPropagation();
      const step = e.key === 'ArrowDown' ? 1 : -1;
      items[(here + step + items.length) % items.length]?.focus();
    } else if (e.key === 'Escape') {
      e.stopPropagation();
      closeMenu();
      buttonRef.current?.focus();
    }
  };

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className={`menu-button${open ? ' is-open' : ''}`}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={open ? 'Close scene list' : 'Open scene list'}
        onClick={(e) => {
          e.stopPropagation();
          toggleMenu();
        }}
      >
        <span className="menu-button-glyph" aria-hidden>
          {open ? '×' : '≡'}
        </span>
        <span className="label">Scenes</span>
      </button>

      {open ? (
        <div
          className="scene-menu"
          role="menu"
          aria-label="Scenes"
          ref={listRef}
          onKeyDown={onListKeyDown}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="scene-menu-head">
            <span className="label">Deck</span>
            <span className="label muted">
              {DECK.length} scene{DECK.length === 1 ? '' : 's'}
            </span>
          </div>

          {DECK.map((scene, i) => {
            const current = i === sceneIndex;
            // The layer's DESCRIPTION, not its label: the scene title already
            // says "European Union", so a label here would just repeat it.
            // "27 member states" is the line that adds something.
            const layers = (scene.layers ?? [])
              .map((id) => LAYER_BY_ID[id]?.description ?? id)
              .join(' · ');
            return (
              <button
                key={scene.id}
                type="button"
                role="menuitem"
                data-current={current}
                data-scene={scene.id}
                className={`scene-item${current ? ' is-current' : ''}`}
                onClick={() => gotoScene(i)}
              >
                <span className="scene-index value">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="scene-text">
                  <span className="scene-title">{scene.title}</span>
                  <span className="label scene-meta">
                    {layers || 'Base map'}
                    {scene.camera ? ' · zoomed' : ''}
                  </span>
                </span>
              </button>
            );
          })}

          <p className="scene-menu-foot label muted">
            Page ↓ / → next · Page ↑ / ← back · M closes
          </p>
        </div>
      ) : null}
    </>
  );
}
