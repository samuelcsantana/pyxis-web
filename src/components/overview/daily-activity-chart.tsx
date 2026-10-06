'use client';

import { useState } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { formatCount } from '@/domain/metrics';
import { activitySummary, activityTotals, type DayActivity } from '@/domain/overview';
import { formatDay } from '@/domain/period';
import { BODY_CELL, HEADER_CELL, PANEL, PANEL_TITLE } from '@/components/ui/panel-classes';

const SERIES = [
  { key: 'pageViews', label: 'Page views', color: 'var(--color-sky)', swatch: 'bg-sky' },
  { key: 'events', label: 'Named events', color: 'var(--color-violet)', swatch: 'bg-violet' },
] as const;

const CHART_INITIAL_SIZE = { width: 960, height: 240 } as const;
const CHART_MARGIN = { top: 8, right: 8, bottom: 0, left: 0 } as const;
const AXIS_TICK = { fill: 'var(--color-muted)', fontSize: 11 } as const;
const Y_AXIS_WIDTH = 40;
const MIN_TICK_GAP = 24;
const AREA_FILL_OPACITY = 0.12;
const LINE_WIDTH = 2.5;

export interface DailyActivityChartProps {
  readonly days: readonly DayActivity[];
  readonly periodLabel: string;
}

function ActivityChart({ days }: { readonly days: readonly DayActivity[] }) {
  return (
    <figure role="img" aria-label={activitySummary(days)} className="h-30 w-full sm:h-60">
      <ResponsiveContainer width="100%" height="100%" initialDimension={CHART_INITIAL_SIZE}>
        <AreaChart data={[...days]} margin={CHART_MARGIN} accessibilityLayer={false}>
          <CartesianGrid vertical={false} stroke="var(--color-grid)" />
          <XAxis
            dataKey="date"
            tickFormatter={formatDay}
            tick={AXIS_TICK}
            tickLine={false}
            axisLine={false}
            minTickGap={MIN_TICK_GAP}
          />
          <YAxis
            width={Y_AXIS_WIDTH}
            tickFormatter={formatCount}
            tick={AXIS_TICK}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          {SERIES.map((series) => (
            <Area
              key={series.key}
              dataKey={series.key}
              name={series.label}
              type="linear"
              stroke={series.color}
              strokeWidth={LINE_WIDTH}
              fill={series.color}
              fillOpacity={AREA_FILL_OPACITY}
              dot={false}
              activeDot={false}
              isAnimationActive={false}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </figure>
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
  const [asTable, setAsTable] = useState(false);
  const totals = activityTotals(days);
  return (
    <section aria-labelledby="daily-activity-heading" className={`${PANEL} gap-4`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h2 id="daily-activity-heading" className={PANEL_TITLE}>
            Events per day
          </h2>
          <p className="text-[13px] text-muted">Page views and named events, {periodLabel}</p>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          {SERIES.map((series) => (
            <p key={series.key} className="flex items-center gap-2 text-[13px]">
              <span aria-hidden="true" className={`size-2.5 rounded-[3px] ${series.swatch}`} />
              {series.label}
              <strong className="tabular-nums">{formatCount(totals[series.key])}</strong>
            </p>
          ))}
          <button
            type="button"
            aria-pressed={asTable}
            onClick={() => {
              setAsTable((shown) => !shown);
            }}
            className="min-h-11 rounded-control border border-line bg-card px-3 text-[13px] text-ink hover:bg-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink aria-pressed:bg-soft sm:min-h-9"
          >
            View as table
          </button>
        </div>
      </div>
      {asTable ? (
        <ActivityTable days={days} periodLabel={periodLabel} />
      ) : (
        <ActivityChart days={days} />
      )}
    </section>
  );
}
