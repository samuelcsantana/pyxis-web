import {
  type DevicesReport,
  devicesResponseSchema,
  type DevicesWire,
  OTHER_VALUE,
} from '@/domain/devices';
import type { DateRange } from '../date-range';
import { demoCountsConversions } from '../demo/demo-projects';
import { demoDays, demoVisitsOn } from '../demo/demo-series';

interface DemoShare {
  readonly value: string;
  readonly share: number;
  readonly conversionRate: number;
}

const DEFAULT_CONVERSION_RATE = 0.045;

function shares(entries: readonly (readonly [string, number])[]): readonly DemoShare[] {
  return entries.map(([value, share]) => ({
    value,
    share,
    conversionRate: DEFAULT_CONVERSION_RATE,
  }));
}

const DEVICE_TYPES: readonly DemoShare[] = [
  { value: 'mobile', share: 0.62, conversionRate: 0.037 },
  { value: 'desktop', share: 0.34, conversionRate: 0.059 },
  { value: 'tablet', share: 0.04, conversionRate: 0.042 },
];

const BROWSERS = shares([
  ['chrome', 0.48],
  ['safari', 0.31],
  ['samsung', 0.11],
  ['firefox', 0.05],
  ['edge', 0.03],
  [OTHER_VALUE, 0.02],
]);

const OPERATING_SYSTEMS = shares([
  ['android', 0.44],
  ['ios', 0.29],
  ['windows', 0.18],
  ['macos', 0.07],
  ['linux', 0.01],
  [OTHER_VALUE, 0.01],
]);

const COUNTRIES = shares([
  ['BR', 0.862],
  ['PT', 0.056],
  ['US', 0.036],
  ['AR', 0.017],
  [OTHER_VALUE, 0.029],
]);

function breakdown(total: number, entries: readonly DemoShare[], countsConversions: boolean) {
  const rounded = entries.map((entry) => ({ entry, visits: Math.round(total * entry.share) }));
  const remainder = total - rounded.reduce((sum, item) => sum + item.visits, 0);
  return rounded.map(({ entry, visits }, index) => {
    const count = visits + (index === 0 ? remainder : 0);
    return {
      value: entry.value,
      visits: count,
      conversions: countsConversions ? Math.round(count * entry.conversionRate) : null,
    };
  });
}

export function demoDevicesWire(projectId: string, range: DateRange): DevicesWire {
  const total = demoDays(range).reduce((sum, date) => sum + demoVisitsOn(date), 0);
  const countsConversions = demoCountsConversions(projectId);
  return {
    device_types: breakdown(total, DEVICE_TYPES, countsConversions),
    browsers: breakdown(total, BROWSERS, countsConversions),
    operating_systems: breakdown(total, OPERATING_SYSTEMS, countsConversions),
    countries: breakdown(total, COUNTRIES, countsConversions),
  };
}

export function demoDevicesReport(projectId: string, range: DateRange): DevicesReport {
  return devicesResponseSchema.parse(demoDevicesWire(projectId, range));
}
