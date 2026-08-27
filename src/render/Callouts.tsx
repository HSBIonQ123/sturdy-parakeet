/**
 * Callouts.tsx — panels tethered to a point on the map, and the timeline.
 *
 * WHY THE PANEL IS HTML AND THE LEADER IS SVG.
 * SVG has no text wrapping. An all-SVG panel would mean hand-breaking every
 * line of the career list — and now of a four-section legislative briefing —
 * into <tspan>s in the data file, and re-breaking them whenever a word changed
 * or the viewport did. That is brittle in exactly the place the content is most
 * likely to be edited, the night before a talk. So the panel is a div, laid out
 * by the browser, styled in the same idiom as the readout and the telemetry
 * strip. The leader line has the opposite nature — it is pure geometry — so it
 * is drawn in an SVG overlay above the map.
 *
 * WHY THE GEOMETRY IS COMPUTED RATHER THAN MEASURED.
 * The line has to end ON the panel, so something has to know where the panel is.
 * Reading it back from the DOM would mean a layout measurement inside render and
 * a second pass every time the camera moved. Instead the panel's position is
 * decided here in screen pixels and the div is placed at it, so both the line and
 * the box come from the same numbers in one pass. The line meets the panel at a
 * fixed inset from its top edge — a point that exists without knowing the
 * panel's height, so content can grow without the anchor drifting.
 *
 * BODIES ARE A UNION, AND EACH ONE OWNS ITS LAYOUT. A figure row, a numbered
 * list, a sectioned briefing, a seven-stage timeline and a two-way circuit share
 * a frame, a heading and a leader line, and share nothing else. Where a body
 * needs geometry — the timeline's track, the circuit's rails — it is drawn in
 * CSS rather than SVG, so it stretches to whatever height the text came to
 * without anything measuring the DOM. See `Timeline` and `Circuit` below.
 *
 * THREE SIZES, AND WHY `full` TAKES NO LEADER.
 * `standard` is the personal panels. `wide` exists because the policy briefings
 * are reproduced verbatim and a 620px column would run them off the bottom of
 * the frame — the fix for dense content is width, never cutting the words.
 * `full` spans the frame for the timeline, which is about the calendar rather
 * than about a place: a line from it to Brussels would assert a relationship
 * that is not there, so `anchor` is optional and the leader is simply not drawn.
 *
 * Like markers, callouts live OUTSIDE the camera group and put the projected
 * point through the transform by hand, so the panel holds its size and place on
 * screen while the map moves under it.
 */
import { memo } from 'react';
import type { GeoProjection } from 'd3-geo';

import { resolveCallouts, type Callout, type CalloutSize } from '../data/callouts';
import { FigureIcon } from './FigureIcon';
import { MARKER_BY_ID } from '../data/markers';
import { useViewState } from '../state/viewState';

interface Props {
  readonly projection: GeoProjection;
  readonly width: number;
  readonly height: number;
  readonly ids: readonly string[];
}

/** Width as a fraction of the viewport, with bounds and a top, per size. */
const SIZES: Record<CalloutSize, { frac: number; min: number; max: number; top: number }> = {
  standard: { frac: 0.3, min: 320, max: 620, top: 0.2 },
  wide: { frac: 0.42, min: 420, max: 1180, top: 0.16 },
  // Full spans the frame and sits low, leaving the map legible above it.
  full: { frac: 1, min: 0, max: Number.POSITIVE_INFINITY, top: 0.33 },
};

/** Distance from the frame edge to the panel's outer edge. */
const PANEL_INSET = 0.055;
/** Where the leader meets the panel, measured down from its top edge. */
const LEADER_INSET = 46;

function CalloutsImpl({ projection, width, height, ids }: Props) {
  const camera = useViewState((s) => s.camera);
  const callouts = resolveCallouts(ids);
  if (callouts.length === 0 || width === 0) return null;

  const inset = width * PANEL_INSET;

  const placed = callouts.map((callout, i) => {
    const size = SIZES[callout.size ?? 'standard'];
    const panelWidth =
      callout.size === 'full'
        ? width - inset * 2
        : Math.max(size.min, Math.min(size.max, width * size.frac));

    const marker = callout.anchor ? MARKER_BY_ID[callout.anchor] : undefined;
    const projected = marker ? projection([marker.lon, marker.lat]) : null;
    // Apply the camera by hand — the same three multiplications the markers do.
    const anchor = projected
      ? { x: projected[0] * camera.k + camera.x, y: projected[1] * camera.k + camera.y }
      : null;

    const left =
      callout.size === 'full' || callout.side === 'left' ? inset : width - inset - panelWidth;
    // Stack, in case a scene ever shows two panels on one side. `callout.top`
    // overrides the size default — a full-width TABLE starts high where the
    // timeline, a band, sits low. See the field's note in callouts.ts.
    const top = height * (callout.top ?? size.top) + i * 40;
    const meetX = callout.side === 'left' ? left + panelWidth : left;
    return { callout, anchor, left, top, panelWidth, meetX, meetY: top + LEADER_INSET };
  });

  return (
    <>
      <svg className="callout-leaders" width={width} height={height} aria-hidden>
        {placed.map(({ callout, anchor, meetX, meetY }) =>
          anchor && callout.size !== 'full' ? (
            <g key={callout.id}>
              {/*
                Two strokes, not one: a dark under-stroke so the line stays
                readable where it crosses lit land, then the line itself. The
                same trick the hover outline uses, and the reason neither needs
                a filter.
              */}
              <path
                className="callout-leader-base"
                d={`M${anchor.x},${anchor.y} L${meetX},${meetY}`}
              />
              <path className="callout-leader" d={`M${anchor.x},${anchor.y} L${meetX},${meetY}`} />
              {/* A ring at the anchor, so the line visibly lands ON the dot. */}
              <circle className="callout-anchor" cx={anchor.x} cy={anchor.y} r={9} />
            </g>
          ) : null,
        )}
      </svg>

      {placed.map(({ callout, left, top, panelWidth }) => (
        <div
          className={`callout callout-${callout.size ?? 'standard'}`}
          key={callout.id}
          data-callout={callout.id}
          style={{ left, top, width: panelWidth }}
        >
          <div className="callout-head">
            <p className="callout-heading label">{callout.heading}</p>
            {callout.internal ? (
              // Stamped rather than assumed. This content is an internal
              // assessment; nobody should be on one of these scenes, in a room,
              // and have to remember that.
              <p className="callout-stamp label">Internal · as at {callout.asAt}</p>
            ) : null}
          </div>
          {callout.title ? <p className="callout-title">{callout.title}</p> : null}
          {callout.standfirst ? (
            <p className="callout-standfirst">{callout.standfirst}</p>
          ) : null}
          <CalloutBody callout={callout} />
          {callout.sources ? <p className="callout-sources">Sources: {callout.sources}</p> : null}
        </div>
      ))}
    </>
  );
}

function CalloutBody({ callout }: { readonly callout: Callout }) {
  const body = callout.body;

  if (body.kind === 'figures') {
    return (
      <div className="callout-figures">
        {body.figures.map((figure) => (
          <figure className="callout-figure" key={figure.id}>
            <FigureIcon icon={figure.icon} />
            <figcaption className="callout-name label">{figure.label}</figcaption>
          </figure>
        ))}
      </div>
    );
  }

  if (body.kind === 'list') {
    return (
      <ol className="callout-list">
        {body.items.map((item, i) => (
          <li className="callout-item" key={item}>
            <span className="callout-index value">{String(i + 1).padStart(2, '0')}</span>
            <span className="callout-text">{item}</span>
          </li>
        ))}
      </ol>
    );
  }

  if (body.kind === 'prose') {
    return (
      <div className="callout-prose">
        <p className="callout-prose-heading">{body.heading}</p>
        <p className="callout-prose-text">{body.text}</p>
      </div>
    );
  }

  if (body.kind === 'sections') {
    return (
      <div className="callout-sections">
        {body.sections.map((section) => (
          <section className="callout-section" key={section.heading}>
            {section.heading ? (
              <p className="callout-section-heading label">{section.heading}</p>
            ) : null}
            {/* The verdict line, given the accent rather than buried as bullet
                one of four — it is the sentence the room needs. */}
            {section.note ? <p className="callout-section-note">{section.note}</p> : null}
            <ul className="callout-points">
              {section.items.map((item) => (
                <li className="callout-point" key={item}>
                  {item}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    );
  }

  if (body.kind === 'circuit') {
    return <Circuit body={body} />;
  }

  if (body.kind === 'state-change') {
    return <StateChange body={body} />;
  }

  if (body.kind === 'risk-register') {
    return <RiskRegister body={body} />;
  }

  if (body.kind === 'asks') {
    return <Asks body={body} />;
  }

  if (body.kind === 'blocs') {
    return <Blocs body={body} />;
  }

  if (body.kind === 'pillars') {
    return <Pillars body={body} />;
  }

  if (body.kind === 'stakeholders') {
    return <Stakeholders body={body} />;
  }

  return <Timeline body={body} />;
}

/**
 * A market strategy as its pillars, side by side.
 *
 * THE NUMBER COMES FROM THE POSITION, not from the data. A pillar written as
 * "3." in its own name goes stale the moment somebody reorders the array, and
 * goes stale silently — the slide still renders, it just lies about the order.
 * The grid is `repeat(n, 1fr)` from the array length for the same reason: add a
 * fifth pillar and the layout takes it, with nothing to keep in step by hand.
 */
/**
 * The African regional blocs, side by side.
 *
 * STACKED AS ROWS, not laid across. Four columns is the shape this wanted and
 * the shape the map could not afford — see the note on `size` in data/africa.ts.
 * Rows cost the map width instead of height, which a tall continent can spare.
 *
 * The ANCHOR is given the accent and its own key, because it is the only thing
 * on this panel the map cannot show: four overlapping blocs share one fill (see
 * layers/africaBlocs.ts), so the fill says where the footprint is and this line
 * says which country is the way in. The member count rides with it, small — it
 * is context for the anchor, and a bloc's size is not the reason to start there.
 */
function Blocs({ body }: { readonly body: Extract<Callout['body'], { kind: 'blocs' }> }) {
  return (
    <div className="blocs">
      {body.blocs.map((bloc) => (
        <section className="bloc" key={bloc.id} data-bloc={bloc.id}>
          <div className="bloc-head">
            <p className="bloc-abbr">{bloc.abbr}</p>
            <p className="bloc-anchor">
              <span className="bloc-key label">Anchor</span>
              <span className="bloc-anchor-name">{bloc.anchor}</span>
              <span className="bloc-count value">· {bloc.memberCount} members</span>
            </p>
          </div>
          <p className="bloc-name">{bloc.fullName}</p>
          <p className="bloc-note">{bloc.note}</p>
        </section>
      ))}
    </div>
  );
}

/**
 * The closing asks, side by side.
 *
 * Same grid as the pillars and the same numbering rule — the index comes from
 * POSITION, so reordering the asks in the data cannot leave a stale number
 * behind. They are laid across rather than down because the slide's argument is
 * that these are four parts of one request, not a ranked list: a column of four
 * with numbers descending reads as priority order, and the presenter would then
 * be asked which one matters most.
 */
function Asks({ body }: { readonly body: Extract<Callout['body'], { kind: 'asks' }> }) {
  return (
    <div className="asks">
      <div
        className="asks-row"
        style={{ gridTemplateColumns: `repeat(${body.asks.length}, 1fr)` }}
      >
        {body.asks.map((ask, i) => (
          <section className="ask" key={ask.id} data-ask={ask.id}>
            <p className="ask-index value">{String(i + 1).padStart(2, '0')}</p>
            <p className="ask-title">{ask.title}</p>
            <p className="ask-text">{ask.text}</p>
          </section>
        ))}
      </div>
    </div>
  );
}

function Pillars({ body }: { readonly body: Extract<Callout['body'], { kind: 'pillars' }> }) {
  return (
    <div className="pillars">
      <div
        className="pillars-row"
        style={{ gridTemplateColumns: `repeat(${body.pillars.length}, 1fr)` }}
      >
        {body.pillars.map((pillar, i) => (
          <section className="pillar" key={pillar.id} data-pillar={pillar.id}>
            <p className="pillar-index value">{String(i + 1).padStart(2, '0')}</p>
            <p className="pillar-name">{pillar.name}</p>
            {(
              [
                ['Strategy', pillar.strategy],
                ['Message', pillar.message],
                ['Execution', pillar.execution],
              ] as const
            ).map(([key, text]) => (
              <div className="pillar-part" key={key}>
                <p className="pillar-key label">{key}</p>
                <p className="pillar-text">{text}</p>
              </div>
            ))}
          </section>
        ))}
      </div>
      {body.footnote ? <p className="callout-footnote">{body.footnote}</p> : null}
    </div>
  );
}

/**
 * A stakeholder map: who to meet, grouped by the kind of body they are.
 *
 * `why` IS OPTIONAL AND THE LAYOUT HAS TO COPE WITH IT MISSING, which is not a
 * defensive nicety — one entry in the Lithuania source carries the wrong body's
 * rationale, pasted from the page before. The honest rendering of that is a gap,
 * so the component simply draws no line rather than the data file inventing one.
 * See the note in lithuania.ts.
 */
function Stakeholders({
  body,
}: {
  readonly body: Extract<Callout['body'], { kind: 'stakeholders' }>;
}) {
  return (
    <div className="stakeholders">
      <div
        className="stakeholders-row"
        style={{ gridTemplateColumns: `repeat(${body.groups.length}, 1fr)` }}
      >
        {body.groups.map((group) => (
          <section className="stakeholder-group" key={group.id} data-group={group.id}>
            <p className="stakeholder-group-label label">{group.label}</p>
            {group.entries.map((entry) => (
              <article className="stakeholder" key={entry.id} data-stakeholder={entry.id}>
                <p className="stakeholder-name">{entry.name}</p>
                {entry.role ? <p className="stakeholder-role label">{entry.role}</p> : null}
                <p className="stakeholder-what">{entry.what}</p>
                {entry.why ? (
                  <p className="stakeholder-why">
                    <span className="label stakeholder-why-key">The meeting</span>
                    {entry.why}
                  </p>
                ) : null}
              </article>
            ))}
          </section>
        ))}
      </div>
      {body.footnote ? <p className="callout-footnote">{body.footnote}</p> : null}
    </div>
  );
}

/**
 * The state-change register.
 *
 * THE GLYPHS ARE THE DECK'S OWN, NOT A CHART'S. A row's two states are drawn
 * with the marker grammar from §7e — a hollow ring for the state that was, a
 * ring with a bright core for the state that is. That is the same distinction
 * the map already makes between a place the talk points at and a place IonQ
 * occupies, so the room reads a row before it reads the row's words, and no new
 * visual vocabulary had to be invented to say "this one is live now".
 *
 * ONE DRIVE, MANY ROWS. Every row crosses the same gutter, and the gutter is
 * labelled once at its head. The layout is what claims that a single function
 * flipped all of them, which is better than a sentence claiming it — an ion
 * register with one drive line is exactly the picture the metaphor already owns.
 *
 * Adding a row is one object in the data. The guard against adding one too many
 * is `verify.mjs`, which fails the moment the panel stops fitting the frame —
 * the failure this deck must never have quietly, because a table clipped at the
 * bottom loses its last row without looking wrong.
 */
function StateChange({
  body,
}: {
  readonly body: Extract<Callout['body'], { kind: 'state-change' }>;
}) {
  return (
    <div className="statechange">
      <div className="statechange-head">
        <span className="statechange-topic label" />
        <span className="statechange-from label">{body.fromLabel}</span>
        <span className="statechange-drive label">{body.driveLabel}</span>
        <span className="statechange-to label">{body.toLabel}</span>
      </div>

      {body.rows.map((row) => (
        <div className="statechange-row" key={row.id} data-row={row.id}>
          <p className="statechange-topic-name">{row.topic}</p>
          <div className="statechange-cell statechange-cell--from">
            <span className="statechange-ion" aria-hidden />
            <p className="statechange-text">{row.from}</p>
          </div>
          {/* The drive. Geometry only — the rule and the arrowhead are CSS, so
              the gutter stretches to whatever height the row came to. */}
          <span className="statechange-rail" aria-hidden />
          <div className="statechange-cell statechange-cell--to">
            <span className="statechange-ion statechange-ion--lit" aria-hidden />
            <p className="statechange-text">{row.to}</p>
          </div>
        </div>
      ))}
      {body.footnote ? <p className="callout-footnote">{body.footnote}</p> : null}
    </div>
  );
}

/** Which meter segments are lit, per level. Three levels, three segments. */
const RISK_SEGMENTS: Record<string, number> = { low: 1, medium: 2, high: 3 };

/**
 * A severity meter: three segments, filled to the level.
 *
 * SEVERITY IS CARRIED BY SHAPE, NOT BY HUE, and that is the §7b argument again
 * rather than a new one. The obvious rendering is red/amber/green, and it is
 * unavailable twice over: the palette is monochrome plus one, and a projector
 * crushes exactly the part of the range those three would have to separate in.
 * A bar that gets SHORTER is legible at any brightness, and it makes the shift
 * itself visible — eight rows of shortening bars is the slide's whole claim.
 */
function RiskMeter({ level }: { readonly level: string }) {
  const lit = RISK_SEGMENTS[level] ?? 0;
  return (
    <span className={`risk-meter risk-meter--${level}`} title={level}>
      {[0, 1, 2].map((i) => (
        <span className={`risk-seg${i < lit ? ' is-lit' : ''}`} key={i} />
      ))}
      <span className="risk-level label">{level}</span>
    </span>
  );
}

/**
 * The portfolio risk register.
 *
 * THE ARROW IS DERIVED, NOT DATA. A row where the severity falls gets a down
 * arrow; a row held at its level gets a sideways one, which is what "mitigated
 * but not reduced" looks like. The source deck's own glyphs disagree with its
 * own levels on one row, and an arrow that argues against the meters either
 * side of it is worse than one that simply follows them — so the direction is
 * computed here and only the WORD comes from the data. See ninetyDays.ts.
 */
function RiskRegister({
  body,
}: {
  readonly body: Extract<Callout['body'], { kind: 'risk-register' }>;
}) {
  return (
    <div className="risk">
      <div className="risk-head">
        <span className="label">{body.fromLabel}</span>
        <span className="label">{body.shiftLabel}</span>
        <span className="label">{body.toLabel}</span>
        <span className="label">{body.driversLabel}</span>
      </div>

      {body.rows.map((row) => {
        const fell = (RISK_SEGMENTS[row.to.level] ?? 0) < (RISK_SEGMENTS[row.from.level] ?? 0);
        return (
          <div className="risk-row" key={row.id} data-row={row.id}>
            <div className="risk-state">
              <RiskMeter level={row.from.level} />
              <p className="risk-title">{row.from.title}</p>
              <p className="risk-detail">{row.from.detail}</p>
            </div>

            <div
              className={`risk-shift risk-shift--${fell ? 'fell' : 'held'}`}
              data-direction={fell ? 'down' : 'held'}
            >
              <span className="risk-arrow" aria-hidden />
              <p className="risk-verb label">{row.verb}</p>
            </div>

            <div className="risk-state risk-state--now">
              <RiskMeter level={row.to.level} />
              <p className="risk-title">{row.to.title}</p>
              <p className="risk-detail">{row.to.detail}</p>
            </div>

            <ul className="risk-drivers">
              {row.drivers.map((driver) => (
                <li className="callout-point" key={driver}>
                  {driver}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

/**
 * The influence circuit: two nodes, and the two directions of travel between
 * them.
 *
 * DRAWN IN CSS, NOT SVG, and that is the same call the Timeline made. The
 * geometry here is two vertical rails and two arrowheads — a rule and a
 * triangle, both of which CSS draws exactly and neither of which needs to know
 * how tall the text beside it turned out to be. An SVG diagram would have to,
 * and would put a layout measurement back inside render for the sake of two
 * straight lines. The rails stretch to whatever height the claim and its levers
 * come to, so the circuit stays closed as the content grows.
 *
 * The arrowhead is placed from `direction` rather than from column position, so
 * reordering the arms in the data reorders the columns and the arrows follow.
 */
function Circuit({ body }: { readonly body: Extract<Callout['body'], { kind: 'circuit' }> }) {
  // A circuit with both arms running the same way is not a circuit — it is two
  // lines pointing the same direction, which would draw cleanly and argue
  // something nobody wrote. Fail loudly, like the Timeline's missing stage.
  if (body.arms[0].direction === body.arms[1].direction) {
    throw new Error(
      `Circuit: both arms run "${body.arms[0].direction}" — a circuit needs one of each`,
    );
  }

  return (
    <div className="circuit">
      <CircuitNodeBox node={body.top} />

      <div className="circuit-arms">
        {body.arms.map((arm) => (
          <div className={`circuit-arm circuit-arm--${arm.direction}`} key={arm.id} data-arm={arm.id}>
            {/* The rail. Empty by design: it is geometry, and the ::before rule
                and ::after arrowhead are drawn from the direction class. */}
            <span className="circuit-rail" aria-hidden />
            <div className="circuit-arm-body">
              <p className="circuit-arm-label label">{arm.label}</p>
              <p className="circuit-arm-claim">{arm.claim}</p>
              {arm.levers ? (
                <ul className="circuit-levers">
                  {arm.levers.map((lever) => (
                    <li className="circuit-lever" key={lever.id} data-lever={lever.id}>
                      <p className="circuit-lever-label">{lever.label}</p>
                      <p className="circuit-lever-detail">{lever.detail}</p>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      <CircuitNodeBox node={body.bottom} />

      {body.footnote ? <p className="circuit-footnote">{body.footnote}</p> : null}
    </div>
  );
}

function CircuitNodeBox({ node }: { readonly node: { label: string; detail: string } }) {
  return (
    <div className="circuit-node">
      <p className="circuit-node-label">{node.label}</p>
      <p className="circuit-node-detail label">{node.detail}</p>
    </div>
  );
}

/**
 * The legislative timeline.
 *
 * The track is a rule with one node per stage, placed at column centres —
 * `(i + 0.5) / n` — so the dots and the columns beneath them come from the same
 * arithmetic and cannot drift apart at any viewport width.
 *
 * THE "YOU ARE HERE" MARKER PULSES, which is a deliberate exception to the rule
 * that the borders are the only ambient motion on screen (§7e). It was asked for
 * explicitly, and it earns it: the one thing an audience needs from a
 * seven-stage plan is where the talk is standing in it, and on a static track
 * every node looks equally live. It is kept quiet — a slow breath on a ring, not
 * a flash — and it goes still under `prefers-reduced-motion`, like everything
 * else here.
 */
function Timeline({ body }: { readonly body: Extract<Callout['body'], { kind: 'timeline' }> }) {
  const n = body.stages.length;
  const nowIndex = body.stages.findIndex((s) => s.id === body.nowAtStage);
  // A silent miss here would park the marker at the left edge, quietly claiming
  // the talk is at stage one. Fail loudly instead.
  if (nowIndex < 0) {
    throw new Error(`Timeline: nowAtStage "${body.nowAtStage}" is not one of the stages`);
  }
  const centre = (i: number) => `${((i + 0.5) / n) * 100}%`;

  return (
    <div className="timeline">
      <div className="timeline-track">
        <span className="timeline-rule" />
        {body.stages.map((stage, i) => (
          <span
            className={`timeline-node${i === nowIndex ? ' is-now' : ''}`}
            key={stage.id}
            style={{ left: centre(i) }}
          />
        ))}
        <span className="timeline-now" style={{ left: centre(nowIndex) }}>
          <span className="timeline-now-label label">{body.nowLabel}</span>
          <span className="timeline-now-ring" />
        </span>
      </div>

      <div className="timeline-stages" style={{ gridTemplateColumns: `repeat(${n}, 1fr)` }}>
        {body.stages.map((stage, i) => (
          <div
            className={`timeline-stage${i === nowIndex ? ' is-now' : ''}`}
            key={stage.id}
            data-stage={stage.id}
          >
            <p className="timeline-timing value">{stage.timing}</p>
            <p className="timeline-stage-name">{stage.stage}</p>
            <p className="timeline-what">{stage.what}</p>
            <p className="timeline-key label">{body.engagementLabel ?? 'IonQ engagement'}</p>
            <p className="timeline-engagement">{stage.engagement}</p>
          </div>
        ))}
      </div>

      {body.footnote ? <p className="timeline-footnote">{body.footnote}</p> : null}
    </div>
  );
}

export const Callouts = memo(CalloutsImpl);
