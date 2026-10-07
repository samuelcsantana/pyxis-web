'use client';

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import {
  activeChannels,
  type Channel,
  CHANNEL_LABELS,
  type ChannelDay,
  channelChartRows,
  channelSummary,
  channelTotals,
} from '@/domain/acquisition';
import { formatCount } from '@/domain/metrics';
import { formatDay } from '@/domain/period';
import { ChartPanel, LegendItem } from '@/components/charts/chart-panel';
import { FOCUS_RING } from '@/components/ui/control-classes';
import { BODY_CELL, HEADER_CELL } from '@/components/ui/panel-classes';
import { CHANNEL_COLORS } from './channel-colors';

const CHART_INITIAL_SIZE = { width: 960, height: 240 } as const;
const CHART_MARGIN = { top: 8, right: 8, bottom: 0, left: 0 } as const;
const AXIS_TICK = { fill: 'var(--color-muted)', fontSize: 11 } as const;
const Y_AXIS_WIDTH = 40;
const MIN_TICK_GAP = 24;
const STACK = 'visits';

export interface ChannelChartProps {
  readonly days: readonly ChannelDay[];
  readonly periodLabel: string;
}

function ChannelBars({
  days,
  channels,
}: {
  readonly days: readonly ChannelDay[];
  readonly channels: readonly Channel[];
}) {
  return (
    <figure
      role="img"
      aria-label={channelSummary(days)}
      className="h-50 w-full overflow-hidden sm:h-60"
    >
      <ResponsiveContainer width="100%" height="100%" initialDimension={CHART_INITIAL_SIZE}>
        <BarChart
          data={[...channelChartRows(days)]}
          margin={CHART_MARGIN}
          accessibilityLayer={false}
        >
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
          {channels.map((channel) => (
            <Bar
              key={channel}
              dataKey={channel}
              name={CHANNEL_LABELS[channel]}
              stackId={STACK}
              fill={CHANNEL_COLORS[channel].fill}
              isAnimationActive={false}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </figure>
  );
}

function ChannelTable({
  days,
  channels,
  periodLabel,
}: ChannelChartProps & { readonly channels: readonly Channel[] }) {
  const caption = `Visits by channel per day, ${periodLabel}`;
  return (
    <div
      className={`overflow-x-auto ${FOCUS_RING}`}
      role="region"
      aria-label={caption}
      tabIndex={0}
    >
      <table className="w-full border-collapse text-[13px] tabular-nums">
        <caption className="pb-2 text-left text-muted">{caption}</caption>
        <thead>
          <tr>
            <th scope="col" className={`${HEADER_CELL} text-left`}>
              Day
            </th>
            {channels.map((channel) => (
              <th key={channel} scope="col" className={`${HEADER_CELL} text-right`}>
                {CHANNEL_LABELS[channel]}
              </th>
            ))}
            <th scope="col" className={`${HEADER_CELL} text-right`}>
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          {channelChartRows(days).map((row) => (
            <tr key={row.date}>
              <th scope="row" className={`${BODY_CELL} text-left font-normal whitespace-nowrap`}>
                {formatDay(row.date)}
              </th>
              {channels.map((channel) => (
                <td key={channel} className={`${BODY_CELL} text-right`}>
                  {formatCount(row[channel])}
                </td>
              ))}
              <td className={`${BODY_CELL} text-right font-semibold`}>{formatCount(row.total)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ChannelChart({ days, periodLabel }: ChannelChartProps) {
  const channels = activeChannels(days);
  const totals = channelTotals(days);
  return (
    <ChartPanel
      title="Visits by channel"
      description={`Every visit by the channel it came from, ${periodLabel}`}
      legend={channels.map((channel) => (
        <LegendItem
          key={channel}
          swatch={CHANNEL_COLORS[channel].swatch}
          label={CHANNEL_LABELS[channel]}
          total={formatCount(totals[channel])}
        />
      ))}
      chart={<ChannelBars days={days} channels={channels} />}
      table={<ChannelTable days={days} channels={channels} periodLabel={periodLabel} />}
    />
  );
}
