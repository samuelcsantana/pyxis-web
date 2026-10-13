import type { ReactNode } from 'react';
import type { ScreenSlug } from '@/components/shell/screens';

export interface ScreenGlyphProps {
  readonly screen: ScreenSlug;
}

const WIDTH = 120;
const HEIGHT = 44;

const OVERVIEW_POINTS = [30, 26, 28, 20, 22, 14, 16, 10, 12, 6];
const ACQUISITION_STACKS = [
  [14, 8, 6],
  [18, 10, 6],
  [12, 9, 8],
  [20, 12, 5],
  [16, 11, 9],
  [22, 9, 7],
  [19, 13, 6],
  [24, 10, 8],
];
const STACK_COLORS = ['fill-accent', 'fill-sky', 'fill-field'];
const FEATURE_BARS = [100, 78, 60, 44, 30];
const FUNNEL_STEPS = [40, 30, 21, 13];
const REQUEST_BARS = [10, 14, 12, 9, 30, 11, 13, 10, 12, 9, 11, 14];
const FAILING_REQUEST = 4;
const VISIT_ROWS = [70, 92, 58, 80];
const TIMELINE_STOPS = [6, 30, 52, 80, 114];
const TIMELINE_CURRENT = 3;

function overview(): ReactNode {
  const line = OVERVIEW_POINTS.map(
    (value, index) => `${index === 0 ? 'M' : 'L'}${String(index * 13)} ${String(value + 4)}`,
  ).join(' ');
  return (
    <>
      <path d={`${line} L117 44 L0 44 Z`} className="fill-accent opacity-20" />
      <path d={line} fill="none" className="stroke-accent" strokeWidth={2} />
    </>
  );
}

function acquisition(): ReactNode {
  return ACQUISITION_STACKS.map((stack, column) => {
    let bottom = HEIGHT;
    return stack.map((height, layer) => {
      bottom -= height;
      return (
        <rect
          key={`${String(column)}-${String(layer)}`}
          x={column * 15}
          y={bottom}
          width={11}
          height={height - 1}
          rx={2}
          className={STACK_COLORS[layer]}
        />
      );
    });
  });
}

function devices(): ReactNode {
  return (
    <>
      <circle cx={22} cy={22} r={16} fill="none" className="stroke-field" strokeWidth={8} />
      <circle
        cx={22}
        cy={22}
        r={16}
        fill="none"
        className="stroke-accent"
        strokeWidth={8}
        strokeDasharray="62 100"
        transform="rotate(-90 22 22)"
      />
      {[48, 22, 12].map((width, index) => (
        <rect
          key={width}
          x={50}
          y={8 + index * 12}
          width={width}
          height={6}
          rx={3}
          className={index === 0 ? 'fill-accent' : 'fill-field'}
        />
      ))}
    </>
  );
}

function features(): ReactNode {
  return FEATURE_BARS.map((width, index) => (
    <rect
      key={width}
      x={0}
      y={index * 9}
      width={width}
      height={6}
      rx={3}
      className={index === 0 ? 'fill-accent' : 'fill-field'}
    />
  ));
}

function funnel(): ReactNode {
  return FUNNEL_STEPS.map((height, index) => (
    <rect
      key={height}
      x={index * 30}
      y={HEIGHT - height}
      width={24}
      height={height}
      rx={3}
      className="fill-accent"
      opacity={1 - index * 0.18}
    />
  ));
}

function requests(): ReactNode {
  return REQUEST_BARS.map((height, index) => (
    <rect
      key={`${String(index)}-${String(height)}`}
      x={index * 10}
      y={HEIGHT - height}
      width={7}
      height={height}
      rx={2}
      className={index === FAILING_REQUEST ? 'fill-bad' : 'fill-field'}
    />
  ));
}

function visits(): ReactNode {
  return VISIT_ROWS.map((width, index) => (
    <g key={width}>
      <circle
        cx={5}
        cy={6 + index * 11}
        r={3}
        className={index === 1 ? 'fill-accent' : 'fill-field'}
      />
      <rect x={14} y={3 + index * 11} width={width} height={6} rx={3} className="fill-soft" />
    </g>
  ));
}

function timeline(): ReactNode {
  return (
    <>
      <line x1={6} y1={22} x2={114} y2={22} className="stroke-line-strong" strokeWidth={2} />
      {TIMELINE_STOPS.map((x, index) => (
        <circle
          key={x}
          cx={x}
          cy={22}
          r={index === TIMELINE_CURRENT ? 5 : 4}
          strokeWidth={2}
          className={
            index === TIMELINE_CURRENT ? 'fill-accent stroke-accent' : 'fill-card stroke-field'
          }
        />
      ))}
    </>
  );
}

const DRAWINGS: Readonly<Record<ScreenSlug, () => ReactNode>> = {
  overview,
  acquisition,
  devices,
  features,
  funnel,
  requests,
  visits,
  timeline,
};

export function ScreenGlyph({ screen }: ScreenGlyphProps) {
  return (
    <svg
      viewBox={`0 0 ${String(WIDTH)} ${String(HEIGHT)}`}
      aria-hidden="true"
      preserveAspectRatio="xMinYMid meet"
      className="h-13 w-full"
      data-screen={screen}
    >
      {DRAWINGS[screen]()}
    </svg>
  );
}
