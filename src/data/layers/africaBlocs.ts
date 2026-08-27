/**
 * africaBlocs.ts — the four African regional economic communities, and the
 * anchor country of each.
 *
 * Brought across from the sibling project `bug-free-chainsaw`, whose
 * `organisations.ts` states the same four memberships with the same audit
 * notes. The membership lists and the notes are its work; what is added here is
 * the fit to this project's layer contract (§3) and the four scenes' worth of
 * argument about how they are drawn.
 *
 * ============================================================================
 * MEMBERSHIP IS AS OF AUGUST 2026, and every departure, accession and
 * suspension that affects these lists is recorded in the layer's own note.
 * This is a live political question and the notes are the audit trail: if you
 * change a list, change its note in the same commit.
 * ============================================================================
 *
 * THE ANCHOR IS DERIVED, NEVER TYPED — the rule this whole file is organised
 * around, and the reason `africaGdp.ts` exists. The anchor is the member with
 * the largest nominal GDP, computed at load. An anchor written by hand is a
 * claim that goes quietly stale; a computed one is a claim you re-check by
 * updating one number, and a bloc gaining or losing a member cannot leave a
 * wrong anchor behind because the two are the same edit.
 *
 * THEY OVERLAP HEAVILY, AND THAT IS THE HARD PART. The DRC is in both SADC and
 * the EAC. Tanzania is in both. Zambia, Zimbabwe, Malawi, Madagascar, Mauritius,
 * the Seychelles, the Comoros and Eswatini are in both SADC and COMESA; Burundi,
 * Kenya, Rwanda, Somalia and Uganda are in both the EAC and COMESA. `LAYERS`
 * order is precedence (§3), so the order these are registered in decides which
 * bloc wins a shared country's fill — precedence as data rather than code.
 *
 * WHICH MEANS THE MAP CANNOT TELL YOU WHICH BLOC A COUNTRY IS IN, AND MUST NOT
 * PRETEND TO. Four fills would need four treatments, and this palette has two:
 * solid and hatched (§7b measured why — two stops of the brand gradient differ
 * by about a fifth of the distance from lit to unlit, which a projector
 * crushes). Four hues would make it a chart rather than an instrument.
 *
 * So the scene does not try. All four blocs take the one member tint, and what
 * the map distinguishes is the FOUR ANCHORS — the countries whose capitals the
 * markers name and whose economies make them the way in. That is the honest
 * split: the fill says "this is the footprint of Africa's regional economic
 * communities", the anchors say "these four are where you start", and the panel
 * carries the membership detail that no fill could.
 */
import type { Alpha3 } from '../iso';
import type { MembershipLayer } from './index';
import { GDP_USD_BN } from '../africaGdp';

/**
 * A bloc is a MembershipLayer plus the things a bloc has and a layer does not:
 * a full name, and a note that is an audit trail rather than a caption.
 */
export interface AfricaBloc extends MembershipLayer {
  /** Spelled out, for the panel. */
  readonly fullName: string;
  /** Other names the same body goes by. */
  readonly aka?: string;
  /** The audit trail. Why this list is this list, as of the date above. */
  readonly note: string;
}

export const ECOWAS: AfricaBloc = {
  id: 'ecowas',
  label: 'ECOWAS',
  fullName: 'Economic Community of West African States',
  description: 'Economic Community of West African States',
  members: [
    'BEN', 'CPV', 'CIV', 'GMB', 'GHA', 'GIN', 'GNB', 'LBR', 'NGA', 'SEN',
    'SLE', 'TGO',
  ],
  note:
    'Twelve members. Burkina Faso, Mali and Niger left on 29 January 2025 after ' +
    'notifying withdrawal in January 2024, and are deliberately not drawn as ' +
    'members — the three of them are the reason this bloc is a smaller shape on ' +
    'the map than most audiences expect. Cabo Verde is a member and is drawn ' +
    'even though it is offshore.',
};

export const SADC: AfricaBloc = {
  id: 'sadc',
  label: 'SADC',
  fullName: 'Southern African Development Community',
  aka: 'sometimes written SADAC',
  description: 'Southern African Development Community',
  members: [
    'AGO', 'BWA', 'COM', 'COD', 'SWZ', 'LSO', 'MDG', 'MWI', 'MUS', 'MOZ',
    'NAM', 'SYC', 'ZAF', 'TZA', 'ZMB', 'ZWE',
  ],
  note:
    'Sixteen members. The Comoros joined in 2018 and Madagascar was readmitted ' +
    'in 2014. Overlaps both COMESA and the EAC — the DRC and Tanzania sit in ' +
    'more than one of these blocs, which is why the precedence order in ' +
    'layers/index.ts is load-bearing rather than cosmetic.',
};

export const EAC: AfricaBloc = {
  id: 'eac',
  label: 'EAC',
  fullName: 'East African Community',
  description: 'East African Community',
  members: ['BDI', 'COD', 'KEN', 'RWA', 'SSD', 'SOM', 'TZA', 'UGA'],
  note:
    'Eight members. The DRC acceded in 2022 and Somalia in 2024, which is why ' +
    'this bloc now reaches from the Atlantic coast to the Gulf of Aden — a fact ' +
    'the map makes obvious and a membership list does not.',
};

export const COMESA: AfricaBloc = {
  id: 'comesa',
  label: 'COMESA',
  fullName: 'Common Market for Eastern and Southern Africa',
  description: 'Common Market for Eastern and Southern Africa',
  members: [
    'BDI', 'COM', 'COD', 'DJI', 'EGY', 'ERI', 'SWZ', 'ETH', 'KEN', 'LBY',
    'MDG', 'MWI', 'MUS', 'RWA', 'SYC', 'SOM', 'SDN', 'TUN', 'UGA', 'ZMB',
    'ZWE',
  ],
  note:
    'Twenty-one members, from Tunisia to Eswatini. Tunisia joined in 2018. The ' +
    'largest of these four by membership and the one that overlaps the others ' +
    'most, which is why it is registered last: it should not take the fill of a ' +
    'country whose more specific bloc is also on screen.',
};

/**
 * Registration order, and therefore PRECEDENCE order where a country belongs
 * to more than one.
 *
 * Most specific first, broadest last. ECOWAS overlaps nothing here, so it could
 * sit anywhere. SADC and the EAC each take their shared members before COMESA
 * can, which is the right way round: COMESA is a common market of twenty-one
 * from Tunisia to Eswatini, so it is the least informative thing to say about a
 * country that is also in the EAC.
 */
export const AFRICA_BLOCS: readonly AfricaBloc[] = [ECOWAS, SADC, EAC, COMESA];

/* ------------------------------------------------------------------ *
 * Anchors, derived.
 * ------------------------------------------------------------------ */

/**
 * The largest member by nominal GDP.
 *
 * Ties are impossible at this precision, but the reduction is written to be
 * deterministic anyway — the lower alpha-3 wins — so that a tie could never
 * make the anchor depend on the order the members happen to be listed in.
 */
function deriveAnchor(bloc: AfricaBloc): Alpha3 | null {
  let best: Alpha3 | null = null;
  let bestGdp = -Infinity;
  for (const iso of bloc.members) {
    const gdp = GDP_USD_BN[iso];
    if (gdp == null) continue;
    if (gdp > bestGdp || (gdp === bestGdp && best !== null && iso < best)) {
      best = iso;
      bestGdp = gdp;
    }
  }
  return best;
}

/** bloc id -> anchor alpha-3. Computed, never written down. */
export const ANCHOR_OF: Readonly<Record<string, Alpha3>> = Object.fromEntries(
  AFRICA_BLOCS.map((b) => [b.id, deriveAnchor(b)]).filter(([, a]) => a != null) as [
    string,
    Alpha3,
  ][],
);

/** The anchors, in bloc order, deduplicated. Four blocs, four distinct anchors. */
export const ANCHOR_ISOS: readonly Alpha3[] = [
  ...new Set(AFRICA_BLOCS.map((b) => ANCHOR_OF[b.id]).filter(Boolean)),
];

/* ------------------------------------------------------------------ *
 * Load-time assertions.
 *
 * The same discipline as INTEGRITY in atlas.ts: a data regression should stop
 * the build rather than draw a quietly wrong map. Every failure here is one
 * somebody would otherwise have to spot by eye on a projector.
 * ------------------------------------------------------------------ */
const problems: string[] = [];
for (const bloc of AFRICA_BLOCS) {
  const seen = new Set<string>();
  for (const iso of bloc.members) {
    if (seen.has(iso)) problems.push(`${bloc.label} lists ${iso} twice`);
    seen.add(iso);
    // Without a GDP figure a member can never be the anchor, SILENTLY — which
    // is the one failure mode a derived anchor introduces, so it is checked.
    if (GDP_USD_BN[iso] == null) problems.push(`${bloc.label} member ${iso} has no GDP figure`);
  }
  if (!ANCHOR_OF[bloc.id]) problems.push(`${bloc.label} has no derivable anchor`);
}
if (problems.length > 0) {
  throw new Error(`africaBlocs.ts: ${problems.join('; ')}`);
}
