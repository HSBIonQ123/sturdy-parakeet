/**
 * FigureIcon.tsx — the family glyphs on the opening callout.
 *
 * These replaced imported silhouette artwork, and the reason is the same one
 * that governs everything else on this map: a solid filled shape has no
 * relative in the rest of the instrument. The borders are hairlines, the
 * markers are rings, the chrome is a one-pixel rule — a black bust dropped into
 * that reads as clip-art pasted onto an oscilloscope. Drawn as strokes on a
 * common 24-unit grid, at one weight, they become part of the same drawing.
 *
 * They are AUTHORED HERE RATHER THAN IMPORTED, deliberately. Three glyphs of
 * about ten path commands each are cheaper as code than as files: they inherit
 * `currentColor` and the stroke weight from CSS, they cost no request and no
 * bundling step, and there is no asset to lose track of. Anything with real
 * detail — a logo, a photograph — still belongs in `src/assets` and vendored.
 *
 * The people are a portrait pair on purpose: head, then shoulders, at two
 * scales — the proportions alone say which is the adult, so neither glyph needs
 * a costume. If you add another person, match the head radius and the shoulder
 * arc rather than inventing a new construction.
 *
 * The dog is a paw rather than a fourth portrait, and the note beside it
 * explains why at length: it is a lesson about what survives at 60px, and worth
 * reading before anyone tries to "finish the set".
 */

export type FigureIconId = 'adult' | 'child' | 'dog';

interface Props {
  readonly icon: FigureIconId;
}

/** Shared frame: everything sits on a 24x24 grid with a 21-unit baseline. */
const VIEW_BOX = '0 0 24 24';

export function FigureIcon({ icon }: Props) {
  return (
    <svg className="figure-icon" viewBox={VIEW_BOX} aria-hidden focusable="false">
      {icon === 'adult' ? (
        <>
          <circle cx="12" cy="7.6" r="3.9" />
          <path d="M4.6 21v-1.4a7.4 7.4 0 0 1 14.8 0V21" />
        </>
      ) : null}

      {icon === 'child' ? (
        <>
          {/* Smaller head, narrower shoulders, and a shorter body that starts
              lower — the proportions do the work, so neither glyph needs a
              costume to say which is which. */}
          <circle cx="12" cy="10.4" r="3.1" />
          <path d="M6.8 21v-1a5.2 5.2 0 0 1 10.4 0v1" />
        </>
      ) : null}

      {icon === 'dog' ? (
        <>
          {/*
            A PAW, NOT A DOG.
            Three drawn heads were tried and all three failed at the size this
            actually renders — about 60px. Front-facing with curled ears, then
            with pointed ears, both read as a pig, because a snout drawn
            symmetrically in the middle of a face IS a pig. The profile head
            then read as a bird, and once the muzzle was softened enough to stop
            looking like a beak it read as a cloud.
            The lesson is about scale, not draughtsmanship: a dog's head is
            carried by details — the stop, the jaw, the set of the ears — and
            none of them survive at 60px in a 1.15 stroke. A paw has one silhouette
            nobody misreads, at any size, and the name underneath does the rest.
          */}
          {/* Toes splayed on an arc and rotated outward. Four ellipses in a
              level row read as a flower; the rotation is what makes it a paw. */}
          <ellipse cx="6.8" cy="11" rx="1.7" ry="2.3" transform="rotate(-24 6.8 11)" />
          <ellipse cx="10.8" cy="7.6" rx="1.8" ry="2.5" transform="rotate(-9 10.8 7.6)" />
          <ellipse cx="15.4" cy="7.9" rx="1.8" ry="2.5" transform="rotate(9 15.4 7.9)" />
          <ellipse cx="19.2" cy="11.4" rx="1.7" ry="2.3" transform="rotate(24 19.2 11.4)" />
          <path d="M12.6 12.4c2 0 3.9 1 5 2.6 1.2 1.7 1.1 3.7-.2 4.9-1.1 1-2.9 1.3-4.8 1.3s-3.7-.3-4.8-1.3c-1.3-1.2-1.4-3.2-.2-4.9 1.1-1.6 3-2.6 5-2.6Z" />
        </>
      ) : null}
    </svg>
  );
}
