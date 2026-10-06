import {
  type FeatureKind,
  type FeaturesReport,
  featuresResponseSchema,
  type FeaturesWire,
} from '@/domain/features';
import type { DateRange } from '../date-range';
import { demoCount, demoDays } from '../demo/demo-series';

interface DemoFeature {
  readonly name: string;
  readonly perDay: number;
  readonly visitsPerCount: number;
}

const DEMO_FEATURES: Readonly<Record<FeatureKind, readonly DemoFeature[]>> = {
  events: [
    { name: 'calculator_result_shown', perDay: 40, visitsPerCount: 0.85 },
    { name: 'cta_clicked', perDay: 29, visitsPerCount: 0.81 },
    { name: 'login_completed', perDay: 13, visitsPerCount: 0.66 },
    { name: 'order_created', perDay: 11, visitsPerCount: 0.35 },
    { name: 'signup_submitted', perDay: 9, visitsPerCount: 0.94 },
    { name: 'signup_completed', perDay: 7, visitsPerCount: 1 },
    { name: 'product_created', perDay: 4, visitsPerCount: 0.46 },
    { name: 'report_exported', perDay: 2, visitsPerCount: 0.47 },
  ],
  screens: [
    { name: '/dashboard', perDay: 71, visitsPerCount: 0.19 },
    { name: '/orders', perDay: 44, visitsPerCount: 0.24 },
    { name: '/calculator', perDay: 37, visitsPerCount: 0.85 },
    { name: '/pricing', perDay: 25, visitsPerCount: 0.82 },
    { name: '/products', perDay: 20, visitsPerCount: 0.31 },
    { name: '/orders/:id', perDay: 13, visitsPerCount: 0.31 },
    { name: '/reports', perDay: 10, visitsPerCount: 0.33 },
    { name: '/settings', perDay: 6, visitsPerCount: 0.81 },
  ],
};

export function demoFeaturesWire(range: DateRange, kind: FeatureKind): FeaturesWire {
  const days = demoDays(range);
  return {
    items: DEMO_FEATURES[kind]
      .map((feature, index) => {
        const daily = days.map((date) => demoCount(date, feature.perDay, index + 10));
        const count = daily.reduce((sum, value) => sum + value, 0);
        return {
          name: feature.name,
          count,
          visits: Math.round(count * feature.visitsPerCount),
          daily,
        };
      })
      .toSorted((left, right) => right.count - left.count),
  };
}

export function demoFeaturesReport(range: DateRange, kind: FeatureKind): FeaturesReport {
  return featuresResponseSchema.parse(demoFeaturesWire(range, kind));
}
