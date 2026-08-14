/**
 * presenter.ts — the three opening callout panels: family, career, why IonQ.
 *
 * ON THE FAMILY GLYPHS. These were imported silhouettes and are now line icons
 * drawn in `render/FigureIcon.tsx`. A solid filled bust had no relative
 * anywhere else on this map — the borders are hairlines, the markers are rings,
 * the chrome is a one-pixel rule — so it read as clip-art pasted onto an
 * instrument. Strokes on a shared grid belong to the same drawing.
 *
 * The consequence for this file is that a figure now names an ICON rather than
 * an asset, which is also what made per-person labels possible: three separate
 * glyphs can each carry a name, where one bitmap of a group could not without
 * hard-coding pixel offsets.
 *
 * ON PERSONAL CONTENT IN A REPOSITORY. These are real people, including a
 * child. Their names are here because the presenter asked for them and
 * confirmed they were happy for them to be committed. If this repository ever
 * changes hands or goes public, this file is the first thing to review — it is
 * deliberately the only place any of it appears, so removing it is one file plus
 * three scenes rather than a search across the project.
 *
 * ON THE CAREER LIST. Supplied by the presenter about himself, so it needs no
 * external provenance in the way `deployments.ts` does — but it goes stale the
 * same way a priority list does, and it is on screen in front of the people
 * best placed to notice. Read it before a talk.
 */
import type { Callout } from './callouts';

export const PRESENTER_CALLOUTS: readonly Callout[] = [
  {
    id: 'family',
    heading: 'Salisbury · home',
    anchor: 'salisbury',
    side: 'right',
    body: {
      kind: 'figures',
      figures: [
        { id: 'andrea', icon: 'adult', label: 'Andrea' },
        { id: 'evie', icon: 'child', label: 'Evie' },
        { id: 'ziggy', icon: 'dog', label: 'Ziggy' },
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
