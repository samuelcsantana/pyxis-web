import type { ReactNode } from 'react';
import { type DayLabel, dayLabelSets, type DayLayout, type LabelAnchor } from '@/domain/chart-days';
import {
  cssPercent,
  gridLines,
  offsetFromTop,
  PLOT_SIZE,
  type ValueAxis,
} from '@/domain/chart-scale';
import { formatCount } from '@/domain/metrics';
import { formatDay } from '@/domain/period';

const VIEW_BOX = `0 0 ${String(PLOT_SIZE)} ${String(PLOT_SIZE)}`;

const ANCHOR_CLASSES: Readonly<Record<LabelAnchor, string>> = {
  start: 'translate-x-0',
  middle: '-translate-x-1/2',
  end: '-translate-x-full',
};

export interface ChartFrameProps {
  readonly summary: string;
  readonly heightClassName: string;
  readonly axis: ValueAxis;
  readonly dates: readonly string[];
  readonly layout: DayLayout;
  readonly children: ReactNode;
}

function DayLabelRow({
  labels,
  className,
}: {
  readonly labels: readonly DayLabel[];
  readonly className: string;
}) {
  return (
    <div className={`absolute inset-0 ${className}`}>
      {labels.map((label) => (
        <span
          key={label.date}
          className={`absolute top-1 whitespace-nowrap ${ANCHOR_CLASSES[label.anchor]}`}
          style={{ left: cssPercent(label.at) }}
        >
          {formatDay(label.date)}
        </span>
      ))}
    </div>
  );
}

export function ChartFrame({
  summary,
  heightClassName,
  axis,
  dates,
  layout,
  children,
}: ChartFrameProps) {
  const labels = dayLabelSets(dates, layout);
  return (
    <figure
      role="img"
      aria-label={summary}
      className={`grid w-full grid-cols-[2.5rem_minmax(0,1fr)] grid-rows-[minmax(0,1fr)_1.25rem] overflow-hidden pt-2 pr-2 text-[11px] leading-none text-muted ${heightClassName}`}
    >
      <div className="relative">
        {axis.ticks.map((tick) => (
          <span
            key={tick}
            className="absolute right-2 -translate-y-1/2 tabular-nums"
            style={{ top: offsetFromTop(tick, axis.top) }}
          >
            {formatCount(tick)}
          </span>
        ))}
      </div>
      <svg
        viewBox={VIEW_BOX}
        preserveAspectRatio="none"
        aria-hidden="true"
        className="size-full overflow-visible"
      >
        <path
          d={gridLines(axis)}
          fill="none"
          stroke="var(--color-grid)"
          vectorEffect="non-scaling-stroke"
        />
        {children}
      </svg>
      <div className="@container relative col-start-2">
        <DayLabelRow labels={labels.narrow} className="@md:hidden" />
        <DayLabelRow labels={labels.wide} className="hidden @md:block" />
      </div>
    </figure>
  );
}
