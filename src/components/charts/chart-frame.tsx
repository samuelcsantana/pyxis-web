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
import type { I18n } from '@/i18n/i18n';

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
  readonly formatTick?: (tick: number) => string;
  readonly hover?: ReactNode;
  readonly i18n: I18n;
  readonly children: ReactNode;
}

function DayLabelRow({
  labels,
  className,
  i18n,
}: {
  readonly labels: readonly DayLabel[];
  readonly className: string;
  readonly i18n: I18n;
}) {
  return (
    <div className={`absolute inset-0 ${className}`}>
      {labels.map((label) => (
        <span
          key={label.date}
          className={`absolute top-1 whitespace-nowrap ${ANCHOR_CLASSES[label.anchor]}`}
          style={{ left: cssPercent(label.at) }}
        >
          {formatDay(label.date, i18n)}
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
  formatTick,
  hover,
  i18n,
  children,
}: ChartFrameProps) {
  const tickLabel = formatTick ?? ((tick: number) => formatCount(tick, i18n));
  const labels = dayLabelSets(dates, layout);
  return (
    <figure
      role="img"
      aria-label={summary}
      className={`grid w-full grid-cols-[2.5rem_minmax(0,1fr)] grid-rows-[minmax(0,1fr)_1.25rem] overflow-hidden pt-2 pr-2 text-micro leading-none text-muted ${heightClassName}`}
    >
      <div className="relative">
        {axis.ticks.map((tick) => (
          <span
            key={tick}
            className="absolute right-2 -translate-y-1/2 tabular-nums"
            style={{ top: offsetFromTop(tick, axis.top) }}
          >
            {tickLabel(tick)}
          </span>
        ))}
      </div>
      <div className="relative min-h-0">
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
        {hover}
      </div>
      <div className="@container relative col-start-2">
        <DayLabelRow labels={labels.narrow} className="@md:hidden" i18n={i18n} />
        <DayLabelRow labels={labels.wide} className="hidden @md:block" i18n={i18n} />
      </div>
    </figure>
  );
}
