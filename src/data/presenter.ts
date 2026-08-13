/**
 * presenter.ts — the three opening callout panels: family, career, why IonQ.
 *
 * ============================================================================
 * THE SILHOUETTES IN src/assets/silhouettes ARE PLACEHOLDERS.
 *
 * Supplied artwork exists for both and should replace them. To swap: drop the
 * files into `src/assets/silhouettes/` and change the two import lines below.
 * Nothing else in the project refers to them — not the component, not the
 * styles, not the deck — so a replacement is a two-line edit and a rebuild.
 *
 * Vendored rather than fetched, exactly like `assets/ionq-logo.webp`. The whole
 * application is guaranteed to work with the wifi off and an <img> pointing at
 * a URL would break that promise for the sake of two small files.
 * ============================================================================
 *
 * ON PERSONAL CONTENT IN A REPOSITORY. These are real people, including a
 * child. Their names are here because the presenter asked for them and
 * confirmed they were happy for them to be committed. If this repository ever
 * changes hands or goes public, this file and the two assets beside it are the
 * things to review first — they are deliberately kept in one place so that
 * removing them is one file plus three scenes, not a search across the project.
 *
 * ON THE CAREER LIST. Supplied by the presenter about himself, so it needs no
 * external provenance in the way `deployments.ts` does — but it goes stale the
 * same way a priority list does, and it is on screen in front of the people
 * best placed to notice. Read it before a talk.
 */
import familySilhouette from '../assets/silhouettes/family.svg';
import ziggySilhouette from '../assets/silhouettes/ziggy.svg';

/** A figure in the family panel: one image, one name under it. */
export interface Figure {
  readonly id: string;
  /** Imported asset URL. */
  readonly src: string;
  /** Name printed under the silhouette. */
  readonly label: string;
  /** Relative width within the panel row, so the dog is not adult-sized. */
  readonly weight: number;
}

/**
 * What a callout panel contains. A discriminated union rather than one shape
 * with optional fields on it: a figure row, a numbered list and a paragraph
 * lay out nothing like each other, and a union means `Callouts.tsx` cannot
 * render a panel whose data does not fit the layout it chose.
 */
export type CalloutBody =
  | { readonly kind: 'figures'; readonly figures: readonly Figure[] }
  | { readonly kind: 'list'; readonly items: readonly string[] }
  | { readonly kind: 'prose'; readonly heading: string; readonly text: string };

export interface Callout {
  readonly id: string;
  /** Small key-register heading, in the same idiom as READOUT on the panel. */
  readonly heading: string;
  /**
   * The marker id this panel's leader line is drawn from. A marker rather than
   * a coordinate, so the dot and the line can never drift apart — move the
   * marker in places.ts and the line follows.
   */
  readonly anchor: string;
  /** Which side of the frame the panel sits on. */
  readonly side: 'left' | 'right';
  readonly body: CalloutBody;
}

export const CALLOUTS: readonly Callout[] = [
  {
    id: 'family',
    heading: 'Salisbury · home',
    anchor: 'salisbury',
    side: 'right',
    body: {
      kind: 'figures',
      figures: [
        // One image carries the whole family group, so the names sit under the
        // row rather than under individual figures — labelling one figure
        // inside a bitmap would mean hard-coding pixel offsets that break the
        // moment the artwork is replaced.
        { id: 'family', src: familySilhouette, label: 'Andrea · Evie', weight: 1.35 },
        { id: 'ziggy', src: ziggySilhouette, label: 'Ziggy', weight: 1 },
      ],
    },
  },
  {
    id: 'career',
    heading: 'Career',
    anchor: 'salisbury',
    side: 'right',
    body: {
      kind: 'list',
      items: [
        'Adviser to the Deputy Speaker, UK House of Commons',
        'Political consultant to the governments of the Bahamas, Saudi Arabia, Qatar, Ukraine and Ras Al Khaimah',
        'Won elections in the UK, Germany, Georgia and the Bahamas',
        'Consulted for Google, OpenAI, Meta, TikTok and Microsoft',
        'Joined IonQ as Head of Government Affairs for Europe; now Head of International Government Affairs and Public Policy',
      ],
    },
  },
  {
    id: 'why-ionq',
    heading: 'IonQ',
    anchor: 'salisbury',
    side: 'right',
    body: {
      kind: 'prose',
      heading: 'Why I joined IonQ',
      text:
        'The opportunity to shape a frontier industry. IonQ gives me the scale ' +
        'across the stack to do everything from semiconductor policy to cloud policy.',
    },
  },
];

export const CALLOUT_BY_ID: Readonly<Record<string, Callout>> = Object.fromEntries(
  CALLOUTS.map((c) => [c.id, c]),
);

/**
 * Resolve a scene's callout ids. Throws on an unknown id for the same reason
 * `resolveMarkers` does: a panel that silently fails to appear is a blank half
 * of a slide, and rehearsal is too late to find out.
 */
export function resolveCallouts(ids: readonly string[]): readonly Callout[] {
  const unknown = ids.filter((id) => !CALLOUT_BY_ID[id]);
  if (unknown.length > 0) {
    throw new Error(`Unknown callout id(s): ${unknown.join(', ')}`);
  }
  return CALLOUTS.filter((c) => ids.includes(c.id));
}
