/**
 * capitalMarkers.ts — every EMEA capital, as a marker.
 *
 * This is the drop-in `capitals.ts` was written for in State 1: "the ions held
 * in the trap are already sited, typed and annotated". Nothing here restates a
 * coordinate or a name — the whole file is a projection of CAPITALS into the
 * marker shape, so a correction to capitals.ts moves the dot and there is no
 * second list to keep in step.
 *
 * All 125 are built, not just the ones a scene uses today. They cost nothing
 * until a scene names one: `resolveMarkers` filters the registry by the ids the
 * active scene listed, so an unused capital is a few bytes of object and never
 * a DOM node. The point is that adding a country scene later is a camera and
 * `capital('XXX')`, with no data work at all.
 *
 * A CAPITAL IS NOT AN IonQ PRESENCE, so it is drawn without the bright core,
 * exactly like an institution — see render/Markers.tsx. The kinds are separate
 * because the files make different claims: capitals.ts is a gazetteer,
 * institutions.ts asserts that a place matters. What the eye needs to
 * distinguish is narrower than that and never changes: IonQ is here, or IonQ is
 * not.
 */
import type { Marker } from './markers';
import { CAPITALS } from './capitals';

/** The marker id for a country's capital. `capital('BEL')` in a scene. */
export function capital(iso: string): string {
  return `capital-${iso}`;
}

export const CAPITAL_MARKERS: readonly Marker[] = CAPITALS.map((c) => ({
  id: capital(c.iso),
  label: c.name,
  place: c.name,
  iso: c.iso,
  lat: c.lat,
  lon: c.lon,
  kind: 'capital' as const,
  // The coordinate IS the city, so this is honest at `site` precision. It is
  // the one thing §7e will not let a marker fudge.
  precision: 'site' as const,
  detail: 'Capital',
  source:
    'src/data/capitals.ts — city centre to ~0.01 degrees. Contested cases carry ' +
    'their facts there and this file asserts no status beyond the name.',
}));
