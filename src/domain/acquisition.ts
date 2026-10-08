import type { I18n } from '@/i18n/i18n';
import { barWidth, formatCount, formatPercent, rate } from './metrics';
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

export function channelLabel(channel: Channel, i18n: I18n): string {
  return i18n.t(`acquisition.channels.${channel}`);
}

const DIRECT_SOURCE = '(direct)';

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

export function channelSummary(days: readonly ChannelDay[], i18n: I18n): string {
  const totals = channelTotals(days);
  const daily = days.map(dayTotal);
  const ranked = activeChannels(days)
    .toSorted((left, right) => totals[right] - totals[left])
    .map((channel) =>
      i18n.t('acquisition.summary.channel', {
        channel: channelLabel(channel, i18n),
        visits: formatCount(totals[channel], i18n),
      }),
    );
  const lowest = formatCount(Math.min(...daily), i18n);
  const highest = formatCount(Math.max(...daily), i18n);
  return [
    i18n.t('acquisition.summary.bars', { days: i18n.t('counts.day', { count: days.length }) }),
    i18n.t('acquisition.summary.range', { lowest, highest }),
    i18n.t('acquisition.summary.channels', { channels: ranked.join(', ') }),
  ].join(' ');
}

export interface PaidVisits {
  readonly value: string;
  readonly note: string;
}

function shareOfVisits(part: number, total: number, i18n: I18n): string {
  return i18n.t('acquisition.shareOfVisits', {
    share: formatPercent(rate(part, total), i18n),
    visits: i18n.t('counts.visit', { count: total }),
  });
}

export function paidVisits(days: readonly ChannelDay[], i18n: I18n): PaidVisits {
  const paid = channelTotals(days).paid;
  return {
    value: formatCount(paid, i18n),
    note: shareOfVisits(paid, visitsTotal(days), i18n),
  };
}

export interface ChannelFigure extends PaidVisits {
  readonly label: string;
}

const UNPAID_CHANNELS = CHANNELS.filter((channel) => channel !== 'paid');

function mostVisited(channels: readonly Channel[], totals: ChannelVisits): Channel {
  return channels.reduce((best, channel) => (totals[channel] > totals[best] ? channel : best));
}

export function topChannel(days: readonly ChannelDay[], i18n: I18n): ChannelFigure {
  const totals = channelTotals(days);
  const top = mostVisited(CHANNELS, totals);
  const paidLeads = top === 'paid' && totals.paid > 0;
  const shown = paidLeads ? mostVisited(UNPAID_CHANNELS, totals) : top;
  return {
    label: i18n.t(paidLeads ? 'acquisition.topUnpaidChannel' : 'acquisition.topChannel'),
    value: channelLabel(shown, i18n),
    note: shareOfVisits(totals[shown], visitsTotal(days), i18n),
  };
}

export function sourceLabel(source: string, i18n: I18n): string {
  return source === DIRECT_SOURCE ? i18n.t('acquisition.directSource') : source;
}

interface AttributedVisits {
  readonly visits: number;
  readonly conversions: number | null;
  readonly convertingVisits: number | null;
  readonly fromAdClickVisits: number;
}

export interface ConversionFigures {
  readonly visits: string;
  readonly conversions: string | null;
  readonly conversionRate: string | null;
  readonly barWidth: string;
  readonly fromAdClicks: string | null;
}

function withConversionFigures<Entry extends AttributedVisits, Row>(
  entries: readonly Entry[],
  i18n: I18n,
  describe: (entry: Entry) => Row,
): readonly (Row & ConversionFigures)[] {
  const rated = entries.map((entry) => {
    const converted = entry.convertingVisits ?? entry.conversions;
    return { entry, converted, share: converted === null ? null : rate(converted, entry.visits) };
  });
  const best = Math.max(0, ...rated.map(({ share }) => share ?? 0));
  return rated.map(({ entry, converted, share }) => ({
    ...describe(entry),
    visits: formatCount(entry.visits, i18n),
    conversions: converted === null ? null : formatCount(converted, i18n),
    conversionRate: converted === null ? null : formatPercent(share, i18n),
    barWidth: barWidth(share ?? 0, best),
    fromAdClicks:
      entry.fromAdClickVisits === 0
        ? null
        : i18n.t('acquisition.fromAdClicks', {
            visits: formatCount(entry.fromAdClickVisits, i18n),
          }),
  }));
}

export interface SourceRow extends ConversionFigures {
  readonly key: string;
  readonly source: string;
  readonly label: string;
  readonly medium: string | null;
  readonly channel: Channel;
}

export function sourceRows(sources: readonly Source[], i18n: I18n): readonly SourceRow[] {
  return withConversionFigures(sources, i18n, (source) => ({
    key: `${source.source}|${source.medium ?? ''}|${source.channel}`,
    source: source.source,
    label: sourceLabel(source.source, i18n),
    medium: source.medium,
    channel: source.channel,
  }));
}
