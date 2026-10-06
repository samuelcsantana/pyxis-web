import { z } from 'zod';
import { barWidth, formatCount, formatPercent, formatQuantity, rate } from './metrics';

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

const channelVisitsSchema = z.object({
  paid: z.number(),
  email: z.number(),
  social: z.number(),
  campaign: z.number(),
  organic: z.number(),
  referral: z.number(),
  direct: z.number(),
});

export const acquisitionResponseSchema = z
  .object({
    days: z.array(z.object({ date: z.string(), by_channel: channelVisitsSchema })),
    sources: z.array(
      z.object({
        source: z.string(),
        medium: z.string().nullable(),
        channel: z.enum(CHANNELS),
        visits: z.number(),
        conversions: z.number().nullable(),
        from_ad_click_visits: z.number(),
      }),
    ),
  })
  .transform((body) => ({
    days: body.days.map((day) => ({ date: day.date, byChannel: day.by_channel })),
    sources: body.sources.map((source) => ({
      source: source.source,
      medium: source.medium,
      channel: source.channel,
      visits: source.visits,
      conversions: source.conversions,
      fromAdClickVisits: source.from_ad_click_visits,
    })),
  }));

export type AcquisitionReport = z.output<typeof acquisitionResponseSchema>;
export type AcquisitionWire = z.input<typeof acquisitionResponseSchema>;
export type ChannelVisits = z.output<typeof channelVisitsSchema>;
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

export function topChannel(days: readonly ChannelDay[]): PaidVisits {
  const totals = channelTotals(days);
  const top = CHANNELS.reduce<Channel>(
    (best, channel) => (totals[channel] > totals[best] ? channel : best),
    CHANNELS[0],
  );
  const total = visitsTotal(days);
  return {
    value: CHANNEL_LABELS[top],
    note: `${formatPercent(rate(totals[top], total))} of ${formatQuantity(total, 'visit', 'visits')}`,
  };
}

export function sourceLabel(source: string): string {
  return source === DIRECT_SOURCE ? DIRECT_SOURCE_LABEL : source;
}

export interface SourceRow {
  readonly key: string;
  readonly label: string;
  readonly medium: string;
  readonly channel: Channel;
  readonly visits: string;
  readonly conversions: string | null;
  readonly conversionRate: string | null;
  readonly barWidth: string;
  readonly fromAdClicks: string | null;
}

const NO_MEDIUM = '—';

export function sourceRows(sources: readonly Source[]): readonly SourceRow[] {
  const rated = sources.map((source) => ({
    ...source,
    rate: source.conversions === null ? null : rate(source.conversions, source.visits),
  }));
  const best = Math.max(0, ...rated.map((source) => source.rate ?? 0));
  return rated.map((source) => ({
    key: `${source.source}|${source.medium ?? ''}|${source.channel}`,
    label: sourceLabel(source.source),
    medium: source.medium ?? NO_MEDIUM,
    channel: source.channel,
    visits: formatCount(source.visits),
    conversions: source.conversions === null ? null : formatCount(source.conversions),
    conversionRate: source.conversions === null ? null : formatPercent(source.rate),
    barWidth: barWidth(source.rate ?? 0, best),
    fromAdClicks:
      source.fromAdClickVisits === 0
        ? null
        : `${formatCount(source.fromAdClickVisits)} from ad clicks`,
  }));
}
