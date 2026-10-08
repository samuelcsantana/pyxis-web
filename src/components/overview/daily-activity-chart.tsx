import { areaShape } from '@/domain/area-chart';
import { valueAxis } from '@/domain/chart-scale';
import { formatCount } from '@/domain/metrics';
import { activitySummary, activityTotals, type DayActivity } from '@/domain/overview';
import { formatDay } from '@/domain/period';
import { ChartFrame } from '@/components/charts/chart-frame';
import { ChartPanel, LegendItem } from '@/components/charts/chart-panel';
import { BODY_CELL, HEADER_CELL } from '@/components/ui/panel-classes';

const SERIES = [
  { key: 'pageViews', label: 'Page views', color: 'var(--color-sky)', swatch: 'bg-sky' },
  { key: 'events', label: 'Named events', color: 'var(--color-violet)', swatch: 'bg-violet' },
] as const;

const AREA_FILL_OPACITY = 0.12;
const LINE_WIDTH = 2.5;

export interface DailyActivityChartProps {
  readonly days: readonly DayActivity[];
  readonly periodLabel: string;
}

function ActivityChart({ days }: { readonly days: readonly DayActivity[] }) {
  const axis = valueAxis(days.flatMap((day) => [day.pageViews, day.events]));
  return (
    <ChartFrame
      summary={activitySummary(days)}
      heightClassName="h-30 sm:h-60"
      axis={axis}
      dates={days.map((day) => day.date)}
      layout="points"
    >
      {SERIES.map((series) => {
        const shape = areaShape(
          days.map((day) => day[series.key]),
          axis.top,
        );
        return (
          <g key={series.key}>
            <path d={shape.area} fill={series.color} fillOpacity={AREA_FILL_OPACITY} />
            <path
              d={shape.line}
              fill="none"
              stroke={series.color}
              strokeWidth={LINE_WIDTH}
              strokeLinejoin="round"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </g>
        );
      })}
    </ChartFrame>
  );
}

function ActivityTable({ days, periodLabel }: DailyActivityChartProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-[13px] tabular-nums">
        <caption className="pb-2 text-left text-muted">
          Page views and named events per day, {periodLabel}
        </caption>
        <thead>
          <tr>
            <th scope="col" className={`${HEADER_CELL} text-left`}>
              Day
            </th>
            {SERIES.map((series) => (
              <th key={series.key} scope="col" className={`${HEADER_CELL} text-right`}>
                {series.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {days.map((day) => (
            <tr key={day.date}>
              <th scope="row" className={`${BODY_CELL} text-left font-normal`}>
                {formatDay(day.date)}
              </th>
              {SERIES.map((series) => (
                <td key={series.key} className={`${BODY_CELL} text-right`}>
                  {formatCount(day[series.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function DailyActivityChart({ days, periodLabel }: DailyActivityChartProps) {
  const totals = activityTotals(days);
  return (
    <ChartPanel
      title="Activity per day"
      description={`Page views and named events, ${periodLabel}`}
      legend={SERIES.map((series) => (
        <LegendItem
          key={series.key}
          swatch={series.swatch}
          label={series.label}
          total={formatCount(totals[series.key])}
        />
      ))}
      chart={<ActivityChart days={days} />}
      table={<ActivityTable days={days} periodLabel={periodLabel} />}
    />
  );
}
