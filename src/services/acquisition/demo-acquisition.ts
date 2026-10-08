import {
  type AcquisitionReport,
  type AcquisitionWire,
  type Channel,
  CHANNELS,
} from '@/domain/acquisition';
import { acquisitionResponseSchema } from '@/domain/acquisition.schema';
import type { DateRange } from '../date-range';
import type { DemoProject, DemoSource } from '../demo/demo-catalog';
import { demoConversionsTotal, demoVisitsOn } from '../demo/demo-dataset';
import { demoProjectOf } from '../demo/demo-projects';
import {
  apportion,
  demoConvertingVisitsOrNull,
  demoDays,
  type Apportioned,
} from '../demo/demo-series';

type ChannelCounts = Readonly<Record<Channel, number>>;
type CampaignShare = DemoSource['campaigns'][number];
type CampaignWire = NonNullable<AcquisitionWire['campaigns']>[number];

const MAX_CAMPAIGNS = 20;
const UNTAGGED = '';
const WHOLE_SHARE = 1;

const NO_VISITS: ChannelCounts = {
  paid: 0,
  email: 0,
  social: 0,
  campaign: 0,
  organic: 0,
  referral: 0,
  direct: 0,
};

function splitDay(project: DemoProject, visits: number): ChannelCounts {
  return apportion(visits, CHANNELS, (channel) => project.channels[channel]).reduce(
    (counts, { item, count }) => ({ ...counts, [item]: count }),
    NO_VISITS,
  );
}

function sourceVisits(
  project: DemoProject,
  totals: ChannelCounts,
): readonly Apportioned<DemoSource>[] {
  return CHANNELS.flatMap((channel) =>
    apportion(
      totals[channel],
      project.sources.filter((source) => source.channel === channel),
      (source) => source.share,
    ),
  );
}

function sourceConversions(
  visits: readonly Apportioned<DemoSource>[],
  conversions: number | null,
): readonly (number | null)[] {
  if (conversions === null) {
    return visits.map(() => null);
  }
  return apportion(conversions, visits, ({ item, count }) => count * item.conversionWeight).map(
    ({ count }) => count,
  );
}

function campaignShares(source: DemoSource): readonly CampaignShare[] {
  const taggedShare = source.campaigns.reduce((sum, [, share]) => sum + share, 0);
  return [...source.campaigns, [UNTAGGED, Math.max(0, WHOLE_SHARE - taggedShare)]];
}

function convertedEntries<Entry>(
  conversions: number | null,
  entries: readonly Apportioned<Entry>[],
): readonly { readonly entry: Apportioned<Entry>; readonly conversions: number | null }[] {
  if (conversions === null) {
    return entries.map((entry) => ({ entry, conversions: null }));
  }
  return apportion(conversions, entries, (entry) => entry.count).map(({ item, count }) => ({
    entry: item,
    conversions: count,
  }));
}

function campaignWires(
  visits: readonly Apportioned<DemoSource>[],
  conversions: readonly (number | null)[],
): CampaignWire[] {
  return visits
    .flatMap(({ item: source, count }, index) =>
      convertedEntries(
        conversions[index] ?? null,
        apportion(count, campaignShares(source), ([, share]) => share),
      )
        .filter(({ entry }) => entry.item[0] !== UNTAGGED)
        .map(({ entry, conversions: converted }) => ({
          campaign: entry.item[0],
          source: source.source,
          medium: source.medium,
          channel: source.channel,
          visits: entry.count,
          conversions: converted,
          converting_visits: demoConvertingVisitsOrNull(converted),
          from_ad_click_visits: Math.round(entry.count * source.adClickShare),
        })),
    )
    .filter((campaign) => campaign.visits > 0)
    .toSorted((first, second) => second.visits - first.visits)
    .slice(0, MAX_CAMPAIGNS);
}

export function demoAcquisitionWire(projectId: string, range: DateRange): AcquisitionWire {
  const project = demoProjectOf(projectId);
  const days = demoDays(range).map((date) => ({
    date,
    by_channel: splitDay(project, demoVisitsOn(project, date)),
  }));
  const totals = days.reduce<ChannelCounts>(
    (sum, day) =>
      CHANNELS.reduce(
        (counts, channel) => ({
          ...counts,
          [channel]: counts[channel] + day.by_channel[channel],
        }),
        sum,
      ),
    NO_VISITS,
  );
  const visits = sourceVisits(project, totals);
  const conversions = sourceConversions(visits, demoConversionsTotal(project, range));
  return {
    days,
    sources: visits
      .map(({ item, count }, index) => ({
        source: item.source,
        medium: item.medium,
        channel: item.channel,
        visits: count,
        conversions: conversions[index] ?? null,
        converting_visits: demoConvertingVisitsOrNull(conversions[index] ?? null),
        from_ad_click_visits: Math.round(count * item.adClickShare),
      }))
      .filter((source) => source.visits > 0)
      .toSorted((first, second) => second.visits - first.visits),
    campaigns: campaignWires(visits, conversions),
  };
}

export function demoAcquisitionReport(projectId: string, range: DateRange): AcquisitionReport {
  return acquisitionResponseSchema.parse(demoAcquisitionWire(projectId, range));
}
