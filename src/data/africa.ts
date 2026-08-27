/**
 * africa.ts — the African regional blocs panel.
 *
 * EVERYTHING ON IT IS DERIVED EXCEPT THE NOTES. The member counts come from
 * `members.length`, the anchors from the GDP ranking in `africaGdp.ts`, and the
 * abbreviations and names from the layers themselves. Nothing here restates a
 * fact that lives in `layers/africaBlocs.ts`, so a bloc gaining a member updates
 * its count and — if the new member is large enough — its anchor, with no second
 * place to keep in step. That is the risk register's lesson (§7j rule 3) applied
 * before the mistake rather than after it.
 *
 * The anchor capitals are markers on the scene, resolved the same way: the
 * marker ids come from the derived anchor list, so the dots and the panel cannot
 * disagree about which four countries these are.
 *
 * NO STANDFIRST. It used to carry one explaining that the blocs overlap, so the
 * fill cannot say which bloc a country is in. That is true and it is why the
 * scene is built the way it is (see layers/africaBlocs.ts), but it is an
 * explanation of the DESIGN rather than a fact about Africa — the slide was
 * apologising for its own legend. The four blocs, their anchors and their notes
 * are the content; a room does not need to be told what the fill is not saying.
 *
 * NOT MARKED INTERNAL, and this is the only content panel in the deck that is
 * not. It states published membership of four intergovernmental organisations
 * and ranks their economies — every word of it is public fact. Stamping it would
 * make the stamp meaningless on the panels that need it: if everything is
 * internal, nothing reads as internal.
 *
 * IT ALSO MAKES NO IonQ CLAIM. There is no strategy on this slide, no ask, no
 * named relationship — the deck has not done Africa yet, and this scene is the
 * map of the ground rather than a plan for it. If a plan arrives, it is a second
 * scene and a second file; do not grow this one into it, for the reason §7g
 * gives about sources that make different claims.
 */
import type { BlocEntry, Callout } from './callouts';
import { AFRICA_BLOCS, ANCHOR_OF } from './layers/africaBlocs';
import { DISPLAY_NAME } from './iso';

/**
 * Built from the layers, not written out.
 *
 * The one thing worth noticing: `anchor` goes through DISPLAY_NAME, so the
 * panel prints the curated display name rather than an alpha-3 or, worse,
 * Natural Earth's 2018-vintage `properties.name` (§5 — never trust it).
 */
const ENTRIES: readonly BlocEntry[] = AFRICA_BLOCS.map((bloc) => ({
  id: bloc.id,
  abbr: bloc.label,
  fullName: bloc.fullName,
  aka: bloc.aka,
  memberCount: bloc.members.length,
  anchor: DISPLAY_NAME[ANCHOR_OF[bloc.id]] ?? ANCHOR_OF[bloc.id],
  note: bloc.note,
}));

export const AFRICA_BLOCS_PANEL: Callout = {
  id: 'africa-blocs',
  heading: 'Africa · regional economic communities',
  title: 'Four blocs, four anchors',
  /*
   * WIDE AND ON THE RIGHT, NOT FULL — and this was the second attempt.
   *
   * Full width was the obvious choice for four blocs and it is wrong here, for
   * a reason specific to the subject: Africa is TALL. Cairo to Pretoria is 56
   * degrees of latitude, and a full-width panel takes that height off the top of
   * the frame, so the camera has to zoom out until the Cape clips or Cairo falls
   * off — the map losing an anchor to make room for the panel describing it.
   *
   * A right-hand panel costs the map width instead, which a continent 69 degrees
   * across can afford at this scale and 72 degrees tall cannot. The four blocs
   * stack as rows, which also gives each one room for its note.
   *
   * NO ANCHOR FIELD AND SO NO LEADER, though `wide` panels normally take one:
   * this panel has four subjects, and a line to any single capital would pick a
   * favourite it deliberately does not.
   */
  size: 'wide',
  side: 'right',
  body: { kind: 'blocs', blocs: ENTRIES },
  sources:
    'Membership as of August 2026; each bloc’s note carries the accessions and departures ' +
    'behind its list. Anchors are derived from 2025 nominal GDP estimates (IMF WEO basis) ' +
    'and are a ranking, not a citable figure — see data/africaGdp.ts.',
};

export const AFRICA_CALLOUTS: readonly Callout[] = [AFRICA_BLOCS_PANEL];
