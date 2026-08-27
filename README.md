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
| 06 | Government Affairs | the state-change agent — four state changes in ninety days (internal) |
| 07 | Portfolio risk register | seven exposures and where each one stands (internal) |
| 08 | European Union | the 27, solid |
| 09 | EEA, EFTA and the UK | the 27, plus five states hatched |
| 10 | Horizon Europe | the 27, plus 19 associated states hatched |
| 11 | EuroQCI | the 27 signatories, 3 eligible states, and the four IonQ QKD networks marked |
| 12 | Priority European Political Engagement | six states — UK, Belgium, Lithuania, Poland, Italy, Germany |
| 13 | United Kingdom | Westminster and Oxford; DBIST, HMT and Number 10 (internal) |
| 14 | United Kingdom | GCHQ and Oxford — cryptanalysis (internal) |
| 15 | United Kingdom | Daresbury and Oxford — a system proposed (internal) |
| 16 | Priority European Political Engagement | back out to the six |
| 17 | Belgium | close up, held selected, Brussels marked |
| 18 | EU procurement | PPA — situation and risk (internal) |
| 19 | EU procurement | PPA — timeline and next steps (internal) |
| 20 | EU Quantum Act | situation and risk (internal) |
| 21 | EU Quantum Act | timeline and next steps (internal) |
| 22 | EU Quantum Act | seven-stage engagement timeline, "you are here" at Aug 2026 (internal) |
| 23 | EU Quantum Act | the five core asks, before there is bill text (internal) |
| 24 | Priority European Political Engagement | back out to the six |
| 25 | Italy | close up, held selected, Rome marked |
| 26 | Italy and Brussels | the influence circuit — top-down and bottom-up (internal) |
| 27 | Priority European Political Engagement | back out to the six |
| 28 | Germany | close up, held selected, Berlin marked |
| 29 | Franco-German position paper | the top lines, the assessment, the engagement (internal) |
| 30 | Germany | the five state changes to drive in the bill (internal) |
| 31 | Priority European Political Engagement | back out to the six |
| 32 | Poland | close up, held selected, Warsaw marked |
| 33 | Poland | engagement strategy in four pillars (internal) |
| 34 | Priority European Political Engagement | back out to the six |
| 35 | Lithuania | close up, held selected, Vilnius marked |
| 36 | Lithuania | stakeholder map — three groups, six meetings (internal) |
| 37 | Africa | four regional blocs — ECOWAS, SADC, EAC, COMESA — and their anchors |
| 38 | Gulf Cooperation Council | six member states, capitals marked |
| 39 | Middle East | the route in — UK–GCC, the beachhead, the barrier (internal) |
| 40 | Middle East | two workstreams — quick wins and the moat (internal) |
| 41 | Middle East | the 120-day sprint — three phases, three gates (internal) |
| 42 | What I need from you | back out to the whole region; four asks (internal) |

**Scenes 1 to 4 are the opening**: the map of the UK with Salisbury marked, then
three deep-focus scenes whose panels — family, career, why IonQ — are tethered to
the Salisbury dot by a leader line. The camera does not move between them, so
each click adds content rather than moving the map. The fifth click pulls out to
the region. It is the only scene in the deck that
opens zoomed, which is why `Map.tsx` applies the first scene's camera on mount —
nothing ever *steps into* scene 1, so `gotoScene` never runs for it.

Scenes 12 to 36 are **hub and spoke**: the six priority states at region scale,
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

**Scenes 18 to 23 are the live EU files** — the Public Procurement Regulation and
the Quantum Act — reproduced verbatim from two Government Affairs information
boxes. They sit **inside the Belgium spoke**, because that is where the talk is
already standing: Belgium closes up, these push in on Brussels, and the hub that
follows returns to the six. They are **internal**, stamped as such on screen with
their as-at date. Scene 22 is the seven-stage engagement timeline, with a pulsing
"you are here" marker on the stage the talk is standing in, and scene 23 closes the
block with the five core asks — condensed, not verbatim, and the panel says so.

**Scene 26 is the Italy circuit**, and it sits inside the Italy spoke for the same
reason: the talk is already standing in Italy, so the argument about what Italy is
*for* belongs there rather than beside a layer scene. Its panel is a diagram —
Brussels and Rome as two terminals, with a conductor running each way between
them. Bottom-up is Italy as a route into EU decision-making, carrying the two
levers the slide is built on: a member state assessed as among the most supportive
of American companies operating in the Union, and an existing AISI relationship to
be leveraged into ENISA decision-making and the standard-setting after it.
Top-down is the return path — what Brussels settles is what decides the Italian
sale, which is the procurement and Quantum Act files seen from the other end. It
is the one scene whose camera holds two capitals, because the diagram names both.
Internal, and stamped.

**Scenes 6 and 7 open with the function itself**, before the first perimeter is
drawn: four state changes delivered in ninety days, and the portfolio risk
register behind them. The state-change grid draws each row's two states with the
map's own marker grammar — a hollow ring for the state that was, a ring with a
bright core for the state that is — and runs one labelled drive down the gutter
every row crosses, so the layout is what claims a single function moved all of
them. The risk register carries severity as a three-segment meter that gets
shorter rather than as red/amber/green, for the reason `CLAUDE.md` §7b gives
about the projector; its arrows are derived from the meters either side of them,
never stored, so a row can never point a way its own numbers contradict. The
register is also the only place the exposure count lives — the summary sentence
on scene 6 and the caption on scene 7 are both counted from it, so the two can
never disagree the way the source deck's two pages did.

**The market panels sit inside their spokes**, on the same argument: Germany
carries the Franco-German position paper and the five state changes to drive out
of it; Poland carries its four-pillar strategy side by side rather than in
sequence, so the shape of the approach is one picture; and the deck ends in
Lithuania on the stakeholder map — a plan rather than a picture, because
Lithuania holds the Council Presidency when the Quantum Act is debated. All of them are internal and stamped.

**Scenes 13 to 15 are the UK block**, inside the UK spoke on the same argument:
the talk is already standing in Britain. Westminster carries the current
engagement priorities — DBIST on ecosystem opportunities, HMT on a purchase
agreement, ProQure reform and AMCs, and Number 10 on positioning against the
field. The two that follow each fly the camera to the place their sentence is
about, with Oxford held on screen as the other end of the relationship: GCHQ on
cryptanalysis, at Cheltenham, and Daresbury for a proposed system. Nothing is installed at Daresbury,
and its dot is drawn without the IonQ core to say so.

**Scene 37 is Africa** — the four regional economic communities, ECOWAS, SADC,
the EAC and COMESA, with the anchor country of each. It sits at the end of the
market walk because it is the one part of the region the talk has not been to:
the six spokes are all European, and asking for country-by-country plans "for all
your markets" one scene later would leave the largest part of EMEA unmentioned.

The blocs overlap heavily — the DRC and Tanzania are in two, nine more countries
are in two — so precedence decides a shared country's fill and **the map cannot
say which bloc a country is in. It does not try.** This palette has two
treatments and there are four blocs. What the map distinguishes instead is the
**anchor**: the largest economy in each, marked at its capital. Those are
derived from a GDP ranking rather than typed, so a membership change moves the
anchor and the panel together and there is no second place to fall out of step.
The membership lists and their audit notes came across from the sibling project
`bug-free-chainsaw`.

**Scene 38 is the Gulf** — the GCC's six member states and their capitals. One
layer, one tier, no panel: the Council has no associate status and no observer
ring that belongs on a map, so there is nothing for a hatch to say and six
countries with six capitals is the whole content. The contrast to watch is Iraq,
which is in scope on this map and not a member, so it sits lit as land and dark
as a member right against Kuwait and Saudi Arabia.

**Scenes 39 to 41 are the Gulf strategy**, inside the GCC scene on the same
placement argument the EU files and the UK block use: the region has just been
established, so what IonQ intends to do about it belongs there. The route in is
the UK — the UK–GCC Free Trade Agreement is the first the Gulf has signed with a
G7 state — defending a contested beachhead at TII in Abu Dhabi, against national
programmes in Saudi Arabia, the UAE and Qatar that are government-led and
therefore a political gate as much as an opportunity. Then two workstreams on
different clocks, and a 120-day sprint whose three phases each end in a decision
gate. Condensed from a memo rather than reproduced verbatim, and the panels say
so — the memo's own caveat, that it was written without internal consultation
and against public information, is carried on all three.

**Scene 42 closes the talk by going all the way back out.** No camera, no layer,
no marker — the fitted EMEA frame, the same picture the region was introduced on
thirty scenes earlier. That is not a feature: an omitted camera *actively resets*,
so "back out to the whole region" is the ordinary act of entering a scene that
names no camera. The four asks are laid across rather than down, because they are
four parts of one request and a numbered column reads as a priority order. The
panel points at nothing, because it is about how the team works rather than about
a place.

**Callout panels** are listed per scene by id — `callouts: ['career']` — and
resolved against the registry in `src/data/callouts.ts`, whose sources are
`presenter.ts` (personal), `policy.ts` (the internal EU assessments) and
`strategy.ts` (what IonQ intends to do about them, and through which
relationship). A panel is HTML so the browser wraps
its text; its leader line is SVG, drawn from the panel to the dot of the marker
it names. The family glyphs are line icons drawn in `render/FigureIcon.tsx` —
strokes on a shared grid, at the same weight as every other hairline on the map,
because a filled silhouette reads as clip-art pasted onto an instrument.

**Markers** are listed per scene by id — `markers: ['westminster', 'oxford']` —
and resolved against the registry in `src/data/markers.ts`. Each is drawn as an
ion held in the trap: a bright core, a containing ring, a soft halo, sitting on
the same conductor network the borders form.

There are four sources, kept apart because they claim different things.
`deployments.ts` says IonQ has something at a place, entry by entry, with
provenance; that list is partly supplied and partly reconstructed from public
announcements, so **confirm it before presenting.** A scene can take a whole
category of it rather than a hand-written list: the EuroQCI slide asks for the
national QKD networks and gets exactly those four, so QuantumBasel and Oxford
Ionics — both true, both outside the programme's perimeter — stay off a slide
whose argument is that IonQ is already inside it. `institutions.ts` says only
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

Drives the production bundle in headless Chromium and asserts 86 things,
including: zero network requests leave the origin; every country renders; the
arc partition is total and disjoint, so no border is drawn twice; `Page Down`
and `Page Up` actually step the deck (the clicker path — if that breaks, the
talk cannot be driven from anywhere but the laptop); the menu does not let the
deck step underneath it; a scene restores the camera after improvised zooming;
the membership tiers separate on shape and the legend matches the map; no
border segment is stroked by two layer circuits; Liechtenstein and the Faroes
swap sides between scenes 3 and 4, so the research area can never quietly
become a copy of the single market; the four IonQ QKD networks sit inside
EuroQCI signatory states and are the only markers on that slide, so it can
never quietly start making the opposite argument; the closing engagement scene lights exactly its six states
and no EU or EEA member leaks into it, so a selection can never drift into
looking like a bloc; the Italy circuit runs one arm each way and both rails meet
both terminals, because a diagram argues through its shape and two arrows
pointing the same way would render perfectly while meaning something nobody
wrote; a zoomed scene arrives at its camera and gives it back on
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
