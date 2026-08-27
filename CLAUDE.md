# IonQ EMEA Atlas — project conventions

This file is the contract between sessions. State 1 (base region map) is built.
States 2–4 are additive and must stay that way. Read this before changing
anything; if you change a decision recorded here, change it here too.

```
State 1  base EMEA region map                    <- BUILT
State 2  membership layers over the base map     <- EU 27, EEA/EFTA/UK, Horizon Europe, EuroQCI,
                                                    priority political engagement (a selection, §7f)
State 3  capital deep-dives with a data panel    <- STARTED: markers + capitals + the
                                                    readout as the panel, see §7e
State 4  scene sequencer                         <- BUILT EARLY, see §3a
State 3  capital deep-dives with a data panel
```

State 4 was brought forward deliberately. The presenter drives the talk with a
clicker, and a clicker can only say "next" — so the states had to be an ordered
walk from the first one, not a set of toggles that would have needed rewriting
into a deck later.

The test of the architecture is simple: **adding a layer in State 2 must not
require editing rendering code.** If it does, the architecture has drifted.

---

## 1. Palette

Defined once, in `src/render/palette.ts`, and pushed onto `:root` as custom
properties at mount. The stylesheet references `var(--tok)` and never a
literal. Do not add a hex to a component or to `styles.css`.

| Token | Hex | Role |
| --- | --- | --- |
| `base` | `#06080B` | canvas |
| `panel` | `#0D1116` | readout, telemetry strip |
| `landInScope` | `#141A21` | EMEA land |
| `landOutOfScope` | `#0A0D11` | non-EMEA land — rendered, never clipped |
| `borderBase` | `#8A4200` | the unpowered conductor, always lit |
| `borderPulse` | `#FFB04D` | the travelling charge — a filament at temperature |
| `neutralLine` | `#2A3440` | coastline, exterior boundary, graticule. Never pulses. |
| `ionq` | **`#FF8300`** | selection, active state, layer members, readout accent — **only** |
| `typePrimary` | `#C9D3DD` | type |
| `typeMuted` | `#5E6B79` | labels |

**On the orange.** `#FF8300` was sampled from `assets/ionq-logo.webp`, the
official wordmark, vendored here so the provenance of the brand colour travels
with the project rather than pointing at a path in another repository. The mark is a three-stop gradient
`#FF5000 → #FF8300 → #FFB700`; `#FF8300` is the mid stop. The original brief
specified `#FF8200`, one unit of green away and visually identical — the
sampled value wins. Note that the sibling tool `redesigned-octo-memory` uses
`#F15A24` as its accent, which appears nowhere in the logo; that inconsistency
is inherited, not introduced here.

Fill tints are `ionq` alpha (`tint` in `palette.ts`): hover 10%, selected 14%,
layer members 15%. The layer value is above the brief's 8–14% band on purpose:
8% over `#141A21` does not survive a projector, which crushes low-end contrast.
Check it on the actual display before lowering it.

**Discipline.** Orange is the sole brand accent and appears in four roles only:
the border network, selection, layer membership, and the readout rule. Everything else is
neutral. Adding a fourth hue is a design decision, not a convenience — the
instrument reads as an instrument because it is monochrome plus one.

## 2. Type scale

Two families, vendored as woff2 in `src/assets/fonts`. No network, ever.
JetBrains Mono for all data; Space Grotesk for headings and the title plate.
Sizes clamp against viewport height so they hold on a projector.

| Role | Family | Size | Tracking | Use |
| --- | --- | --- | --- | --- |
| `plate` | Grotesk 600 | `clamp(15px, 1.55vh, 24px)` | .14em caps | title plate |
| `title` | Grotesk 500 | `clamp(18px, 2.05vh, 30px)` | .01em | country name |
| `label` | Mono 500 | `clamp(8px, .86vh, 11px)` | .18em caps | field keys, telemetry keys |
| `value` | Mono 400 | `clamp(10px, 1.12vh, 14px)` | .06em | codes, coordinates, scale |
| `micro` | Mono 400 | `clamp(7px, .76vh, 10px)` | .22em caps | key hints |

Data type is tracked wide and small; it should read as instrument output, not
body copy. To substitute an IonQ brand typeface for headings, drop the woff2
into `src/assets/fonts`, add an `@font-face`, and change `--sans`.

## 3. The layer contract — the thing that matters most

A membership layer is **an array of alpha-3 codes and nothing else.**

To add one in State 2:

1. create `src/data/layers/eu.ts` exporting a `MembershipLayer`;
2. add it to the `LAYERS` array in `src/data/layers/index.ts`;
3. add it to a scene's `layers` array in `src/scenes/deck.ts`.

`resolveCountryStyle` already has the clause that handles any layer, and
`BorderMesh` already energises any layer's internal borders generically via
`arcsWithinMembers`. **The EU layer was added without touching either.** That
is the contract holding under load, which is the only test of it that counts.

`LAYERS` is ordered, and order is precedence when a country belongs to more
than one active layer — so precedence is data rather than code.

**`resolveCountryStyle` is the only place a country's appearance is decided.**
No component may set a fill, stroke or opacity on a country path. If you want a
conditional colour anywhere in `render/`, it belongs in that function.

It returns **referentially stable** objects — module constants or cached
instances. This is load-bearing, not tidiness: components subscribe with
`useViewState(s => resolveCountryStyle(...))` and zustand compares with
`Object.is`. Allocate a fresh object per call and all 238 country paths
re-render on every hover, and the pulse visibly stutters.

## 3a. The scene sequencer — the presentation surface

**The deck is `src/scenes/deck.ts`: one ordered array. That array IS the talk.**
Reordering the talk means moving a block in that file, which is deliberately
the easiest edit in the project, because reordering is what you actually do
while rehearsing.

A `Scene` (`src/scenes/types.ts`) carries `layers`, `camera`, `title`,
`caption` and an optional `selectedIso`. It is not just a layer id, and that
matters: a later scene will want to zoom to Brussels and put a caption up. If
scenes had started as bare toggles, adding camera and caption would mean
changing how every existing scene is defined.

**Scenes are absolute, never relative.** `gotoScene` writes `activeLayers`,
`selectedIso` and the camera every time. Omitting `camera` means "the fitted
EMEA frame", not "leave it where it is". This is the property that makes the
deck safe live: after ten minutes of improvised zooming during questions,
stepping to the next scene restores exactly the picture that was rehearsed.
`verify.mjs` asserts it.

**How it is driven.**

| Input | Action | Why |
| --- | --- | --- |
| `Page Down` / `Page Up` | next / previous scene | **What a presentation clicker actually sends.** Almost every remote emulates these two keys and nothing else. If these break, the talk cannot be driven away from the laptop. |
| `→` `↓` / `←` `↑` / `Space` | next / previous | The same commands at the machine. |
| `Home` / `End` | first / last scene | |
| `M`, or the Scenes button | open the scene menu | Jump directly to any scene. A clicker cannot do this, which is exactly why it exists — questions do not arrive in running order. |
| `Esc` | close the menu, else clear selection | Layered on purpose: never make someone press Esc twice to close one thing. |

While the menu is open it owns arrow keys and the deck does not step
underneath it. `Space` is ignored when focus is on a button, so one press never
fires two actions.

**The menu is capped against the viewport and scrolls inside.** It is anchored
to the bottom of the frame and grows upward, so a long deck pushes its earliest
entries off the top of the screen — and those are exactly the scenes a question
sends you back to. Found at 21 scenes, where the opening screens had become
unreachable. `.scene-menu-list` scrolls; the head and foot stay pinned. If you
add scenes, check the menu still reaches scene 1.

## 3b. Zooming is a scene property, not a feature

**There is no "zoom mode" to build and there never was.** A scene carries an
optional `camera: { lon, lat, k }`; `gotoScene` hands it to `applySceneCamera`,
which calls the same `focusOn` that `window.__focus` and the reset key already
use. `k` runs 1–24 (`ZOOM_EXTENT`), the move is a 700ms d3 transition, and d3
stays authoritative for the transform throughout. Scene 7 (the UK close-up) is
the first user of it and added **five lines of data and no code** — which is
the payoff for `Scene` having carried `camera` since State 1 rather than
starting life as a bare layer toggle.

Two consequences worth keeping in mind when adding a zoomed scene:

- **Omitting `camera` actively resets.** It does not mean "leave it here". A
  zoomed scene therefore cannot leak its camera onto its neighbours, which is
  what lets you zoom freely during questions and step out cleanly.
  `verify.mjs` asserts both directions on the UK scene.
- **Pick `k` on the real build, not by arithmetic.** Frame it at 2560×1440 and
  look; the equal-area projection and the `translateExtent` clamp make paper
  estimates unreliable near the edges of the fitted frame.
- **Nothing steps into scene 1, so `Map.tsx` applies its camera on mount.**
  The store is seeded from `DECK[0]` at module load, before the map exists and
  before the camera has anywhere to register, so `gotoScene` never runs for the
  opening scene. This was invisible while scene 1 was the fitted frame — an
  unapplied camera and the fitted frame look identical — and became very
  visible the moment the deck opened on Salisbury. The effect is ref-guarded so
  a resize cannot re-run it and yank the camera back mid-talk.

**The camera is the one imperative escape hatch.** `render/cameraControl.ts` is
a module-level registry that `Map` writes to on mount. The alternative — lifting
the zoom transform into the store — would re-render the map on every wheel tick
and leave d3 and the store arguing about which transform is authoritative.

## 3c. Hub and spoke, and the two fields that made it free

Scenes 6–17 alternate: the six priority states at region scale, then one of
them close up, then **back out to the six**, then the next. Every country is
introduced against the whole selection rather than in isolation, and stepping
out is what gives the next zoom something to mean.

**It required no new machinery, and that is the whole argument for how scenes
were defined.** A hub is the engagement scene with no `camera`; because scenes
are absolute (§3a) and an omitted camera *actively resets*, "return to the
region" is not a zoom-out action to implement — it is the ordinary act of
entering a scene that has no camera. Had the deck been a list of layer toggles
with a separate zoom mode, this pattern would have needed both a new field and
new state.

Two details that are load-bearing:

- **`hub()` in `deck.ts` generates every hub from one definition.** Six
  hand-copied hubs would drift — someone edits a caption on one of them and the
  talk develops a flicker nobody can find.
- **Each occurrence still needs its own `id`.** `SceneMenu` keys on `scene.id`
  and targets `data-scene`, so duplicates would collide in reconciliation and
  make a menu entry ambiguous.

**The spokes hold their country selected**, which is what `selectedIso` was on
the Scene type for since State 1. It earns its place twice over: the selection
outline is drawn on top with the dark under-stroke that occludes the pulse
(§6), so the subject is the brightest and only *motionless* boundary in frame —
necessary because at Lithuania's camera, Poland fills a third of the screen in
the identical member tint, and the title plate should not be the only thing
distinguishing them. And the readout fills with that country's name, code,
capital and region, marked `HELD`. That is State 3's data panel arriving through
a field that already existed.

`verify.mjs` walks the entire tail with the clicker and asserts the
alternation — every hub gives the camera *and* the selection back, every spoke
zooms and names its country. The failure mode worth guarding against is not one
wrong camera; it is a hub that quietly keeps a zoom, which would leave the
presenter mid-talk looking at a picture nobody rehearsed.

## 4. Disputed-territory policy

The full register is `src/data/disputed.ts`, one entry per case with the probe
coordinates used to verify it. The policy:

1. Natural Earth defaults hold, **except** where a default asserts a position
   contrary to UK/EU/UN law. Those exceptions are patched, and the patch is
   named in the register.
2. Lines of control, armistice lines and administrative lines render as
   **dashed hairlines** and never pulse.
3. **No label in this application asserts a sovereignty position.** The readout
   prints a name and a code; it does not print a status. The one thing it does
   state is when a code is user-assigned rather than ISO-allocated, because
   presenting XKX as an ISO code would be a factual error.
4. Nothing is clipped. A hole in the map looks like a bug and invites exactly
   the question we are not answering.

Decisions taken in State 1:

| Case | Treatment |
| --- | --- |
| **Crimea** | Source data assigns it to **Russia**. Reassigned to Ukraine at build time, **outright, with no line of control** — it fills and pulses as Ukrainian territory. |
| **Kosovo / N. Cyprus / Somaliland** | Present in the data but carry **no ISO code**. Rendered under user-assigned `XKX` / `XNC` / `XSO`, with dashed boundaries against Serbia / Cyprus / Somalia respectively. |
| **Western Sahara** | Natural Earth's separate `ESH` feature kept. Boundary with Morocco dashed. |
| **Palestine** | Natural Earth's `PSE` feature kept. Boundary with Israel dashed. |
| **Golan Heights** | **FLAGGED.** Source draws it inside Israel and it is not separable at 1:50m. The Israel–Syria boundary is drawn dashed, which is accurate — that line is the 1974 disengagement line, not a border. |
| **Israel–Lebanon** | Dashed. It is the UN Blue Line, a withdrawal line, not an agreed boundary. |
| Abkhazia, South Ossetia, Nagorno-Karabakh, Transnistria | Source folds each into Georgia / Azerbaijan / Moldova, matching international recognition. Default kept. |
| Ceuta, Melilla, Gibraltar | Below the resolution of the 1:50m dataset. Recorded as a known limitation. |

## 5. Data conventions

**Alpha-3 is the only join key.** ISO numeric codes exist solely in the
vendored topology and are resolved away at load. Every layer, every scene,
every future dataset is keyed on alpha-3.

- `src/data/geo/countries-50m.json` — vendored, **do not hand-edit**. Written by
  `scripts/prepare-geo.mjs`, which applies exactly one geometric patch (Crimea)
  and then asserts the invariants the render layer depends on.
- `src/data/iso.ts` — **generated** by `scripts/gen-iso.mjs`. Change a display
  name in the script, not the output. Regenerate with `npm run gen:iso`.
- `src/data/regions.ts` — EMEA membership, explicit, with a reason per
  judgement call. 124 entities in scope.
- `src/data/capitals.ts` — complete and typed. Unrendered in State 1; State 3
  is a drop-in.
- `src/data/disputed.ts` — the register above.

**Never trust `properties.name` from the topology.** Natural Earth 4.1.0 is
2018-vintage and reads "Macedonia", "Turkey", "Bosnia and Herz.". Those names
are used for exactly one thing: keying the three ISO-less de facto entities.
Everything the audience sees comes from the curated table in `gen-iso.mjs`.

**Scope decisions.** EMEA = Europe + Middle East + Africa, including Türkiye,
the South Caucasus, Israel and the Gulf. **Iran, Afghanistan and Pakistan are
out of scope**; scope stops at Iraq and the Gulf. Russia, Central Asia,
Greenland and the mid-Atlantic islands are out of scope but rendered in their
true positions, unlit. `DELIBERATELY_OUT_OF_SCOPE` in `regions.ts` records why,
so a scope change is a one-line move between two tables.

## 6. Rendering rules

**React owns the DOM. D3 is maths only.** `d3-geo` produces path strings,
`d3-zoom` produces transform values. Nothing in d3 appends, removes or restyles
an element in the React tree.

**Panning and zooming move a `<g>`; they never re-project.** Re-running
`geoPath` over 238 1:50m MultiPolygons per wheel tick will not hold 60fps. The
border layers use `vector-effect: non-scaling-stroke`, which keeps hairlines
hairline at 8× and — the reason it really matters — resolves dash geometry in
screen space, so the pulse keeps constant apparent length and speed at every
zoom level instead of stretching into streaks.

**Country polygons carry no stroke.** Every boundary is drawn exactly once,
from the mesh. A stroke here would paint each internal border twice, from both
sides, and the two pulses would drift visibly out of phase.

**The border partition** (`src/data/atlas.ts`) indexes arc ownership rather than
calling `topojson.mesh` twice, because a single mesh cannot carry two
treatments and we need three: pulsing in-scope, dashed de facto, dim
out-of-scope. It also fixes a real bug — after the Crimea reassignment the
Perekop arc is used twice by Ukraine, and `mesh(a === b)` would draw it as a
stray coastline across the isthmus.

```
usage 1                -> coastline (in or out of scope)
usage 2, two owners    -> political border, classified by scope and dispute
usage 2, one owner     -> internal seam, DROPPED
```

`INTEGRITY` asserts the partition is total and disjoint at load, and the
telemetry strip reports it, so a data regression shows on the screen you are
already looking at.

**Exactly one filter in the document.** The `feGaussianBlur` is on the static
glow layer only. A filter on an animated element re-rasterises every frame.
The pulse gets its bloom from stacked strokes, which costs nothing. Do not
attach a filter to `.pulse`, and never to the country paths.

**`borderConfig.ts` holds every tunable** and nothing in `BorderMesh.tsx`
encodes a number. Values flow to CSS custom properties via `borderCssVars()`,
applied at the **app root** — not on the mesh group, because the hover and
selection outlines and the legend are siblings of the mesh, and scoping the
vars lower silently drops them to CSS initial values.

**Hover wins on luminance and stillness, not hue.** With every border already
orange, hue has no contrast left to spend. The hovered country's outline is
drawn on top with a wider dark under-stroke that *occludes* the travelling
pulse along those segments, so it is both the brightest and the only motionless
boundary on screen.

**The projection frame is a `MultiPoint`, not a `Polygon`.** d3-geo treats a
polygon ring as a spherical polygon whose interior is to the left of the ring;
get it wrong and `fitExtent` silently fits the complement — the whole globe —
with no error. This bit us once. A point set has no winding and no interior.

**Equal-area is a requirement.** Do not substitute Mercator. It inflates Europe
against Africa by a factor that is not defensible in front of this audience.

## 7. Commands

```sh
npm run dev            # dev server
npm run build          # typecheck + production bundle
npm run preview        # serve the build — works with the wifi off
npm run verify         # drive the real build in Chromium; 128 assertions
npm run prepare:data   # regenerate vendored geo + iso.ts from upstream
```

`npm run verify` writes screenshots to `screenshots/`, including close-ups of
Luxembourg, Slovenia, Lesotho, Gambia, the Gulf, Cyprus, Crimea and the Horn —
the places where border double-drawing or phase doubling would show first.

## 7a. Membership layers

`src/data/layers/eu.ts` is the worked example. A layer is an array of alpha-3
codes; it knows no geometry and sets no colour.

Two things happen when a layer is active, and neither required layer-specific
code:

1. **Members take the orange tint; non-members in scope dim to 45%.** A layer
   is an overlay on EMEA, not a replacement for it, so the region still reads
   whole.
2. **The bloc's internal borders energise.** `arcsWithinMembers` (atlas.ts)
   returns the arcs whose *both* owners are members, and those run brighter and
   heavier than the ambient network. This is what keeps a layer inside the
   instrument metaphor — the EU reads as a powered region of the same chip
   rather than a shape coloured in on top of a map. Tunable under `member` in
   `borderConfig.ts`.

Only arcs with both owners inside the set qualify. A border between a member
and a non-member is the *edge* of the bloc, not part of its circuit; lighting
it would misstate where the boundary of the thing actually is.

The EU file records what is deliberately absent — the UK, Northern Cyprus (de
jure EU territory, acquis suspended), Greenland, the Faroes, the Crown
Dependencies, EFTA — because each is a question somebody may ask.

## 7b. Tiering, and why colour alone could not do it

Scene 3 builds on scene 2: the EU 27 stay exactly as they were and five more
states arrive in a second treatment. That treatment is **amber and hatched**,
and the hatch is not decoration.

**The measurement.** The IonQ gradient (`#FF5000 → #FF8300 → #FFB700`) is a
pure hue rotation inside the orange band. Composited at the 15% alpha a
membership fill needs, over `#141A21`:

| | rendered | distance from EU |
| --- | --- | --- |
| unlit land | `rgb(20,26,33)` | 38.8 |
| EU, `#FF8300` @15% | `rgb(55,42,28)` | — |
| amber, `#FFB700` @15% | `rgb(55,50,28)` | **8.0** |
| red, `#FF5000` @15% | `rgb(55,34,28)` | **8.0** |

Both ends of the brand gradient differ from the middle by 8 units of green and
nothing else, against a distance of 39 from lit to unlit. **Tier-to-tier
separation would be a fifth of tier-to-unlit** — fine on a monitor, invisible
on a projector, which crushes exactly that part of the range.

So the tier is carried by **shape**: solid for members, hatched for associated.
That holds at any brightness, and it is the convention this audience already
reads. The accent still steps along the brand gradient, so the tiers remain two
states of one thing rather than two categories in a chart, and the palette
discipline is intact.

`fillPattern: 'hatch'` on a layer is all it takes. `resolveCountryStyle` returns
a pattern reference — still a fill string, so it remains the only place
appearance is decided — and `Map.tsx` generates one `<pattern>` per hatched
layer from whatever `LAYERS` declares. The pattern counter-scales the camera
(`patternTransform: scale(1/k)`) so the hatch stays constant on screen at any
zoom. The legend draws its hatch explicitly rather than reusing the pattern: a
key should be *clearer* than the map, and the map's low-opacity hatch reads as
a tone shift at swatch size.

**`circuitWith`.** A layer defined by its relationship to another one lights
almost nothing on its own — the only border between two EEA/EFTA/UK members is
Liechtenstein–Switzerland. `circuitWith: ['eu']` lets the circuit extend across
the borders that carry the relationship: Norway–Sweden and –Finland,
Switzerland's four Alpine neighbours, and the UK–Ireland land border.

**Cross-layer dedupe is mandatory.** `MemberCircuit` walks `LAYERS` in
precedence order and lets each layer claim only arcs no higher-precedence layer
already took. Two circuits over one border would stroke it twice and the pulses
would drift out of phase — the exact fault the whole border architecture exists
to prevent. `verify.mjs` asserts zero shared segments between circuits.

## 7c. Programme data must be verified, not remembered

`horizonEurope.ts` is the first layer whose membership is **volatile**. EU
membership changes once a decade; association to a framework programme changes
every year and in both directions — the UK associated from 2024 after three
years out, Switzerland from the 2025 calls after being excluded from 2021.

So the rule for any programme layer:

1. **Check the list against current sources before writing it**, and again
   before any talk where the detail carries weight. The authoritative source is
   the Commission's "List of Participating Countries in Horizon Europe" on the
   Funding and Tenders portal.
2. **Record what is deliberately absent, with the reason.** Half the value of
   these files is answering "why isn't X lit" without hedging.
3. **Do not assume one bloc is a subset of another.** Horizon Europe is the
   worked example: Liechtenstein is in the EEA and declined to associate, and
   the Faroes are outside the EU and the EEA and are associated. Both swap
   sides between scenes 3 and 4, and `verify.mjs` asserts both swaps — if a
   future edit quietly makes the research area a copy of the single market,
   the suite fails.

Not yet shown, and a real gap if the talk goes near African research
partnerships: entities from low- and middle-income countries are
**automatically eligible** for Horizon Europe funding without any association
agreement, which covers most of the continent. That is a much larger story
than the association list and deserves its own scene rather than being merged
into this one — the two tiers mean different things.

## 7e. Markers — the first ions on the trap

`src/data/markers.ts` is the registry; `render/Markers.tsx` draws everything in
it. This is the ion metaphor from the original brief arriving for real: a
bright core inside a containing ring inside a soft halo, sitting on the
conductor network the borders form. **State 3's capital markers are this
component with a third data source** — do not write a second marker system.

**A scene lists marker ids** (`markers: ['westminster', 'oxford']`), resolved
against the registry, and an unknown id throws rather than quietly drawing
nothing. This replaced `deployments: boolean` when the second source arrived,
which is exactly the trigger `scenes/types.ts` had recorded for it.

**A scene that wants a category asks for the category, not a snapshot of it.**
`deployments.ts` exports derived id lists — `DEPLOYMENT_IDS` for every IonQ
site, `NETWORK_DEPLOYMENT_IDS` for the national QKD networks — so the EuroQCI
scene stays correct as the data grows: a fifth network lights on it, a second
installed system does not. That slide takes the networks only, because
QuantumBasel and Oxford Ionics are both outside the programme's perimeter and
would argue the opposite of the other four on a slide whose whole claim is that
IonQ hardware is already inside it. Neither is lost — Oxford is half the UK
spoke. Filtering by hand in `deck.ts` would work today and rot quietly, which
is the difference worth keeping.

**The sources are separate files because they make different claims.**
`deployments.ts` asserts, entry by entry, that IonQ has something somewhere,
and carries provenance per site. `institutions.ts` asserts only that a place
matters — Westminster is where the decision is taken, not somewhere IonQ sits.
`capitalMarkers.ts` projects `capitals.ts`, a gazetteer, into markers — all 125,
inert until a scene names one, so a country close-up costs `capital('XXX')` and
no data work. `places.ts` asserts nothing at all, which is what an opening
screen sometimes needs and what the other three must never be stretched to
cover. Merging any of them would make a claim the deck must not make.

**A capital's label IS its place**, so `Markers.tsx` drops the place from the
second line rather than printing "Rome · Capital" under a label reading "Rome",
and omits the line entirely when nothing is left — which is the case for a bare
place. `precision` stays honest either way; it was never the field to fudge.

**That distinction is carried on screen, not just in the data.** The bright
core is the IonQ claim, so only the IonQ kinds get one — `IONQ_PRESENCE` in
`Markers.tsx` is the single place that decides. An institution, a capital and a
bare place are drawn as ring and halo, dashed and quieter: a trap site with no
ion in it. It separates on shape
rather than on a second hue, the same reasoning as the hatched layer tier in
§7b, and `verify.mjs` asserts Westminster has no core while Oxford has one. If
every marker ever gets the same glyph again, a dot on Parliament starts making
a claim nobody checked.

Three rules it establishes:

1. **Markers live outside the camera group.** The projected point is put
   through the camera by hand (`x * k + tx`) and drawn in screen space, so a
   marker holds constant size and its label never scales. An ion that swells
   to a saucer at 8× looks like a bug.
2. **Nothing about a marker animates ambiently.** The pulsing borders remain
   the only ambient motion on the map. Markers fade in when their scene opens
   — a transition, not ambient motion — and then hold still.
3. **`precision` is honest about what a coordinate means.** A site-level
   marker names its place, because that is what it is asserting. A
   country-level marker does not: printing "WARSAW" under a dot that means
   "Poland" claims a precision the data does not have. National QKD networks
   have no single point.

Labels carry `labelSide` and `labelDy` because six markers in Europe collide
and the real list will be longer. When they clash, flip a label — never move a
dot. The dot is where the deployment is.

**The frame edge is a collision too, and it obeys the same rule.** Once scenes
carry cameras (§3b), a marker can sit inside the viewport with its label
hanging over the edge, which reads as a rendering fault rather than as a marker
at the border — it happened to Slovakia the moment the UK scene landed.
`Markers.tsx` therefore takes the viewport size, flips a label to whichever
side has room, and drops a marker only when the *dot* is off-frame. So
`labelSide` is a preference, honoured whenever it fits; at the fitted frame it
always fits, so the region-scale scenes are untouched. `verify.mjs` asserts no
label crosses the frame edge at the UK camera.

The deployment list is **partly supplied by IonQ Government Affairs and partly
reconstructed from public announcements**, and it says so at the top of the
file. Anything unannounced or under NDA is absent by definition. Treat it as a
starting point and confirm before presenting.

## 7d. The frame-rate gate measures capability, not contention

`verify.mjs` takes the **best of three** samples rather than one. This is a
capability gate: the question is whether the map can hold 60fps, not whether
the container happened to be contended during one two-second window. On
identical code, single samples ranged 19–60 while the best was consistently
60, and an isolated warm page measured 60.3 every time. A gate that fails at
random before a talk teaches you to ignore it, which is worse than not having
one. A real regression still fails, because it lowers all three samples.

**The gate must measure the heaviest scene, and it reaches it by name.**
EuroQCI is the worst case — two hatch patterns, 31 tints and four markers. It
stopped being the last scene when scene 6 arrived, and stopped again when
scene 7 did, so the gate no longer counts steps from either end of the deck:
it opens the menu and clicks `.scene-item[data-scene="euroqci"]`. Counting
steps meant the gate silently drifted onto a lighter scene every time the deck
grew, and a gate measuring the wrong scene passes forever and tells you
nothing. If a heavier scene than EuroQCI ever lands, change the id on that
line — it is the only thing that decides what is measured.

**Measure early, and in isolation when diagnosing.** The gate runs before the
screenshot-heavy part of the suite, and **new sections must go after it** —
this trap has now been walked into twice. Adding three 2560×1440 screenshots
ahead of the gate dropped it to 49fps with the samples INVERTED (49/19/26
instead of the usual climb), which is the tell: a climbing sample set is
warm-up, a falling one is the suite eating the CPU it is trying to measure.
Originally it sat near the end, after
a dozen 2560×1440 PNG encodes and a second browser context, and failed at
41fps on code that measures a clean 60 on every scene in isolation — it was
reporting the suite's own CPU appetite, not the map's.

Two false alarms are worth remembering, because both looked exactly like real
regressions:

- **Pattern fills.** The obvious suspect when the EuroQCI scene dipped.
  Swapping every pattern for a flat colour in the live page changed nothing:
  60.3 either way.
- **Leaked preview servers.** `npx` forks vite as a child, so killing the npx
  pid left the real server running. Six accumulated across runs and quietly
  ate the CPU. The suite now spawns detached and kills by process group.

If you suspect a genuine perf regression, reproduce it on a warm page in
isolation before believing a suite number, and check `ps aux | grep vite`
first.

**Compare against the previous commit, not against the number written here.**
The gate failed once at 53fps on the marker-registry change, which looked like
a regression and was not: building the parent commit and measuring it with the
identical script gave 60.3, the change gave 59.2, and then a *lighter* scene on
the *old* build gave 58.8 — which is what proved the container, not the code,
was moving the number. Three interleaved runs each way overlapped completely
(old 60.3/60.3/60.1, new 59.2/59.4/60.4). Stash, rebuild, measure, unstash;
it takes two minutes and it is the only way to tell the two apart.

**The three samples are not equivalent — they climb.** Every run looks like
19/41/59: the first two are warm-up and only the last is steady state, which is
why best-of-three is the statistic and why a loaded container lands the gate
near its threshold rather than comfortably above it. A gate reading in the
mid-50s is a busy machine; a real regression shows up as a *ceiling* that has
moved, which is what the previous-commit comparison measures.

## 7f. A selection is not a membership, and must say so

Every layer through EuroQCI states a fact with a published list behind it. The
priority engagement layer (`politicalEngagement.ts`, scene 6) states an IonQ
choice: six states — UK, Belgium, Lithuania, Poland, Italy, Germany — who are
members of nothing in common. The map must not imply otherwise, and three
things carry that:

1. **The label names the thing honestly.** "Priority political engagement" —
   no acronym, no bloc name, nothing an audience could mistake for an
   institution they are meant to recognise.
2. **The caption states the negative, on screen.** "A selection, not a bloc"
   sits on the title plate for as long as the scene is up.
3. **The absences carry no reasons.** Elsewhere in `layers/` the footer notes
   explain why a near-miss is dark, because a rule exists to cite. Here there
   is none, so the file records nothing rather than inventing a rationale for
   why France or Switzerland is unlit. This is the disputed.ts policy applied
   to commercial geography: state what is, and stop.

**It is the one layer where being out of date is invisible.** A stale EU layer
puts a country in the wrong colour and somebody notices; a stale priority list
looks exactly like a current one. Confirm it before presenting, on the same
footing as `deployments.ts`.

It also runs **alone** in its scene. With `eu` co-active the precedence rule
would tint five of the six as member states and split the set on screen into
the very distinction the scene is not making. A future second tier — engaged
versus watching — is a second file and a hatched layer, exactly as scenes 3
and 4 do it.

## 7g. Callouts — content tethered to a point

The opening scenes put a panel of content beside Salisbury with a line drawn
back to the dot. `src/data/presenter.ts` holds the content, `render/Callouts.tsx`
draws it, and a scene lists panel ids exactly as it lists marker ids.

**The panel is HTML and the leader is SVG, and that split is deliberate.** SVG
has no text wrapping: an all-SVG panel would mean hand-breaking every line of
the career list into `<tspan>`s in the data file and re-breaking them whenever a
word or the viewport changed — brittle in precisely the place the content gets
edited, the night before a talk. The leader has the opposite nature, being pure
geometry, so it is drawn in an SVG overlay above the map.

**The geometry is computed, never measured.** The line has to end *on* the
panel, so something must know where the panel is. Reading it back from the DOM
would put a layout measurement inside render and a second pass on every camera
move. Instead the panel position is decided in `Callouts.tsx` in screen pixels
and the div is placed at it, so the box and the line come from the same numbers
in one pass. The leader meets the panel at a fixed inset from its top edge — a
point that exists without knowing the panel's height, so content can grow
without the anchor drifting.

**A panel is tethered to a MARKER, not to a coordinate.** Move the dot in
`places.ts` and the line follows it. `verify.mjs` asserts the leader's ring sits
within 2px of the marker's halo, and that the panel is wholly inside the frame —
a line pointing at empty sea, or a last line hidden under the telemetry strip,
is the kind of fault nobody sees until it is on a projector.

**The family glyphs are drawn, not imported, and that was a correction.**
Imported silhouettes were tried first and looked wrong: everything else here is
a hairline — the borders, the marker rings, the one-pixel chrome rules — so a
solid filled bust read as clip-art pasted onto an instrument.
`render/FigureIcon.tsx` draws them as strokes on a shared 24-unit grid,
inheriting `currentColor` and the stroke weight from CSS. Data names an icon;
render owns the shape.

**The dog is a paw, and the note in that file explains why at length.** Three
drawn heads were tried and all three failed at the ~60px these actually render
at: front-facing read as a pig twice, profile read as a bird and then as a
cloud. A dog's head is carried by the stop, the jaw and the set of the ears, and
none of those survive a 1.15 stroke at that size. It is a lesson about scale
rather than draughtsmanship — worth reading before anyone tries to "finish the
set".

**Personal content is confined to one file.** `presenter.ts` names real people,
including a child. It is kept in one place so that removing it is one file plus
three scenes rather than a search across the project.

**`callouts.ts` is the registry; the sources make different claims.**
`presenter.ts` is personal. `policy.ts` is an internal legislative assessment
with named advisers and a leaked draft behind it. Splitting them is what lets the
sensitive one be found, reviewed or removed on its own.

## 7h. The EU policy scenes, and the three rules they added

Scenes 14–18 reproduce two Government Affairs information boxes **verbatim** —
the presenter's explicit instruction, for an internal company meeting.

**They sit inside the Belgium spoke, and the placement is the argument.** Beside
the EU layer scene they were an aside about the Union in general; after the
Belgium close-up they are what is happening in the building the camera is
already pointed at. The block pushes in on Brussels at k=24, holds `selectedIso`
on Belgium throughout so the place stays continuous, and hands back to the hub
that returns to the six.

The cameras are centred EAST of Brussels rather than on it: the panel occupies
the right 42% of the frame, and a camera centred on the dot leaves its label
nowhere to go, so the label runs under the box. `Markers.tsx` flips labels at the
FRAME edge and knows nothing about panels — so the fix belongs in the camera,
which is data, not in the renderer. The timeline's camera is shifted south for
the same class of reason: its panel spans the frame from a third of the way down,
so Belgium has to ride above it.

Three more things follow from reproducing the text verbatim:

1. **The fix for dense content is width, never words.** A `620px` panel ran the
   briefings off the bottom of the frame, so `Callout.size` gained `wide`
   (0.42 of the viewport) and `full`. Each document is also split at its own
   seam — Situation and Risk, then Timeline and next steps — across two scenes.
   `verify.mjs` asserts every one of the five panels sits wholly inside the frame
   and still contains a named phrase from deep in its text, because a panel
   clipped at the bottom loses the last bullet of a legal risk assessment
   silently.
2. **`internal: true` stamps the panel.** The content states that no group entity
   is a clean EU participant and sets out where the negotiating leverage is.
   Nobody should be on one of these scenes, in a room, and have to remember
   that — so the stamp carries the as-at date too, which makes a stale build
   visibly stale. This is the most perishable content in the project: the PPA
   publishes 9 September 2026 and the Act's own timeline says every downstream
   date moves with publication.
3. **A `full`-width panel takes no leader line.** `Callout.anchor` is optional
   because the timeline is about the calendar, not about a place; a line from it
   to Brussels would assert a relationship that is not there. The briefing panels
   do tether — to `capital-BEL`, which already existed.

**The timeline's "you are here" marker pulses, and that is a deliberate
exception** to the rule that the borders are the only ambient motion (§7e). It
was asked for, and it earns it: on a static seven-stage track every node looks
equally live, and where the talk is standing is the one thing the room needs. It
is a slow breath on a ring rather than a flash, it goes still under
`prefers-reduced-motion`, and it is placed by stage **id** rather than by date or
fraction — so it sits on a node the layout already placed, and `verify.mjs`
asserts it is within 1.5px of that node's centre. A marker silently defaulting to
the left edge would claim the talk is at stage one of seven.

**Inserting scenes mid-deck breaks step-counting, not just indices.** The layer
progression used to be contiguous, and the suite walked it with `PageDown`. Five
scenes between the EU and EEA scenes turned that into a walk through a briefing,
so the suite now reaches the EEA scene by name and keeps stepping from there.

## 7i. The Italy circuit — a diagram argues through its shape

Scene 21 (`strategy.ts`, `kind: 'circuit'`) puts the Rome–Brussels relationship
up as a picture: two terminals, two conductors, one running each way. It sits
**inside the Italy spoke**, the same placement argument §7h makes for the EU
files — beside a layer scene it would be an aside about the Union; after the
Italy close-up it is what the country the camera is already on is *for*.

**A third source file, because it makes a third kind of claim.** `presenter.ts`
is personal, `policy.ts` reproduces the EU's assessments of us, and
`strategy.ts` is what IonQ intends to DO about them — which capital, through
which relationship. It names a national agency and says what our access to it is
to be used for, so it is exactly the file §7g's split exists to keep findable.
Two of its assertions are internal judgement rather than sourced fact (the
Italian posture towards US companies; the reach of the AISI relationship into
ENISA), the panel says so in its `sources` line, and the file says so at length.
The AISI acronym is deliberately **not expanded** anywhere — more than one
Italian body would fit, and §4's rule applies to commercial geography too.

Three things the body kind established:

1. **The shape is the argument, so the shape is what the suite asserts.** Two
   arms pointing the same way would render perfectly and mean something nobody
   wrote; a rail stopping short of a terminal leaves the loop open. Neither
   throws and neither shows in a thumbnail, so `verify.mjs` reads the arrowhead
   direction off the CSS triangle and measures the drawn rule — the `::before`,
   not the element that positions it — against both node boxes. A check against
   the element box passes on a rail that visibly stops short; that was caught by
   writing the check wrong first.
2. **`arms` is a tuple of two, and position and direction are kept apart.**
   Which side of its column a rail hugs is decided by POSITION, so the loop
   closes into a rectangle whichever order the arms are given in; which way the
   arrowhead points is decided by `direction`. Conflating them would mean
   reordering the data could quietly open the loop.
3. **Geometry in CSS, not SVG — the same call `Timeline` made.** The rails
   stretch to whatever height the claims and levers come to, so nothing measures
   the DOM and the circuit stays closed as content grows. Two straight lines and
   two triangles are not worth a layout pass on every camera move.

**It is the only scene whose camera holds two capitals**, because the diagram
names both and a camera showing only Rome would leave half the picture asserted
by the panel and unsupported by the map. Italy stays `selectedIso` throughout —
Brussels is the other END of the circuit, not a new subject. The camera is
centred east and pulled back to k=6.5 for the §7h reason: at the first framing
tried, Rome's label ran under the panel. That fix belongs in the camera, which
is data; `Markers.tsx` flips at the FRAME edge and knows nothing about panels.

## 7j. Supplied documents, and the four rules they added

Scenes 6, 7, 13, 14, 15, 23, 29, 30, 33 and 36 are built from documents handed over for
the talk: a ninety-day review, a core-asks paper, a Franco-German position paper
with a clause-by-clause assessment, a four-pillar market strategy, and a
stakeholder map. Every one of them is `internal: true`. Four rules came out of
building them, and all four are about not letting a layout make a claim the
source does not.

1. **A source file per document, named for its subject.** `ninetyDays.ts`,
   `euQuantumAct.ts`, `germany.ts`, `poland.ts`, `lithuania.ts` — alongside
   `presenter.ts`, `policy.ts` and `strategy.ts`. This is §7g's rule under load:
   these name real third parties, a live legal decision-gate, and an intention to
   leverage a named relationship. Removing any one of them is one import and its
   scenes, and a reviewer asked to check what we claim about the Italians does
   not have to read a stakeholder map to find it.
2. **Say on screen whether a panel is verbatim.** `policy.ts` and `ninetyDays.ts`
   reproduce their sources word for word because the wording is the point.
   `euQuantumAct.ts` is condensed at the presenter's instruction, and its
   `sources` line says so, because a condensed ask is a prompt for the presenter
   and not an approved form of words. Where a document is quoted inside a
   condensed panel — the Franco-German clauses — the quotation is exact, since
   those are what member states have actually signed.
3. **Reproduce contradictions; do not reconcile them.** The ninety-day summary
   says eight exposures and the register lists seven, and the distributions do
   not match either. Both are on screen as supplied, the file says so at length,
   and the scene's caption carries NO count — a headline number is exactly where
   a build would quietly pick a side. Same rule as §4: state what is, and stop.
   The Lithuania source pastes the wrong body's rationale onto the Cyber
   Security Centre; `why` is optional on a stakeholder so the gap can stay a gap,
   and `verify.mjs` asserts that entry renders blank.
4. **Derive the geometry from the data, never store it beside it.** The risk
   register's arrows come from its two severity meters, so a row cannot point a
   way its own numbers contradict — the source marked one row sideways while
   moving it MEDIUM to LOW, and the levels were right. Pillars are numbered from
   their position, so reordering them cannot leave a hand-written "3." behind.
   Both are asserted.

**A confirmed claim carries no caveat.** The Poland pillars rest on four factual
claims — the component sourcing, the scale and funding state of the national
policy, that its text prefers outright purchase, and that PIAST-Q is trapped-ion.
They were confirmed, so the panel states them plainly and carries no footnote: a
hedge on a slide reads as doubt about the claim it hedges, and pillar 1 is the
strongest position IonQ holds in that market. The reason to record a dependency
like that in the file is so it gets updated when it moves, not so a room hears it
qualified. `deployments.ts` and `politicalEngagement.ts` keep their
confirm-before-presenting notes, because those lists genuinely go stale on their
own; a checked fact does not.

**Severity is a meter that gets shorter, not a traffic light.** Red/amber/green
is unavailable twice over: the palette is monochrome plus one, and a projector
crushes exactly the range those three have to separate in. Three segments filled
to the level reads at any brightness, and it makes the shift itself visible —
seven rows of shortening bars is the slide's whole claim. The §7b argument,
applied to risk instead of to membership tiers.

**A full-width panel puts its internal stamp beside the heading.** The default is
the top-right corner, which is where the readout lives, and the stamp was being
drawn under it and clipped to "INTERNAL · AS". Fixed in CSS on `.callout-full`
rather than by pushing the panel down the frame: the readout's height depends on
whether a country is hovered and its inset scales with the viewport, so a magic
top offset would be right at 2560×1440 and wrong everywhere else.

**`Callout.top` overrides the size default, and `full` needed it.** `full` was
built for the timeline, a band across the lower frame; a full-width TABLE is a
page and starts high. That is one number, so it is a field rather than a second
full-width size.

**When a label collides with a panel, move whichever costs less.** Brussels and
Rome were fixed by shifting the camera east (§7h, §7i). Vilnius could not be —
it sits in the far east of Lithuania, so any camera framing the country puts it
under a right-hand panel. That scene sets `side: 'left'` instead and keeps the
spoke's own camera untouched. The rule is the same either way: `Markers.tsx`
flips at the FRAME edge and knows nothing about panels, so the fix is always
data.

## 7k. The UK block, and the marker that must never grow a core

Scenes 13–15 (`uk.ts`) sit inside the UK spoke, the placement argument of §7h
and §7i for a third time. Westminster carries three routes into one government;
Cheltenham and Daresbury each carry one relationship and each fly the camera to
the place their sentence is about. **A slide whose whole content is one line is
not thin when the map beneath it has moved to the site that line is about** —
that is what earns them separate scenes rather than a fourth section on the
Westminster panel. Oxford stays on screen in all three, because in all three it
is the other end of the relationship.

**`institutions.ts` widened, and the invariant did not.** It began as seats of
government and now also carries an agency (GCHQ) and a campus a system is being
proposed into (Sci-Tech Daresbury). What holds the file together is the
negative, not the category: nothing in it is a place IonQ occupies, and nothing
in it gets the bright core. Daresbury is the entry to watch — the day a system
is actually installed there it moves to `deployments.ts` with its provenance and
earns a core, and `verify.mjs` asserts the absence now so that move has to be
deliberate rather than accidental. Oxford is checked on the same scene as the
control, so a change that flattened every glyph could not pass by making the two
agree.

**Two labels 2px apart is a `labelDy`, not a camera move.** Cheltenham and
Oxford are ~75km apart, which at any camera that frames both puts their labels
in the same gap — and flipping a side does not help, because both run into it.
§7e's rule still holds (flip or lift a LABEL, never move a dot), and the lift is
measured on the real build. It costs nothing elsewhere because no other scene
draws that marker.

**A panel is titled for its subject, not for its postcode.** The GCHQ scene was
titled "Cheltenham" with GCHQ as a section heading beneath it, which made the
geography the headline and the counterparty a subhead. It is now titled GCHQ,
and `Section.heading` became optional so the single point under it does not
repeat the word one line down in a smaller size. The marker keeps naming
Cheltenham — that is the map's job and §7e requires a site-level marker to name
its place. `verify.mjs` asserts the title and the absence of the heading, because
the failure mode is somebody helpfully adding it back.

**Acronyms are reproduced, not expanded** — "DBIST", "HMT", "ProQure", "AMCs",
"project Grizzly". The department is **DBIST**: supplied that way, "SoS BIST" in
the ninety-day source, and confirmed against the "DSIT" that the Westminster
marker used to carry. Both places that name it — the heading in `uk.ts` and the
`source` line in `institutions.ts` — now agree, and they are the two to change
if it ever moves.

## 7m. Africa — four blocs, and what a fill must refuse to say

Scene 37 lights ECOWAS, SADC, the EAC and COMESA together. The membership lists
and their audit notes came from the sibling project `bug-free-chainsaw`
(`organisations.ts`); what is added here is the fit to the layer contract.

**Four blocs, one fill, on purpose.** They overlap heavily — the DRC and
Tanzania sit in two, and nine more countries do — so `LAYERS` order decides a
shared country's tint and the map genuinely cannot say which bloc anyone is in.
It does not try. Four treatments do not exist: §7b measured that two stops of
the brand gradient differ by about a fifth of the distance from lit to unlit,
which a projector crushes, and four hues would make this a chart rather than an
instrument. So the fill states the footprint, and what the map DISTINGUISHES is
the four anchors. Precedence within the four is most-specific-first, broadest
last — COMESA is registered last because "one of twenty-one from Tunisia to
Eswatini" is the least informative thing to say about a country that is also in
the EAC.

**The anchor is derived, never typed** — the rule `africaGdp.ts` exists for. It
is the member with the largest nominal GDP, computed at load. An anchor written
by hand goes stale silently; a computed one is re-checked by updating one
number, and a bloc gaining a member cannot leave a wrong anchor behind because
the two are the same edit. Load-time assertions catch the one failure mode a
derived anchor introduces: a member with no GDP figure can never be the anchor,
silently. `verify.mjs` re-derives the four names independently of the panel.

**A tall continent decides the panel's shape.** Full width was the obvious
layout for four blocs and was wrong: Cairo to Pretoria is 56 degrees of
latitude, and a full-width panel takes that height off the top of the frame, so
the camera has to zoom out until either the Cape clips or Cairo falls off — the
map losing an anchor to make room for the panel describing it. A right-hand
panel costs width instead, which a continent 69 degrees across can spare and 72
degrees tall cannot. The blocs stack as rows, which also buys each one room for
its note. **Ask what the subject is short of before choosing a panel size.**

**It is the only content panel in the deck not marked internal**, and that is
deliberate: it states published membership of four intergovernmental bodies and
ranks their economies. Stamping it would make the stamp meaningless on the
panels that need one — if everything is internal, nothing reads as internal.
It also makes no IonQ claim at all; the deck has not done Africa yet, and this
is the map of the ground rather than a plan for it. A plan is a second scene and
a second file.

## 7l. The closing scene — going all the way back out

Scene 37 (`closing.ts`, `kind: 'asks'`) is four requests from the presenter to
the room. It carries **no camera, no layer, no selection and no marker**, and
every one of those absences is doing work.

**The reset is the argument.** The asks apply to every market, so finishing on
the sixth spoke of six would scope them to Lithuania by implication — silently,
because a zoomed map with a panel on it looks perfectly fine. Because scenes are
absolute and an omitted camera actively resets (§3a), "back out to the whole
region" needed nothing built: it is the ordinary act of entering a scene that
names no camera. It also lands on the same picture the region was introduced on
at scene 5, so the talk closes where it opened. `verify.mjs` asserts the fitted
frame, the empty layer set and the cleared selection.

**A fifth kind of claim, so a fifth source file.** `presenter` is personal,
`policy` is the EU's assessment of us, `strategy`/`poland`/`germany`/`uk`/
`lithuania` are what we intend to do in a market, `ninetyDays` is what has been
done. This is a request FROM the presenter TO his colleagues, in the first
person — which is why its voice reads differently from every other panel, and
why the file keeps it. **The first person is preserved, not neutralised**:
rewriting "I want to be there" into "Government Affairs should attend" would turn
a request between colleagues into a policy, a heavier thing to put on a screen,
and would be this project editing a person's words in the one place where whose
words they are is the point.

**`Ask` is not `Pillar`, though it renders almost identically.** A pillar is a
component of a strategy IonQ is executing; an ask is something being requested
of the people in the room. Same layout, different claim — §7g's rule applied to
a body kind rather than a source file — and it saves padding `Pillar`'s three
fields with empty strings. The index comes from position, as the pillars' does,
and is asserted.

**Laid across, not down.** Four numbered items in a column read as a priority
order, and the presenter would be asked which one matters most. Across, they are
four parts of one request. The columns use **subgrid** so index, title and body
line up across all four however long a title runs — one of them wraps to two
lines, and without it that column's text sits a line low, which reads as a
layout bug rather than as four equal asks.

**The target in ask 2 is the perishable part.** "Two agencies, two FTE by end of
year" is a commitment with a date on it; after that date the slide either reports
success or is out of date, and no build can work out which. The as-at stamp is
what makes a stale one visible.

## 8. Known limitations

- Ceuta, Melilla and Gibraltar are below 1:50m resolution. Fixing them means
  the 1:10m dataset, roughly five times the file size.
- The Golan Heights cannot be reassigned without hand-editing coordinates in a
  vendored dataset. Handled as a dashed line instead — see §4.
- The Azores fall outside the composed frame and are clipped by the viewport,
  as are the Americas and Asia. Madeira, the Canaries and the French overseas
  departments are inside their parent country features and are in scope; when
  you hover France, French Guiana and Réunion light up too. Accurate, and
  occasionally useful, but worth knowing before you present.
- The topology is ~740KB inlined into the JS bundle (~345KB gzipped). A
  deliberate trade: one file, no fetch, guaranteed offline.
