import {
  type AcquisitionReport,
  type AcquisitionWire,
  type Channel,
  CHANNELS,
} from '@/domain/acquisition';
import { acquisitionResponseSchema } from '@/domain/acquisition.schema';
import type { DateRange } from '../date-range';
import { demoProjectOf } from '../demo/demo-projects';
import type { DemoVisitRecord } from '../demo/demo-records';
import { itemAt } from '../demo/demo-random';
import {
  byKeys,
  countWhere,
  demoScopeOf,
  demoVisitsIn,
  groupedBy,
  groupOf,
  isPageView,
  visitDate,
} from '../demo/demo-scope';
import { demoDays } from '../demo/demo-series';

type ChannelCounts = Readonly<Record<Channel, number>>;
type SourceWire = AcquisitionWire['sources'][number];
type CampaignWire = NonNullable<AcquisitionWire['campaigns']>[number];

export const TOP_SOURCES = 20;
export const TOP_CAMPAIGNS = 20;
const KEY_SEPARATOR = '\u0000';

interface Entry {
  readonly visit: DemoVisitRecord;
  readonly conversions: number;
}

function noVisits(): ChannelCounts {
  return Object.fromEntries(CHANNELS.map((channel) => [channel, 0])) as Record<Channel, number>;
}

function entriesOf(visits: readonly DemoVisitRecord[], conversionEvent: string | null) {
  return visits
    .filter((visit) => visit.events.some(isPageView))
    .map((visit): Entry => ({
      visit,
      conversions: countWhere(visit.events, (event) => event.name === conversionEvent),
    }));
}

function sourceKey({ visit }: Entry): string {
  return [visit.source, visit.medium ?? '', visit.channel].join(KEY_SEPARATOR);
}

function totals(group: readonly Entry[], countsConversions: boolean) {
  const conversions = group.reduce((total, entry) => total + entry.conversions, 0);
  const converting = countWhere(group, (entry) => entry.conversions > 0);
  return {
    visits: group.length,
    conversions: countsConversions ? conversions : null,
    converting_visits: countsConversions ? converting : null,
    from_ad_click_visits: countWhere(group, (entry) => entry.visit.fromAdClick),
  };
}

function sourcesOf(entries: readonly Entry[], countsConversions: boolean): SourceWire[] {
  return [...groupedBy(entries, sourceKey).values()]
    .map((group) => {
      const { visit } = itemAt(group, 0);
      return {
        source: visit.source,
        medium: visit.medium,
        channel: visit.channel,
        ...totals(group, countsConversions),
      };
    })
    .toSorted(byKeys((source) => [-source.visits, source.source, source.medium ?? '']))
    .slice(0, TOP_SOURCES);
}

function campaignsOf(entries: readonly Entry[], countsConversions: boolean): CampaignWire[] {
  const tagged = entries.filter((entry) => entry.visit.campaign !== null);
  return [
    ...groupedBy(
      tagged,
      (entry) => `${String(entry.visit.campaign)}${KEY_SEPARATOR}${sourceKey(entry)}`,
    ),
  ]
    .map(([, group]) => {
      const { visit } = itemAt(group, 0);
      return {
        campaign: String(visit.campaign),
        source: visit.source,
        medium: visit.medium,
        channel: visit.channel,
        ...totals(group, countsConversions),
      };
    })
    .toSorted(
      byKeys((campaign) => [
        -campaign.visits,
        campaign.campaign,
        campaign.source,
        campaign.medium ?? '',
      ]),
    )
    .slice(0, TOP_CAMPAIGNS);
}

export function demoAcquisitionWire(
  projectId: string,
  range: DateRange,
  now: Date,
): AcquisitionWire {
  const project = demoProjectOf(projectId);
  const entries = entriesOf(
    demoVisitsIn(project, demoScopeOf(range, now)),
    project.conversionEvent,
  );
  const byDate = groupedBy(entries, (entry) => visitDate(entry.visit));
  const countsConversions = project.conversionEvent !== null;
  return {
    days: demoDays(range).map((date) => ({
      date,
      by_channel: groupOf(byDate, date).reduce<ChannelCounts>(
        (counts, { visit }) => ({ ...counts, [visit.channel]: counts[visit.channel] + 1 }),
        noVisits(),
      ),
    })),
    sources: sourcesOf(entries, countsConversions),
    campaigns: campaignsOf(entries, countsConversions),
  };
}

export function demoAcquisitionReport(
  projectId: string,
  range: DateRange,
  now: Date,
): AcquisitionReport {
  return acquisitionResponseSchema.parse(demoAcquisitionWire(projectId, range, now));
}
