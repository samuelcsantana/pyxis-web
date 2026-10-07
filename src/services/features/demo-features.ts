import { type FeatureKind, type FeaturesReport, type FeaturesWire } from '@/domain/features';
import { featuresResponseSchema } from '@/domain/features.schema';
import type { DateRange } from '../date-range';
import { demoEventTotals, demoPageTotals, type DemoTotal } from '../demo/demo-dataset';
import { demoProjectOf } from '../demo/demo-projects';
import type { DemoProject } from '../demo/demo-catalog';

const TOTALS_OF_KIND: Readonly<
  Record<FeatureKind, (project: DemoProject, range: DateRange) => readonly DemoTotal[]>
> = {
  events: demoEventTotals,
  screens: demoPageTotals,
};

export function demoFeaturesWire(
  projectId: string,
  range: DateRange,
  kind: FeatureKind,
): FeaturesWire {
  return {
    items: TOTALS_OF_KIND[kind](demoProjectOf(projectId), range).map((total) => ({
      name: total.name,
      count: total.count,
      visits: total.visits,
      daily: [...total.daily],
    })),
  };
}

export function demoFeaturesReport(
  projectId: string,
  range: DateRange,
  kind: FeatureKind,
): FeaturesReport {
  return featuresResponseSchema.parse(demoFeaturesWire(projectId, range, kind));
}
