# Vendored boundary data

**File:** `countries-50m.json`
**Upstream:** `world-atlas@2.0.2` / `countries-50m.json`
**Ultimate source:** Natural Earth 4.1.0, Admin 0 — Countries, 1:50m (public domain)
**Regenerate:** `npm run prepare:geo`

Do not hand-edit this file. It is written by `scripts/prepare-geo.mjs`, which
applies exactly one geometric patch to upstream and then asserts the invariants
the render layer depends on. Re-running the script from a fresh `world-atlas`
install must reproduce it byte for byte.

## Changes applied to upstream

- Crimea moved from Russia (643) to Ukraine (804); Russia 99 -> 98 polygons, Ukraine 2 -> 3.
- id-less features (resolved by name in iso.ts): Indian Ocean Ter., Kosovo, N. Cyprus, Siachen Glacier, Somaliland
- arcs: 1959 total, 1597 used once (coastline), 362 used twice (shared)

## Not changed here

Display names, ISO alpha-3 resolution, EMEA scope and disputed-boundary
treatment are all resolved at load time — see `src/data/iso.ts`,
`src/data/regions.ts` and `src/data/disputed.ts`. Natural Earth's own
`properties.name` values are 2018-vintage (they read "Macedonia", "Turkey")
and are used for nothing except keying the three id-less de facto entities.
