/**
 * deck.ts — the ordered deck. This IS the talk.
 *
 * One array, in running order. Reordering the talk means moving a block in
 * this file; that is deliberately the easiest edit in the project, because
 * reordering is what you actually do while rehearsing.
 *
 * The clicker steps forward and back through this array. The scene menu (M)
 * lists it and jumps directly, for questions.
 *
 * Scenes are kept in one file rather than one file each. A scene is about ten
 * lines, and a talk is a sequence you read top to bottom — splitting it across
 * a dozen files would make the running order the one thing you cannot see.
 */
import type { Scene } from './types';

export const DECK: readonly Scene[] = [
  {
    id: 'emea',
    title: 'Base region',
    caption: 'Equal-area · λ₀ 20°E · 1:50m',
    // No layers, no camera: the base region map, fitted to the frame.
  },
  {
    id: 'eu',
    title: 'European Union',
    caption: '27 member states',
    layers: ['eu'],
    // No camera. The EU is a statement about the whole region's composition,
    // so it reads at the full frame; zooming to Europe here would lose the
    // contrast against the rest of EMEA, which is the point of the slide.
  },
  {
    id: 'eea-efta-uk',
    title: 'EEA, EFTA and the UK',
    caption: 'Five states beyond the 27',
    // A build, not a replacement: the 27 stay exactly as they were on the
    // previous scene and five more arrive in the second accent. Keeping `eu`
    // first also keeps it first in precedence, so nothing about the EU's
    // appearance shifts between the two scenes — the eye only has to track
    // what was added.
    layers: ['eu', 'eea-efta-uk'],
  },
  {
    id: 'horizon-europe',
    title: 'Horizon Europe',
    caption: '27 members · 22 associated states',
    // The same solid/hatched grammar as the previous scene, so no explaining
    // is needed — but a visibly different set. Watch Liechtenstein go dark
    // (it declined to associate) and the Faroes light up (associated despite
    // being outside both the EU and the EEA). Those two are the argument that
    // the research area is not simply the single market.
    layers: ['eu', 'horizon-associated'],
  },
  {
    id: 'euroqci',
    title: 'EuroQCI',
    caption: '27 signatories · 3 eligible · IonQ deployments marked',
    // This scene uses the `euroqci` layer rather than `eu`, even though the
    // membership is identical — the legend should say "signatories", not
    // "member states". The list is not duplicated; euroQci.ts takes it from
    // the EU layer.
    //
    // Four of the six markers land INSIDE the highlighted area — Poland,
    // Slovakia, Romania and Greece run IonQ QKD networks through ID Quantique
    // as their national EuroQCI contributions. The other two, Switzerland and
    // the UK, fall outside a perimeter drawn by EEA membership. See the note
    // at the foot of data/deployments.ts.
    layers: ['euroqci', 'euroqci-eligible'],
    deployments: true,
  },
  {
    id: 'political-engagement',
    title: 'Priority European Political Engagement',
    caption: 'Six states · a selection, not a bloc',
    // The first scene in the deck that shows a set nobody published. Every
    // preceding one draws a perimeter you could look up — the 27, the EEA,
    // Horizon association, the EuroQCI Declaration — and this one draws a
    // choice. The caption says so on screen, and the layer file says why at
    // length; see data/layers/politicalEngagement.ts.
    //
    // It ends the deck deliberately. The four programme scenes establish that
    // every instrument draws a different map of Europe, which is exactly the
    // ground needed to say where the effort goes — and it is the point at
    // which the UK lights up for the first time, having been outside all four
    // perimeters, with the Oxford engineering base sitting on it.
    //
    // Only this layer is active. That is what makes the five EU members and
    // the UK read on the same footing: with `eu` also on, the EU precedence
    // rule would tint five of the six as member states and the set would come
    // apart on screen into the very distinction the scene is not making.
    layers: ['political-engagement'],
    // No camera, like every scene before it. The set spans the UK to Lithuania
    // and Italy, so it composes at the fitted frame — and holding the frame is
    // what keeps the eye on which countries changed rather than on the map
    // moving. Markers stay off: the deployment story belongs to EuroQCI, and
    // `deployments: true` is a one-word change if a rehearsal disagrees.
  },
];

/** Index bounds helper, so nothing off-by-ones its way past the end mid-talk. */
export function clampSceneIndex(index: number): number {
  if (DECK.length === 0) return 0;
  return Math.max(0, Math.min(DECK.length - 1, index));
}
