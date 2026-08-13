# IonQ EMEA Atlas

An offline, browser-based interactive map of Europe, the Middle East and Africa,
built to be presented live to policymakers. It replaces PowerPoint for
government-affairs briefings and it never touches the network.

**State 1 of 4 — the base region map.** Later states add membership layers,
capital deep-dives, and a scene sequencer. See `CLAUDE.md` for the conventions
that keep those additive.

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

## Controls

| Action | How |
| --- | --- |
| Inspect | Hover a country. The readout shows name, ISO code, capital and region. |
| Hold | Click to pin a selection; it survives the pointer moving away. |
| Clear | `Esc` |
| Camera | Drag to pan, wheel to zoom, 1× to 8×. The map cannot be lost off-frame. |
| Reset camera | `R` |
| Fullscreen | `F` |

The boot sequence — the border network energising from dark — plays once on
load and is skipped by any key or click. Turn it off in
`src/render/borderConfig.ts` (`boot.enabled`).

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

Drives the production bundle in headless Chromium and asserts 17 things,
including: zero network requests leave the origin; every country renders; the
arc partition is total and disjoint, so no border is drawn twice; the hovered
outline is unanimated and at full opacity while the ambient pulse is running;
and the frame rate at 2560×1440. Screenshots land in `screenshots/`, with
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
