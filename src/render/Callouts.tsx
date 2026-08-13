/**
 * Callouts.tsx — panels tethered to a point on the map.
 *
 * The opening scenes put a box of content beside Salisbury with a line drawn
 * back to the dot. That is a different object from anything else on this map,
 * and two decisions shape the whole file.
 *
 * WHY THE PANEL IS HTML AND THE LEADER IS SVG.
 * SVG has no text wrapping. An all-SVG panel would mean hand-breaking every
 * line of the career list into <tspan>s in the data file, and re-breaking them
 * whenever a word changed or the viewport did — brittle in exactly the place
 * the content is most likely to be edited, the night before a talk. So the
 * panel is a div, laid out by the browser, styled in the same idiom as the
 * readout and the telemetry strip. The leader line has the opposite problem —
 * it is pure geometry — so it is drawn in an SVG overlay above the map.
 *
 * WHY THE GEOMETRY IS COMPUTED RATHER THAN MEASURED.
 * The line has to end ON the panel, so something has to know where the panel
 * is. Reading it back from the DOM would mean a layout measurement inside
 * render and a second pass every time the camera moved. Instead the panel's
 * position is decided here in screen pixels and the div is placed at it, so
 * both the line and the box are drawn from the same numbers in one pass. The
 * line meets the panel at a fixed inset from its top edge, which is a point
 * that exists without knowing the panel's height — so the content can grow
 * without the anchor drifting.
 *
 * Like markers, callouts live OUTSIDE the camera group and put the projected
 * point through the transform by hand, so the panel holds its size and place
 * on screen while the map moves under it.
 */
import { memo } from 'react';
import type { GeoProjection } from 'd3-geo';

import { resolveCallouts, type Callout } from '../data/presenter';
import { FigureIcon } from './FigureIcon';
import { MARKER_BY_ID } from '../data/markers';
import { useViewState } from '../state/viewState';

interface Props {
  readonly projection: GeoProjection;
  readonly width: number;
  readonly height: number;
  readonly ids: readonly string[];
}

/** Panel width as a fraction of the viewport, and the bounds that keeps it sane. */
const PANEL_FRACTION = 0.3;
const PANEL_MIN = 320;
const PANEL_MAX = 620;
/** Distance from the frame edge to the panel's outer edge. */
const PANEL_INSET = 0.055;
/** Panel top, as a fraction of viewport height. */
const PANEL_TOP = 0.2;
/** Where the leader meets the panel, measured down from its top edge. */
const LEADER_INSET = 46;

function CalloutsImpl({ projection, width, height, ids }: Props) {
  const camera = useViewState((s) => s.camera);
  const callouts = resolveCallouts(ids);
  if (callouts.length === 0 || width === 0) return null;

  const panelWidth = Math.max(PANEL_MIN, Math.min(PANEL_MAX, width * PANEL_FRACTION));
  const inset = width * PANEL_INSET;

  const placed = callouts.map((callout, i) => {
    const marker = MARKER_BY_ID[callout.anchor];
    const projected = marker ? projection([marker.lon, marker.lat]) : null;
    // Apply the camera by hand — the same three multiplications the markers do,
    // and for the same reason.
    const anchor = projected
      ? { x: projected[0] * camera.k + camera.x, y: projected[1] * camera.k + camera.y }
      : null;

    const left = callout.side === 'left' ? inset : width - inset - panelWidth;
    // Stack, in case a scene ever shows two panels on one side.
    const top = height * PANEL_TOP + i * 40;
    // The leader meets the panel on whichever edge faces the map.
    const meetX = callout.side === 'left' ? left + panelWidth : left;
    return { callout, anchor, left, top, meetX, meetY: top + LEADER_INSET };
  });

  return (
    <>
      <svg className="callout-leaders" width={width} height={height} aria-hidden>
        {placed.map(({ callout, anchor, meetX, meetY }) =>
          anchor ? (
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
              <path
                className="callout-leader"
                d={`M${anchor.x},${anchor.y} L${meetX},${meetY}`}
              />
              {/* A ring at the anchor, so the line visibly lands ON the dot. */}
              <circle className="callout-anchor" cx={anchor.x} cy={anchor.y} r={9} />
            </g>
          ) : null,
        )}
      </svg>

      {placed.map(({ callout, left, top }) => (
        <div
          className="callout"
          key={callout.id}
          data-callout={callout.id}
          style={{ left, top, width: panelWidth }}
        >
          <p className="callout-heading label">{callout.heading}</p>
          <CalloutBody callout={callout} />
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

  return (
    <div className="callout-prose">
      <p className="callout-prose-heading">{body.heading}</p>
      <p className="callout-prose-text">{body.text}</p>
    </div>
  );
}

export const Callouts = memo(CalloutsImpl);
