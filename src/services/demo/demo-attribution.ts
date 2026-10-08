import type { Channel } from '@/domain/acquisition';
import type { DemoSource } from './demo-catalog';
import type { DemoAttribution } from './demo-records';
import type { DemoVisit } from './demo-visits';

export interface DemoAttributedVisit {
  readonly visit: DemoVisit;
  readonly attribution: DemoAttribution;
}

const WHOLE_SHARE = 1;
const DIRECT: DemoAttribution = { source: '(direct)', medium: null, campaign: null };

function sourceAttributions(source: DemoSource): readonly DemoAttribution[] {
  const tagged = source.campaigns.map(([campaign]) => ({
    source: source.source,
    medium: source.medium,
    campaign,
  }));
  const taggedShare = source.campaigns.reduce((sum, [, share]) => sum + share, 0);
  return taggedShare < WHOLE_SHARE
    ? [...tagged, { source: source.source, medium: source.medium, campaign: null }]
    : tagged;
}

function channelAttributions(
  sources: readonly DemoSource[],
  channel: Channel,
): readonly DemoAttribution[] {
  return sources.filter((source) => source.channel === channel).flatMap(sourceAttributions);
}

function pick<Item>(items: readonly Item[], index: number, fallback: Item): Item {
  return items[index % items.length] ?? fallback;
}

export function demoAttributedVisits(project: {
  readonly sources: readonly DemoSource[];
  readonly visits: readonly DemoVisit[];
}): readonly DemoAttributedVisit[] {
  return project.visits.map((visit, index) => {
    const position = project.visits
      .slice(0, index)
      .filter((earlier) => earlier.channel === visit.channel).length;
    const options = channelAttributions(project.sources, visit.channel);
    return { visit, attribution: pick(options, position, DIRECT) };
  });
}
