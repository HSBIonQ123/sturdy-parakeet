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
import { NETWORK_DEPLOYMENT_IDS } from '../data/deployments';
import { capital } from '../data/capitalMarkers';
import { RISK_EXPOSURE_COUNT } from '../data/ninetyDays';

/**
 * THE HUB, AND WHY IT REPEATS.
 *
 * The second half of the deck is hub and spoke: the six priority states at
 * region scale, then one of them close up, then back out to the six, then the
 * next. The presenter walks the set without ever losing the picture that says
 * what the set IS — every country is introduced against the whole selection
 * rather than in isolation, and stepping out is what makes the next zoom mean
 * something.
 *
 * It costs nothing architecturally, and that is the point: because scenes are
 * absolute (§3a) and an omitted `camera` actively RESETS rather than meaning
 * "leave it where it is", a hub scene is simply the engagement scene with no
 * camera. Returning to the region is not a special "zoom out" action, it is
 * the ordinary act of stepping into a scene that has no camera. The pattern
 * needed no new field, no new state and no new code.
 *
 * Each occurrence needs its OWN id even though the picture is identical:
 * SceneMenu keys on `scene.id` and targets `data-scene`, so duplicates would
 * collide in React's reconciliation and make a menu entry ambiguous. The
 * content is written once here so six hubs cannot drift apart — change the
 * caption and every hub changes with it.
 */
const hub = (id: string): Scene => ({
  id,
  title: 'Priority European Political Engagement',
  caption: 'Six states · a selection, not a bloc',
  layers: ['political-engagement'],
  // No camera: this is what returns the talk to the region. See above.
});

export const DECK: readonly Scene[] = [
  {
    id: 'salisbury',
    title: 'Salisbury',
    // THE OPENING SCREEN. The talk starts on home ground and pulls out to the
    // region on the next click, which is the reverse of the walk the rest of
    // the deck does and is why it reads as an opening rather than as scene one
    // of a sequence.
    //
    // No layers. Nothing is being argued yet — one country, one dot, and the
    // border network already alive behind them.
    camera: { lon: -2.8, lat: 54.3, k: 7 },
    // The same frame as the UK scene later in the deck, deliberately: the two
    // rhyme, and coming back to it at scene 9 lands somewhere already seen.
    selectedIso: 'GBR',
    markers: ['salisbury'],
    // ON THE MARKER. Salisbury is drawn WITHOUT the bright core, because this
    // deck reserves that for places IonQ actually is, and nothing in the repo
    // establishes a presence there. If the dot is meant to assert something,
    // see the source line in data/places.ts — it says what to do about it.
  },
  /*
   * The three opening callouts, all on the same deep-focus camera.
   *
   * ONE PICTURE, THREE PANELS. The camera does not move between them: the
   * frame arrived on the previous scene and is held while the content changes,
   * so each click adds a panel rather than moving the map. That is the same
   * discipline the layer scenes use — change one thing at a time and let the
   * eye track it — applied to content instead of tint.
   *
   * Three scenes rather than one crowded one. The career list runs to five
   * items and the panel has to be legible from the back of a room, which is a
   * constraint that beats economy of clicks every time.
   */
  {
    id: 'family',
    title: 'Salisbury',
    // k=20, not the 24 ceiling: at 24 the frame is almost entirely England and
    // the panel has nothing to sit against. At 20 the south coast, the Isle of
    // Wight and the Channel give the right-hand third somewhere to be.
    camera: { lon: -1.7945, lat: 51.0688, k: 20 },
    selectedIso: 'GBR',
    markers: ['salisbury'],
    callouts: ['family'],
  },
  {
    id: 'career',
    title: 'Salisbury',
    camera: { lon: -1.7945, lat: 51.0688, k: 20 },
    selectedIso: 'GBR',
    markers: ['salisbury'],
    callouts: ['career'],
  },
  {
    id: 'why-ionq',
    title: 'Salisbury',
    camera: { lon: -1.7945, lat: 51.0688, k: 20 },
    selectedIso: 'GBR',
    markers: ['salisbury'],
    callouts: ['why-ionq'],
  },
  {
    id: 'emea',
    title: 'Base region',
    caption: 'Equal-area · λ₀ 20°E · 1:50m',
    // No layers, no camera: the base region map, fitted to the frame.
  },
  /*
   * WHAT THE FUNCTION IS, BEFORE WHAT THE MAP SHOWS.
   *
   * These two sit between the base region map and the first layer scene, and
   * the placement is the argument — the same one §7h makes for the EU files.
   * The layer scenes that follow are the substance of the brief; these say who
   * is doing it and what has already moved. Put them after the layers and they
   * are a postscript; put them here and every perimeter that follows is being
   * read by someone the room has already been introduced to.
   *
   * No camera and no layers on either: the region arrived on the previous scene
   * and is held while the content changes, which is the discipline the three
   * Salisbury panels use. Both panels are full-width and start high, because
   * they are TABLES rather than the timeline's band — see `top` in callouts.ts.
   */
  {
    id: 'state-changes',
    title: 'Government Affairs',
    caption: 'The state-change agent · first ninety days',
    callouts: ['state-changes'],
  },
  {
    id: 'risk-register',
    title: 'Portfolio risk register',
    // COUNTED, NOT TYPED. The source deck's summary and its register disagreed
    // on how many exposures there were, and the fix was to make the register the
    // only place that number lives — so the caption reads it too rather than
    // becoming a third copy to fall out of step. See data/ninetyDays.ts.
    caption: `90-day review · ${RISK_EXPOSURE_COUNT} exposures and where they stand`,
    callouts: ['risk-register'],
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
    caption: '27 signatories · 3 eligible · IonQ QKD networks marked',
    // This scene uses the `euroqci` layer rather than `eu`, even though the
    // membership is identical — the legend should say "signatories", not
    // "member states". The list is not duplicated; euroQci.ts takes it from
    // the EU layer.
    //
    // All four markers land INSIDE the highlighted area — Poland, Slovakia,
    // Romania and Greece run IonQ QKD networks through ID Quantique as their
    // national EuroQCI contributions. That is the whole argument of the slide,
    // and it is why the set is the NETWORKS rather than every IonQ site:
    // QuantumBasel and Oxford Ionics are both outside the perimeter (Switzerland
    // is EFTA but not EEA, the UK a third country since 2020), so on this slide
    // they would be two dots arguing the opposite of the other four. Neither
    // loses its place in the talk — Oxford is half the UK spoke. See the note
    // at the foot of data/deployments.ts.
    layers: ['euroqci', 'euroqci-eligible'],
    // Derived on `kind`, not spelled out, so a fifth national network reaches
    // this scene without touching the deck and a second system does not.
    markers: NETWORK_DEPLOYMENT_IDS,
  },
  // ---- The six, then each of them in turn. -------------------------
  //
  // The hub is defined by `hub()` above; the spokes each carry a camera and
  // nothing else new. Reordering the walk means moving a spoke, which is one
  // block — the property §3a exists to protect.
  hub('political-engagement'),
  {
    id: 'uk',
    title: 'United Kingdom',
    caption: 'Westminster and Oxford · DBIST, HMT, Number 10',
    // The first scene in the deck to move the camera, and it needed no new
    // code to do it: `camera` has been on the Scene type since State 1 and
    // cameraControl.ts has been wired to it since the sequencer was built.
    // This is that seam being used for the first time, exactly as intended —
    // the reason scenes were never bare layer toggles.
    //
    // The layer stays as it was on the previous scene, so this reads as a
    // move rather than a change of subject: the six are established at region
    // scale, then the camera flies into one of them. Swapping the layer at the
    // same time as the camera would give the eye two things to track at once.
    layers: ['political-engagement'],
    // Centred on the UK land mass rather than on London — the subject is the
    // country, and a capital-centred frame would push Scotland off the top.
    // k=7 of a possible 8: the UK is unmistakably the subject while Belgium
    // and Germany stay in frame at the right edge, so the previous scene is
    // still legible as context rather than replaced outright. Checked on the
    // real build at 2560x1440, not estimated.
    camera: { lon: -2.8, lat: 54.3, k: 7 },
    // TWO MARKERS, NAMED. This is the slide's whole content: where the
    // decision is taken and where the engineering is done.
    // Listing ids rather than showing the deployment set keeps QuantumBasel
    // and Slovakia — true, but neither British nor the subject — off a slide
    // titled United Kingdom.
    //
    // They are drawn differently on purpose. Oxford gets the bright core of an
    // IonQ site; Westminster does not, because it is a place the talk points
    // at rather than a place IonQ occupies. See data/institutions.ts.
    // NO SEPARATE CAPITAL MARKER HERE, and this is not an omission. London is
    // 1.2km from the Palace of Westminster, which is roughly one pixel at this
    // camera and sub-pixel at any zoom this map supports — two dots would
    // overlap into a smudge. Westminster IS the capital marker on this scene,
    // and its own second line already reads "LONDON · PARLIAMENT AND
    // WHITEHALL". Swap it for `capital('GBR')` if a plain London dot is ever
    // wanted; do not show both.
    markers: ['westminster', 'oxford'],
    // The three routes into the British government, tethered to Westminster.
    // NOT a separate London dot: Westminster IS the capital marker here, for
    // the sub-pixel reason above.
    callouts: ['uk-westminster'],
    /*
     * THE SUBJECT, HELD SELECTED — and this is why `selectedIso` was on the
     * Scene type from State 1 without a user.
     *
     * Every spoke zooms into a country that is one of six lit in the same
     * orange, and several of them are neighbours: at Lithuania's camera, Poland
     * fills a third of the frame in exactly the same tint. Without this the
     * title plate is the only thing on screen saying which country the slide is
     * about, which is not good enough at the back of a room.
     *
     * Selecting it costs no new code and does two things at once. The outline
     * is drawn on top with the dark under-stroke that occludes the travelling
     * pulse (§6), so the subject is the brightest and the only MOTIONLESS
     * boundary in frame. And the readout fills with its name, ISO code, capital
     * and region — a data panel on the spoke, which is State 3 arriving early
     * through a field that was already there.
     *
     * Scenes are absolute, so the hubs clear it without saying anything:
     * `gotoScene` writes `selectedIso` every time and a hub omits it.
     */
    selectedIso: 'GBR',
  },
  /*
   * TWO MORE UK SCENES, INSIDE THE UK SPOKE.
   *
   * Same placement argument as the EU files in Belgium (§7h) and the circuit in
   * Italy (§7i): the talk is already standing in the UK, so the other two
   * relationships belong here rather than as a separate British section later.
   *
   * Each one MOVES THE CAMERA to the place its sentence is about, and that is
   * what earns it a scene of its own. A slide whose whole content is one line is
   * not thin when the map beneath it has flown to the site being discussed —
   * Oxford stays on screen in both, because in both it is the other end of the
   * relationship: the engineering that makes the ask credible.
   *
   * Both cameras are centred EAST of the pair they frame, the §7h correction:
   * the panel takes the right of the frame, so a camera centred on the dots puts
   * their labels under the box. Framed on the real build at 2560x1440.
   */
  {
    id: 'uk-gchq',
    title: 'United Kingdom',
    caption: 'Cheltenham and Oxford · cryptanalysis',
    layers: ['political-engagement'],
    camera: { lon: 0.6, lat: 52.0, k: 13 },
    selectedIso: 'GBR',
    markers: ['gchq', 'oxford'],
    callouts: ['uk-gchq'],
  },
  {
    id: 'uk-daresbury',
    title: 'United Kingdom',
    caption: 'Daresbury and Oxford · a system proposed',
    layers: ['political-engagement'],
    camera: { lon: 0.2, lat: 53.0, k: 9 },
    selectedIso: 'GBR',
    markers: ['daresbury', 'oxford'],
    callouts: ['uk-daresbury'],
  },
  hub('engagement-after-uk'),
  {
    id: 'belgium',
    title: 'Belgium',
    // No caption. types.ts says omit rather than pad, and there is nothing on
    // this slide to name — the UK scene's caption earns its place by naming
    // the two markers on screen. A caption here would be decoration, and the
    // presenter is the one with the Brussels content.
    layers: ['political-engagement'],
    // k=22. Belgium is about 280km across, so matching the apparent size the
    // UK gets at k=7 needs roughly three times the scale — which is why the
    // camera ceiling moved; see projection.ts. Framed on the real build.
    camera: { lon: 4.6, lat: 50.6, k: 22 },
    // The subject, held selected — see the note on the UK scene.
    selectedIso: 'BEL',
    markers: [capital('BEL')],
  },
  /*
   * THE LIVE EU FILES — five scenes, inside the Belgium spoke.
   *
   * They sit here rather than beside the EU layer scene because this is where
   * the talk is already standing in Brussels: the previous scene closes on
   * Belgium, these push in on the city itself, and the hub that follows returns
   * to the six. The legislation is not an aside about the Union in general — it
   * is what is happening in the building the camera is now pointed at.
   *
   * The camera moves in rather than holding Belgium's frame, so stepping into
   * the block reads as going somewhere. `selectedIso` stays on Belgium through
   * all five, which keeps the place continuous while the layer changes to the
   * EU 27 — the subject of these scenes is Union law, and that is the honest
   * tint for it.
   *
   * Each document is split at its natural seam — Situation and Risk, then
   * Timeline and next steps — rather than condensed. The text is an assessment
   * with named advisers behind it and is reproduced verbatim; the panels are
   * `wide` so that the words fit rather than the words being cut to fit.
   *
   * Every one of them is INTERNAL and stamped as such on screen. See the header
   * of data/policy.ts.
   */
  {
    id: 'ppa-situation',
    title: 'EU procurement',
    caption: 'Public Procurement Regulation · situation and risk',
    layers: ['eu'],
    // Centred EAST of Brussels, not on it. The panel occupies the right 42% of
    // the frame, so a camera centred on the dot leaves its label nowhere to go
    // and the label runs under the box — Markers.tsx flips at the FRAME edge and
    // knows nothing about panels. Shifting the centre 1.65° east puts Brussels
    // at about a third of the width, with the whole left of the frame clear.
    camera: { lon: 6.0, lat: 50.85, k: 24 },
    selectedIso: 'BEL',
    markers: [capital('BEL')],
    callouts: ['ppa-situation'],
  },
  {
    id: 'ppa-action',
    title: 'EU procurement',
    caption: 'Public Procurement Regulation · timeline and next steps',
    layers: ['eu'],
    // Centred EAST of Brussels, not on it. The panel occupies the right 42% of
    // the frame, so a camera centred on the dot leaves its label nowhere to go
    // and the label runs under the box — Markers.tsx flips at the FRAME edge and
    // knows nothing about panels. Shifting the centre 1.65° east puts Brussels
    // at about a third of the width, with the whole left of the frame clear.
    camera: { lon: 6.0, lat: 50.85, k: 24 },
    selectedIso: 'BEL',
    markers: [capital('BEL')],
    callouts: ['ppa-action'],
  },
  {
    id: 'quantum-act-situation',
    title: 'EU Quantum Act',
    caption: 'Situation and risk',
    layers: ['eu'],
    // Centred EAST of Brussels, not on it. The panel occupies the right 42% of
    // the frame, so a camera centred on the dot leaves its label nowhere to go
    // and the label runs under the box — Markers.tsx flips at the FRAME edge and
    // knows nothing about panels. Shifting the centre 1.65° east puts Brussels
    // at about a third of the width, with the whole left of the frame clear.
    camera: { lon: 6.0, lat: 50.85, k: 24 },
    selectedIso: 'BEL',
    markers: [capital('BEL')],
    callouts: ['quantum-act-situation'],
  },
  {
    id: 'quantum-act-action',
    title: 'EU Quantum Act',
    caption: 'Timeline and next steps',
    layers: ['eu'],
    // Centred EAST of Brussels, not on it. The panel occupies the right 42% of
    // the frame, so a camera centred on the dot leaves its label nowhere to go
    // and the label runs under the box — Markers.tsx flips at the FRAME edge and
    // knows nothing about panels. Shifting the centre 1.65° east puts Brussels
    // at about a third of the width, with the whole left of the frame clear.
    camera: { lon: 6.0, lat: 50.85, k: 24 },
    selectedIso: 'BEL',
    markers: [capital('BEL')],
    callouts: ['quantum-act-action'],
  },
  {
    id: 'quantum-act-timeline',
    title: 'EU Quantum Act',
    caption: 'Ordinary legislative procedure · seven stages',
    layers: ['eu'],
    // Same longitude as the briefings so the block holds together, but shifted
    // SOUTH: this panel spans the frame from a third of the way down, so a
    // camera centred on Belgium would park it behind the box. Centring below it
    // rides Belgium up into the band that is still visible.
    camera: { lon: 6.0, lat: 49.2, k: 24 },
    selectedIso: 'BEL',
    // No marker and no anchor: the timeline is about the calendar, so nothing
    // on the map is being pointed at. The panel spans the frame instead.
    callouts: ['quantum-act-timeline'],
  },
  {
    id: 'euqa-asks',
    title: 'EU Quantum Act',
    caption: 'Core asks · pre-bill text',
    layers: ['eu'],
    // Same camera as the timeline it follows, so the block reads as one move
    // into Brussels rather than four. The panel is full-width and covers most
    // of the frame; what the camera is doing here is holding the PLACE, which
    // is why the block keeps Belgium selected throughout.
    camera: { lon: 6.0, lat: 49.2, k: 24 },
    selectedIso: 'BEL',
    callouts: ['euqa-asks'],
  },
  hub('engagement-after-belgium'),
  {
    id: 'italy',
    title: 'Italy',
    layers: ['political-engagement'],
    // Italy is height-limited rather than width-limited — about 1150km from
    // the Alps to Sicily against a frame that is 16:9 — so it takes the
    // SMALLEST k of the five spokes despite not being the largest country.
    camera: { lon: 12.6, lat: 42.6, k: 7 },
    // The subject, held selected — see the note on the UK scene.
    selectedIso: 'ITA',
    markers: [capital('ITA')],
  },
  /*
   * THE ITALY CIRCUIT — inside the Italy spoke, exactly as the EU files sit
   * inside Belgium's, and for the same reason: the talk is already standing in
   * Italy, so the argument about what Italy is FOR belongs here rather than
   * beside a layer scene where it would be an aside about the Union.
   *
   * It is the one scene in the deck whose camera holds TWO capitals. Every
   * other spoke frames a country; this one frames a relationship, and the
   * diagram beside it has Rome and Brussels as its two nodes — so a camera
   * showing only Rome would leave half the picture asserted by the panel and
   * unsupported by the map. Both dots are lit members of the same layer, which
   * is what lets the pair read as one circuit rather than as subject and
   * neighbour.
   *
   * Italy stays selected throughout, so the subject of the spoke does not
   * change underneath the argument — Brussels is the other END of the circuit,
   * not the new subject. The hub that follows returns to the six.
   */
  {
    id: 'italy-circuit',
    title: 'Italy and Brussels',
    caption: 'Top-down and bottom-up · one circuit',
    layers: ['political-engagement'],
    // Centred between Rome and Brussels and shifted EAST, the same correction
    // the Belgium briefings make: the panel takes the right 42% of the frame,
    // so a camera centred on the pair would put Brussels under the box. Framed
    // on the real build at 2560x1440, not estimated — §3b.
    camera: { lon: 20.0, lat: 46.4, k: 6.5 },
    selectedIso: 'ITA',
    // Both ends of the circuit. Rome carries the leader line; Brussels is on
    // the map because the diagram names it.
    markers: [capital('ITA'), capital('BEL')],
    callouts: ['italy-circuit'],
  },
  hub('engagement-after-italy'),
  {
    id: 'germany',
    title: 'Germany',
    layers: ['political-engagement'],
    camera: { lon: 10.3, lat: 51.2, k: 9 },
    // The subject, held selected — see the note on the UK scene.
    selectedIso: 'DEU',
    markers: [capital('DEU')],
  },
  /*
   * THE FRANCO-GERMAN BLOCK — two scenes inside the Germany spoke.
   *
   * Same placement argument as the EU files in Belgium (§7h) and the circuit in
   * Italy (§7i): the talk is already standing in Germany, so a paper Germany has
   * just signed belongs here rather than beside a layer scene. The first panel
   * is what the paper says and what we make of it; the second is what has to
   * move, and it uses the same state-change register as the ninety-day slides
   * because that is exactly what those clauses are.
   *
   * Germany stays selected throughout. France is the other signatory and is NOT
   * selected — this is the German spoke, and the assessment is that Germany is
   * the one that moves.
   */
  {
    id: 'germany-franco',
    title: 'Franco-German position paper',
    caption: 'EU Quantum Act · signed 17 July 2026',
    layers: ['political-engagement'],
    // Centred EAST of Berlin for the §7h reason: the panel takes the right 42%
    // of the frame, so a camera centred on the dot leaves Berlin's label nowhere
    // to go. Framed on the real build.
    camera: { lon: 15.6, lat: 51.4, k: 9 },
    selectedIso: 'DEU',
    markers: [capital('DEU')],
    callouts: ['germany-franco'],
  },
  {
    id: 'germany-state-changes',
    title: 'Germany',
    caption: 'State changes to drive',
    layers: ['political-engagement'],
    camera: { lon: 10.3, lat: 51.2, k: 9 },
    selectedIso: 'DEU',
    callouts: ['germany-state-changes'],
  },
  hub('engagement-after-germany'),
  {
    id: 'poland',
    title: 'Poland',
    caption: 'National QKD network · ID Quantique',
    layers: ['political-engagement'],
    camera: { lon: 19.2, lat: 52.1, k: 11 },
    /*
     * WARSAW, ONCE. The IonQ QKD marker for Poland sits at 52.23, 21.01 —
     * character for character the coordinate capitals.ts gives for Warsaw,
     * because a national network has no single point and `precision: 'country'`
     * parks it on the capital. Showing both would put two dots on exactly the
     * same pixel, so the scene has to choose which claim that pixel makes.
     *
     * It shows the capital, and the QKD network moves to the caption above,
     * where it was already stated. Nothing is lost and the map stops arguing
     * with itself. To reverse it, swap this for ['poland'] — but never list
     * both.
     */
    markers: [capital('POL')],
    // The subject, held selected — see the note on the UK scene.
    selectedIso: 'POL',
  },
  {
    id: 'poland-strategy',
    title: 'Poland',
    caption: 'Engagement strategy · four pillars',
    layers: ['political-engagement'],
    camera: { lon: 19.2, lat: 52.1, k: 11 },
    selectedIso: 'POL',
    callouts: ['poland-strategy'],
  },
  hub('engagement-after-poland'),
  {
    id: 'lithuania',
    title: 'Lithuania',
    layers: ['political-engagement'],
    // k=20. Smaller than Belgium's 22 despite being a smaller country: at this
    // scale Lithuania sits near the top of the fitted frame, and the
    // translateExtent clamp starts to bite before the country fills the height.
    camera: { lon: 23.9, lat: 55.3, k: 20 },
    // The subject, held selected — see the note on the UK scene.
    selectedIso: 'LTU',
    markers: [capital('LTU')],
  },
  /*
   * THE DECK ENDS ON A PLAN, NOT A PICTURE.
   *
   * Lithuania holds the Presidency of the Council when the Quantum Act is
   * debated, so it is the one spoke with an actual visit behind it — and putting
   * the stakeholder map last means the talk finishes on the next thing that
   * happens rather than on the sixth country in a set.
   *
   * The visit agenda used to follow this as a second scene, tethered to Vilnius,
   * and was cut. Restoring it is a scene here and the callout in
   * data/lithuania.ts, both of which are in the history — it was removed rather
   * than commented out, because a deck with dead scenes in it is a deck nobody
   * trusts the running order of.
   */
  {
    id: 'lithuania-stakeholders',
    title: 'Lithuania',
    caption: 'Stakeholder map · three groups, six meetings',
    layers: ['political-engagement'],
    camera: { lon: 23.9, lat: 55.3, k: 20 },
    selectedIso: 'LTU',
    callouts: ['lithuania-stakeholders'],
  },
  /*
   * THE LAST SCENE, AND IT GOES ALL THE WAY BACK OUT.
   *
   * No camera and no layers: the fitted EMEA frame, the whole region unlit and
   * undifferentiated. That is deliberate on two counts. The asks are about how
   * the team works and apply to every market, so finishing on the sixth country
   * of six would scope them to Lithuania by implication. And it is the same
   * picture the talk opened the region on — the deck pulls out to EMEA at scene
   * 5, walks into it for thirty scenes, and steps back to exactly where it
   * started. Nothing had to be built for that: an omitted camera actively
   * resets (§3a), so "back out to the whole region" is the ordinary act of
   * entering a scene that names no camera.
   *
   * No markers either. The panel points at nothing because it is about us.
   */
  {
    id: 'closing-asks',
    title: 'What I need from you',
    caption: 'Four asks · across the region',
    callouts: ['closing-asks'],
  },
];

/** Index bounds helper, so nothing off-by-ones its way past the end mid-talk. */
export function clampSceneIndex(index: number): number {
  if (DECK.length === 0) return 0;
  return Math.max(0, Math.min(DECK.length - 1, index));
}
