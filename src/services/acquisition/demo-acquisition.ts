import {
  type AcquisitionReport,
  acquisitionResponseSchema,
  type AcquisitionWire,
  type Channel,
  CHANNELS,
} from '@/domain/acquisition';
import type { DateRange } from '../date-range';
import type { DemoProject, DemoSource } from '../demo/demo-catalog';
import { demoConversionsTotal, demoVisitsOn } from '../demo/demo-dataset';
import { demoProjectOf } from '../demo/demo-projects';
import { type Apportioned, apportion, demoDays } from '../demo/demo-series';

type ChannelCounts = Readonly<Record<Channel, number>>;

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
        from_ad_click_visits: Math.round(count * item.adClickShare),
      }))
      .filter((source) => source.visits > 0)
      .toSorted((first, second) => second.visits - first.visits),
  };
}

export function demoAcquisitionReport(projectId: string, range: DateRange): AcquisitionReport {
  return acquisitionResponseSchema.parse(demoAcquisitionWire(projectId, range));
}
