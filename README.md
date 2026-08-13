# IonQ EMEA Atlas

An offline, browser-based interactive map of Europe, the Middle East and Africa,
built to be presented live to policymakers. It replaces PowerPoint for
government-affairs briefings and it never touches the network.

**An opening screen, the base region map, a scene sequencer, membership layers
for the EU 27, the EEA/EFTA/UK, Horizon Europe and EuroQCI, IonQ deployment
markers, and a hub-and-spoke walk through the six priority states with their
capitals.** See `CLAUDE.md` for the conventions that keep each addition
additive.

The deck as it stands:

| # | Scene | Shows |
| --- | --- | --- |
| 01 | Salisbury | the opening screen — the UK held, Salisbury marked |
| 02 | Salisbury | deep focus, family panel tethered to the dot |
| 03 | Salisbury | deep focus, career panel |
| 04 | Salisbury | deep focus, why IonQ |
| 05 | Base region | 124 EMEA countries, nothing highlighted |
| 06 | European Union | the 27, solid |
| 07 | EEA, EFTA and the UK | the 27, plus five states hatched |
| 08 | Horizon Europe | the 27, plus 19 associated states hatched |
| 09 | EuroQCI | the 27 signatories, 3 eligible states, and IonQ deployments marked |
| 10 | Priority European Political Engagement | six states — UK, Belgium, Lithuania, Poland, Italy, Germany |
| 11 | United Kingdom | the camera flies in; Westminster and Oxford marked |
| 12 | Priority European Political Engagement | back out to the six |
| 13 | Belgium | close up, held selected, Brussels marked |
| 14 | Priority European Political Engagement | back out to the six |
| 15 | Italy | close up, held selected, Rome marked |
| 16 | Priority European Political Engagement | back out to the six |
| 17 | Germany | close up, held selected, Berlin marked |
| 18 | Priority European Political Engagement | back out to the six |
| 19 | Poland | close up, held selected, Warsaw marked |
| 20 | Priority European Political Engagement | back out to the six |
| 21 | Lithuania | close up, held selected, Vilnius marked |

**Scenes 1 to 4 are the opening**: the map of the UK with Salisbury marked, then
three deep-focus scenes whose panels — family, career, why IonQ — are tethered to
the Salisbury dot by a leader line. The camera does not move between them, so
each click adds content rather than moving the map. The fifth click pulls out to
the region. It is the only scene in the deck that
opens zoomed, which is why `Map.tsx` applies the first scene's camera on mount —
nothing ever *steps into* scene 1, so `gotoScene` never runs for it.

Scenes 10 to 21 are **hub and spoke**: the six priority states at region scale,
then one of them close up, then back out to the six, then the next. Every
country is introduced against the whole selection rather than in isolation, and
stepping out is what makes the next zoom mean something. It needed no new
machinery — a hub is just the engagement scene with no `camera`, and because
scenes are absolute, omitting the camera *actively returns* to the fitted frame.

Each spoke holds its country **selected**, which draws the bright motionless
outline that separates the subject from its neighbours — at Lithuania's camera,
Poland fills a third of the frame in the same orange — and fills the readout
with that country's name, code, capital and region.

## Run it

```sh
npm install
npm run dev
```

For presenting, build first and serve the build — this is the path that is
verified to work with the wifi off:

```sh
npm run build
npm run preview
```

Press `F` for fullscreen once it is open.

## Presenting with it

**The deck is driven by a clicker.** `Page Down` and `Page Up` step forward and
back through the scenes — those are the keys almost every presentation remote
sends, and the only ones most of them send. Arrows and `Space` do the same at
the machine.

A clicker can only say "next", so for questions there is the **scene menu**:
press `M` or click **Scenes** in the corner, and jump straight to any scene.
It is closed and out of the DOM by default, because during the talk the map
should be the only thing on screen.

Stepping into a scene always restores the picture you rehearsed — layers,
camera and all. Zoom wherever you like while answering a question; the next
`Page Down` puts everything back.

| Action | How |
| --- | --- |
| Next / previous scene | `Page Down` / `Page Up`, `→` `↓` / `←` `↑`, `Space` |
| First / last scene | `Home` / `End` |
| Jump to a scene | `M`, or the **Scenes** button |
| Inspect | Hover a country. The readout shows name, ISO code, capital and region. |
| Hold | Click to pin a selection; it survives the pointer moving away. |
| Clear selection / close menu | `Esc` |
| Camera | Drag to pan, wheel to zoom, 1× to 24×. The map cannot be lost off-frame. |
| Reset camera | `R` |
| Fullscreen | `F` |

The boot sequence — the border network energising from dark — plays once on
load and is skipped by any key or click. Turn it off in
`src/render/borderConfig.ts` (`boot.enabled`).

## Editing the talk

`src/scenes/deck.ts` is one ordered array, and that array **is** the talk.
Reordering means moving a block; adding a scene means adding an object:

```ts
{
  id: 'nato',
  title: 'NATO',
  caption: '32 allies',
  layers: ['nato'],
  camera: { lon: 10, lat: 50, k: 2.4 },   // omit for the full EMEA frame
}
```

Omitting `camera` is meaningful: it means "return to the fitted frame", not
"leave the camera alone". Scenes are absolute so that a rehearsed picture is
reproducible after any amount of improvisation.

**Callout panels** are listed per scene by id — `callouts: ['career']` — and
resolved against `src/data/presenter.ts`. A panel is HTML so the browser wraps
its text; its leader line is SVG, drawn from the panel to the dot of the marker
it names. **The silhouettes in `src/assets/silhouettes/` are placeholders** —
replacing them is two import lines in `presenter.ts` and no other change.

**Markers** are listed per scene by id — `markers: ['westminster', 'oxford']` —
and resolved against the registry in `src/data/markers.ts`. Each is drawn as an
ion held in the trap: a bright core, a containing ring, a soft halo, sitting on
the same conductor network the borders form.

There are four sources, kept apart because they claim different things.
`deployments.ts` says IonQ has something at a place, entry by entry, with
provenance; that list is partly supplied and partly reconstructed from public
announcements, so **confirm it before presenting.** `institutions.ts` says only
that a place matters — Westminster is where the decision is taken, not somewhere
IonQ sits. `capitals.ts` is a gazetteer — all 125 EMEA capitals, projected into
markers, so a country close-up names its capital with no new data. `places.ts`
says only "here", for a location the deck points at without a claim.

Everything except an IonQ site is drawn **without the bright core**, since the
core is what says "IonQ is here". Shape carries the distinction, not a second
colour.

A membership layer is a file in `src/data/layers/` containing an array of
alpha-3 codes and nothing else. When one is active, its members take the orange
tint, everything else in EMEA recedes, and the **borders between members
energise** — the bloc reads as a powered region of the same chip rather than a
shape coloured in on top of the map.

Layers stack. Scene 7 runs `['eu', 'eea-efta-uk']`: the 27 stay exactly as they
were on scene 6, and five more states arrive **hatched in amber**. Solid means
member, hatched means associated. That is not decoration — the IonQ gradient is
a hue rotation inside the orange band, so at the alpha a fill needs, two stops
differ by about a fifth of the distance between a lit country and an unlit one.
Colour alone would vanish on a projector; shape does not. `CLAUDE.md` §7b has
the numbers.

Scene 10 is a different kind of layer and is labelled as one. The scenes before
it draw perimeters you can look up — the 27, the EEA, Horizon association,
the EuroQCI Declaration. The last draws a **selection**: six states where
engagement is focused, who are not members of anything in common. So the layer
is called "Priority political engagement", the caption on screen reads "a
selection, not a bloc", and the file records no reasons for the countries that
are absent, because there is no published rule to point at. It is also the
scene where the UK lights up for the first time, having sat outside all four
perimeters before it. Treat the list like `deployments.ts` and confirm it
before presenting — a stale priority list is the one thing on this map that
looks exactly like a current one.

## What you are looking at

National borders inside EMEA are live electrode traces: every boundary glows in
the unpowered conductor colour and carries a travelling pulse of light, as
though the map were a powered ion-trap chip. That is the one place boldness is
spent. Everything else — graticule, coastlines, chrome — stays quiet so the
borders carry the room.

- **Solid, pulsing** — a border between two in-scope EMEA states.
- **Dashed** — a de facto administrative line, not an agreed international
  boundary. Never pulses. Every such case is registered in
  `src/data/disputed.ts` with the reason and the coordinates used to verify it.
- **Dim** — out of scope. Rendered in its true geographic position, never
  clipped.

The bottom strip is real telemetry, not decoration: countries in scope,
projection and central meridian, camera scale, active layer count, current
selection, mesh composition, and the border-partition integrity check. If a
number there looks wrong, it *is* wrong.

## Tuning it

Everything about the border animation lives in `src/render/borderConfig.ts` —
pulse speed, comet profile, glow, breathe, attenuation, the optional arc-flash
discharge, hover weights, dash patterns. No render code encodes a number, so
you can adjust these live during rehearsal and see the result on save.

The values worth knowing:

| Key | What it does |
| --- | --- |
| `pulseSpeed` | Travel in px/s. Slow reads as expensive; fast reads as a loading spinner. |
| `pulseGap` | Dark gap between charges. Keep the lit fraction under ~10% or it degrades into marching ants. |
| `pulseProfile` | The comet: a short bright core inside a longer dim tail. |
| `attenuate` | Runs bright on load, then settles so the map calms down once you start speaking. |
| `arcFlash` | One random segment discharges to near-white every few seconds. Off by default. |
| `breathe` | Slow global oscillation. Should be felt, not seen. |

`prefers-reduced-motion` is honoured: the network holds as a static lit border
at mid brightness and nothing on screen moves.

## Verifying it

```sh
npm run build && npm run verify
```

Drives the production bundle in headless Chromium and asserts 78 things,
including: zero network requests leave the origin; every country renders; the
arc partition is total and disjoint, so no border is drawn twice; `Page Down`
and `Page Up` actually step the deck (the clicker path — if that breaks, the
talk cannot be driven from anywhere but the laptop); the menu does not let the
deck step underneath it; a scene restores the camera after improvised zooming;
the membership tiers separate on shape and the legend matches the map; no
border segment is stroked by two layer circuits; Liechtenstein and the Faroes
swap sides between scenes 3 and 4, so the research area can never quietly
become a copy of the single market; the four IonQ QKD networks sit inside
EuroQCI signatory states, so the slide can never quietly start making the
opposite argument; the closing engagement scene lights exactly its six states
and no EU or EEA member leaks into it, so a selection can never drift into
looking like a bloc; a zoomed scene arrives at its camera and gives it back on
the way out, and no marker label runs off the frame while it is there;
Westminster is drawn without the IonQ core that Oxford has, so a seat of
government can never start reading as a site IonQ occupies; the whole
hub-and-spoke tail is walked with the clicker and every hub must give the camera
and the selection back while every spoke must zoom and say which country it is
about; the hovered outline is
unanimated and at full opacity while the ambient pulse is running; and the
frame rate at 2560×1440. Screenshots land in `screenshots/`, with
close-ups of Luxembourg, Slovenia, Lesotho, Gambia, the Gulf, Cyprus, Crimea
and the Horn — where double-drawing would show first.

## Data

Natural Earth 1:50m Admin 0 boundaries, vendored via `world-atlas@2.0.2` and
committed. Regenerate with `npm run prepare:data`.

Natural Earth 4.1.0 is 2018-vintage, which has consequences that are handled
explicitly rather than inherited: its display names are stale (it says
"Macedonia" and "Turkey"), three de facto entities carry no ISO code and would
be silently dropped by a numeric join, and **it assigns Crimea to Russia**. All
three are dealt with at build time; see `CLAUDE.md` §4 and `src/data/disputed.ts`
for the full register and the reasoning behind each call.
