import {
  activeChannels,
  type Channel,
  CHANNEL_LABELS,
  type ChannelChartRow,
  type ChannelDay,
  channelChartRows,
  channelSummary,
  channelTotals,
} from '@/domain/acquisition';
import { valueAxis } from '@/domain/chart-scale';
import { formatCount } from '@/domain/metrics';
import { formatDay } from '@/domain/period';
import { stackedBars } from '@/domain/stacked-bars';
import { ChartFrame } from '@/components/charts/chart-frame';
import { ChartHover, type HoverDay } from '@/components/charts/chart-hover';
import { ChartPanel, LegendItem } from '@/components/charts/chart-panel';
import { FOCUS_RING } from '@/components/ui/control-classes';
import { BODY_CELL, HEADER_CELL } from '@/components/ui/panel-classes';
import { CHANNEL_COLORS } from './channel-colors';

const SEPARATOR_WIDTH = 1;
const MARKER = 'size-2 rounded-[2px]';

export interface ChannelChartProps {
  readonly days: readonly ChannelDay[];
  readonly periodLabel: string;
}

function hoverDays(
  rows: readonly ChannelChartRow[],
  channels: readonly Channel[],
): readonly HoverDay[] {
  return rows.map((row) => ({
    label: formatDay(row.date),
    rows: [
      ...channels.map((channel) => ({
        label: CHANNEL_LABELS[channel],
        value: formatCount(row[channel]),
        marker: `${MARKER} ${CHANNEL_COLORS[channel].swatch}`,
      })),
      { label: 'Total', value: formatCount(row.total), marker: MARKER },
    ],
  }));
}

function ChannelBars({
  days,
  channels,
}: {
  readonly days: readonly ChannelDay[];
  readonly channels: readonly Channel[];
}) {
  const rows = channelChartRows(days);
  const axis = valueAxis(rows.map((row) => row.total));
  const bars = stackedBars(rows, channels, axis.top);
  return (
    <ChartFrame
      summary={channelSummary(days)}
      heightClassName="h-50 sm:h-60"
      axis={axis}
      dates={rows.map((row) => row.date)}
      layout="bars"
      hover={<ChartHover days={hoverDays(rows, channels)} layout="bars" />}
    >
      {bars.segments.map((segment) => (
        <rect
          key={`${segment.key}-${String(segment.day)}`}
          x={segment.x}
          y={segment.y}
          width={segment.width}
          height={segment.height}
          fill={CHANNEL_COLORS[segment.key].fill}
        />
      ))}
      <path
        d={bars.separators}
        fill="none"
        stroke="var(--color-card)"
        strokeWidth={SEPARATOR_WIDTH}
        vectorEffect="non-scaling-stroke"
      />
    </ChartFrame>
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
