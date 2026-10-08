import { barWidth, formatCount, formatPercent, formatQuantity, rate } from './metrics';
import type { AcquisitionReport, AcquisitionWire, ChannelVisits } from './acquisition.schema';

export type { AcquisitionReport, AcquisitionWire, ChannelVisits };

export const CHANNELS = [
  'paid',
  'email',
  'social',
  'campaign',
  'organic',
  'referral',
  'direct',
] as const;
export type Channel = (typeof CHANNELS)[number];

export const CHANNEL_LABELS: Readonly<Record<Channel, string>> = {
  paid: 'Paid',
  email: 'Email',
  social: 'Social',
  campaign: 'Other campaigns',
  organic: 'Organic search',
  referral: 'Referral',
  direct: 'Direct',
};

const DIRECT_SOURCE = '(direct)';
const DIRECT_SOURCE_LABEL = 'Direct';

export type ChannelDay = AcquisitionReport['days'][number];
export type Source = AcquisitionReport['sources'][number];

function dayTotal(day: ChannelDay): number {
  return CHANNELS.reduce((sum, channel) => sum + day.byChannel[channel], 0);
}

export function channelTotals(days: readonly ChannelDay[]): ChannelVisits {
  return days.reduce<ChannelVisits>(
    (totals, day) => ({
      paid: totals.paid + day.byChannel.paid,
      email: totals.email + day.byChannel.email,
      social: totals.social + day.byChannel.social,
      campaign: totals.campaign + day.byChannel.campaign,
      organic: totals.organic + day.byChannel.organic,
      referral: totals.referral + day.byChannel.referral,
      direct: totals.direct + day.byChannel.direct,
    }),
    { paid: 0, email: 0, social: 0, campaign: 0, organic: 0, referral: 0, direct: 0 },
  );
}

export function visitsTotal(days: readonly ChannelDay[]): number {
  return days.reduce((sum, day) => sum + dayTotal(day), 0);
}

export function activeChannels(days: readonly ChannelDay[]): readonly Channel[] {
  const totals = channelTotals(days);
  return CHANNELS.filter((channel) => totals[channel] > 0);
}

export interface ChannelChartRow extends ChannelVisits {
  readonly date: string;
  readonly total: number;
}

export function channelChartRows(days: readonly ChannelDay[]): readonly ChannelChartRow[] {
  return days.map((day) => ({ date: day.date, ...day.byChannel, total: dayTotal(day) }));
}

export function channelSummary(days: readonly ChannelDay[]): string {
  const totals = channelTotals(days);
  const daily = days.map(dayTotal);
  const ranked = activeChannels(days)
    .toSorted((left, right) => totals[right] - totals[left])
    .map((channel) => `${CHANNEL_LABELS[channel]} ${formatCount(totals[channel])}`);
  return [
    `Stacked bar chart of ${formatQuantity(days.length, 'day', 'days')},`,
    `between ${formatCount(Math.min(...daily))} and ${formatCount(Math.max(...daily))} visits a day.`,
    `Visits by channel: ${ranked.join(', ')}.`,
  ].join(' ');
}

export interface PaidVisits {
  readonly value: string;
  readonly note: string;
}

export function paidVisits(days: readonly ChannelDay[]): PaidVisits {
  const paid = channelTotals(days).paid;
  const total = visitsTotal(days);
  return {
    value: formatCount(paid),
    note: `${formatPercent(rate(paid, total))} of ${formatQuantity(total, 'visit', 'visits')}`,
  };
}

export interface ChannelFigure extends PaidVisits {
  readonly label: string;
}

const UNPAID_CHANNELS = CHANNELS.filter((channel) => channel !== 'paid');

function mostVisited(channels: readonly Channel[], totals: ChannelVisits): Channel {
  return channels.reduce((best, channel) => (totals[channel] > totals[best] ? channel : best));
}

export function topChannel(days: readonly ChannelDay[]): ChannelFigure {
  const totals = channelTotals(days);
  const top = mostVisited(CHANNELS, totals);
  const paidLeads = top === 'paid' && totals.paid > 0;
  const shown = paidLeads ? mostVisited(UNPAID_CHANNELS, totals) : top;
  const total = visitsTotal(days);
  return {
    label: paidLeads ? 'Top unpaid channel' : 'Top channel',
    value: CHANNEL_LABELS[shown],
    note: `${formatPercent(rate(totals[shown], total))} of ${formatQuantity(total, 'visit', 'visits')}`,
  };
}

export function sourceLabel(source: string): string {
  return source === DIRECT_SOURCE ? DIRECT_SOURCE_LABEL : source;
}

export interface SourceRow {
  readonly key: string;
  readonly label: string;
  readonly medium: string | null;
  readonly channel: Channel;
  readonly visits: string;
  readonly conversions: string | null;
  readonly conversionRate: string | null;
  readonly barWidth: string;
  readonly fromAdClicks: string | null;
}

export function sourceRows(sources: readonly Source[]): readonly SourceRow[] {
  const rated = sources.map((source) => {
    const converted = source.convertingVisits ?? source.conversions;
    return {
      ...source,
      converted,
      rate: converted === null ? null : rate(converted, source.visits),
    };
  });
  const best = Math.max(0, ...rated.map((source) => source.rate ?? 0));
  return rated.map((source) => ({
    key: `${source.source}|${source.medium ?? ''}|${source.channel}`,
    label: sourceLabel(source.source),
    medium: source.medium,
    channel: source.channel,
    visits: formatCount(source.visits),
    conversions: source.converted === null ? null : formatCount(source.converted),
    conversionRate: source.converted === null ? null : formatPercent(source.rate),
    barWidth: barWidth(source.rate ?? 0, best),
    fromAdClicks:
      source.fromAdClickVisits === 0
        ? null
        : `${formatCount(source.fromAdClickVisits)} from ad clicks`,
  }));
}
