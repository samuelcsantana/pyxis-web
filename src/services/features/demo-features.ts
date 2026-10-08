import { type FeatureKind, type FeaturesReport, type FeaturesWire } from '@/domain/features';
import { featuresResponseSchema } from '@/domain/features.schema';
import type { DateRange } from '../date-range';
import { demoProjectOf } from '../demo/demo-projects';
import type { DemoEventRecord } from '../demo/demo-records';
import {
  demoRanking,
  demoScopeOf,
  demoVisitsIn,
  groupedBy,
  groupOf,
  isNamedEvent,
  isPageView,
} from '../demo/demo-scope';
import { demoDays } from '../demo/demo-series';

export const TOP_FEATURES = 50;

interface FeatureEvents {
  readonly matches: (event: DemoEventRecord) => boolean;
  readonly nameOf: (event: DemoEventRecord) => string;
}

const FEATURE_EVENTS: Readonly<Record<FeatureKind, FeatureEvents>> = {
  events: { matches: isNamedEvent, nameOf: (event) => event.name },
  screens: { matches: isPageView, nameOf: (event) => event.path },
};

export function demoFeaturesWire(
  projectId: string,
  range: DateRange,
  kind: FeatureKind,
  now: Date,
): FeaturesWire {
  const { matches, nameOf } = FEATURE_EVENTS[kind];
  const visits = demoVisitsIn(demoProjectOf(projectId), demoScopeOf(range, now));
  const byName = groupedBy(visits.flatMap((visit) => visit.events).filter(matches), nameOf);
  const days = demoDays(range);
  const daily = (name: string) => {
    const byDate = groupedBy(groupOf(byName, name), (event) => event.date);
    return days.map((date) => groupOf(byDate, date).length);
  };
  return {
    items: demoRanking(visits, matches, nameOf)
      .slice(0, TOP_FEATURES)
      .map((item) => ({
        name: item.name,
        count: item.count,
        visits: item.visits,
        daily: daily(item.name),
      })),
  };
}

export function demoFeaturesReport(
  projectId: string,
  range: DateRange,
  kind: FeatureKind,
  now: Date,
): FeaturesReport {
  return featuresResponseSchema.parse(demoFeaturesWire(projectId, range, kind, now));
}
