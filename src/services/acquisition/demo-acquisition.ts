import {
  type AcquisitionReport,
  type AcquisitionWire,
  type Channel,
  CHANNELS,
} from '@/domain/acquisition';
import { acquisitionResponseSchema } from '@/domain/acquisition.schema';
import { demoProjectOf } from '../demo/demo-projects';
import type { DemoVisitRecord } from '../demo/demo-records';
import { itemAt } from '../demo/demo-random';
import {
  byKeys,
  countWhere,
  demoRevenueSum,
  demoRoundedRevenue,
  demoScopeOf,
  demoVisitsIn,
  groupedBy,
  groupOf,
  isPageView,
  visitDate,
  type DemoGoalTest,
  type DemoReportRange,
} from '../demo/demo-scope';
import { demoConversionTest, demoCountedGoal } from '../demo/demo-goals';
import { demoDays } from '../demo/demo-series';

type ChannelCounts = Readonly<Record<Channel, number>>;
type SourceWire = AcquisitionWire['sources'][number];
type CampaignWire = NonNullable<AcquisitionWire['campaigns']>[number];
type ChannelWire = NonNullable<AcquisitionWire['channels']>[number];

export const TOP_SOURCES = 20;
export const TOP_CAMPAIGNS = 20;
const KEY_SEPARATOR = '\u0000';

interface Entry {
  readonly visit: DemoVisitRecord;
  readonly conversions: number;
  readonly revenue: number;
}

interface Counting {
  readonly conversions: boolean;
  readonly revenue: boolean;
}

function noVisits(): ChannelCounts {
  return Object.fromEntries(CHANNELS.map((channel) => [channel, 0])) as Record<Channel, number>;
}

function entriesOf(visits: readonly DemoVisitRecord[], conversion: DemoGoalTest | null) {
  return visits
    .filter((visit) => visit.events.some(isPageView))
    .map((visit): Entry => {
      const converted = conversion === null ? [] : visit.events.filter(conversion);
      return { visit, conversions: converted.length, revenue: demoRevenueSum(converted) };
    });
}

function sourceKey({ visit }: Entry): string {
  return [visit.source, visit.medium ?? '', visit.channel].join(KEY_SEPARATOR);
}

function totals(group: readonly Entry[], counting: Counting) {
  const conversions = group.reduce((total, entry) => total + entry.conversions, 0);
  const converting = countWhere(group, (entry) => entry.conversions > 0);
  const revenue = group.reduce((total, entry) => total + entry.revenue, 0);
  return {
    visits: group.length,
    conversions: counting.conversions ? conversions : null,
    converting_visits: counting.conversions ? converting : null,
    from_ad_click_visits: countWhere(group, (entry) => entry.visit.fromAdClick),
    revenue: counting.revenue ? demoRoundedRevenue(revenue) : null,
  };
}

function channelsOf(entries: readonly Entry[], counting: Counting): ChannelWire[] {
  const byChannel = groupedBy(entries, (entry) => entry.visit.channel);
  return CHANNELS.map((channel) => ({ channel, ...totals(groupOf(byChannel, channel), counting) }));
}

function sourcesOf(entries: readonly Entry[], counting: Counting): SourceWire[] {
  return [...groupedBy(entries, sourceKey).values()]
    .map((group) => {
      const { visit } = itemAt(group, 0);
      return {
        source: visit.source,
        medium: visit.medium,
        channel: visit.channel,
        ...totals(group, counting),
      };
    })
    .toSorted(byKeys((source) => [-source.visits, source.source, source.medium ?? '']))
    .slice(0, TOP_SOURCES);
}

function campaignsOf(entries: readonly Entry[], counting: Counting): CampaignWire[] {
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
        ...totals(group, counting),
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
  range: DemoReportRange,
  now: Date,
): AcquisitionWire {
  const project = demoProjectOf(projectId);
  const conversion = demoConversionTest(project, range.goal);
  const entries = entriesOf(
    demoVisitsIn(project, demoScopeOf(range, now, range.filters)),
    conversion,
  );
  const byDate = groupedBy(entries, (entry) => visitDate(entry.visit));
  const counting: Counting = {
    conversions: conversion !== null,
    revenue: demoCountedGoal(project, range.goal)?.kind === 'event',
  };
  return {
    days: demoDays(range).map((date) => ({
      date,
      by_channel: groupOf(byDate, date).reduce<ChannelCounts>(
        (counts, { visit }) => ({ ...counts, [visit.channel]: counts[visit.channel] + 1 }),
        noVisits(),
      ),
    })),
    sources: sourcesOf(entries, counting),
    campaigns: campaignsOf(entries, counting),
    channels: channelsOf(entries, counting),
  };
}

export function demoAcquisitionReport(
  projectId: string,
  range: DemoReportRange,
  now: Date,
): AcquisitionReport {
  return acquisitionResponseSchema.parse(demoAcquisitionWire(projectId, range, now));
}
