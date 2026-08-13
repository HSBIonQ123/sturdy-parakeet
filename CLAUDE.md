# IonQ EMEA Atlas — project conventions

This file is the contract between sessions. State 1 (base region map) is built.
States 2–4 are additive and must stay that way. Read this before changing
anything; if you change a decision recorded here, change it here too.

```
State 1  base EMEA region map                    <- BUILT
State 2  membership layers over the base map     <- STARTED: EU is the first
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

**On the orange.** `#FF8300` was sampled from `../assets/ionq-logo.webp`, the
official wordmark in this repository. The mark is a three-stop gradient
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

**The camera is the one imperative escape hatch.** `render/cameraControl.ts` is
a module-level registry that `Map` writes to on mount. The alternative — lifting
the zoom transform into the store — would re-render the map on every wheel tick
and leave d3 and the store arguing about which transform is authoritative.

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
npm run verify         # drive the real build in Chromium; 29 assertions
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
