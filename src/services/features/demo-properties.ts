import {
  type PropertyBreakdownReport,
  propertyBreakdownResponseSchema,
  type PropertyBreakdownWire,
} from '@/domain/property-breakdown';
import type { DateRange } from '../date-range';
import { demoFeaturesWire } from './demo-features';

const VALUES_PER_KEY = 10;

interface DemoProperty {
  readonly key: string;
  readonly carriedShare: number;
  readonly values: readonly (readonly [value: string, share: number])[];
}

const REPORT_PERIODS = Array.from(
  { length: 12 },
  (_, index) => [`2026-${String(index + 1).padStart(2, '0')}`, 1 / 12] as const,
);

const DEMO_PROPERTIES: Readonly<Record<string, readonly DemoProperty[]>> = {
  calculator_result_shown: [
    {
      key: 'calculator',
      carriedShare: 1,
      values: [
        ['ifood', 0.62],
        ['99food', 0.38],
      ],
    },
    {
      key: 'used_plan_preset',
      carriedShare: 1,
      values: [
        ['false', 0.59],
        ['true', 0.41],
      ],
    },
  ],
  cta_clicked: [
    {
      key: 'cta',
      carriedShare: 1,
      values: [
        ['start_trial', 0.7],
        ['create_account', 0.22],
        ['view_demo', 0.08],
      ],
    },
    {
      key: 'location',
      carriedShare: 1,
      values: [
        ['calculator_result', 0.45],
        ['hero', 0.3],
        ['pricing', 0.15],
        ['nav', 0.06],
        ['final_cta', 0.04],
      ],
    },
  ],
  login_completed: [
    {
      key: 'method',
      carriedShare: 1,
      values: [
        ['email_code', 0.55],
        ['google', 0.3],
        ['password', 0.15],
      ],
    },
  ],
  signup_submitted: [
    {
      key: 'method',
      carriedShare: 1,
      values: [
        ['email_code', 0.6],
        ['google', 0.28],
        ['password', 0.12],
      ],
    },
  ],
  signup_completed: [
    {
      key: 'method',
      carriedShare: 1,
      values: [
        ['email_code', 0.58],
        ['google', 0.3],
        ['password', 0.12],
      ],
    },
  ],
  order_created: [{ key: 'first', carriedShare: 0.14, values: [['true', 1]] }],
  report_exported: [
    {
      key: 'format',
      carriedShare: 1,
      values: [
        ['pdf', 0.6],
        ['csv', 0.4],
      ],
    },
    { key: 'period', carriedShare: 1, values: REPORT_PERIODS },
  ],
};

function split(
  total: number,
  values: DemoProperty['values'],
): readonly { value: string; count: number }[] {
  const exact = values.map(([value, share]) => ({ value, exact: share * total }));
  const left = total - exact.reduce((sum, entry) => sum + Math.floor(entry.exact), 0);
  const extra = new Set(
    exact
      .map((entry, index) => ({ index, remainder: entry.exact - Math.floor(entry.exact) }))
      .toSorted((a, b) => b.remainder - a.remainder || a.index - b.index)
      .slice(0, left)
      .map(({ index }) => index),
  );
  return exact.map((entry, index) => ({
    value: entry.value,
    count: Math.floor(entry.exact) + (extra.has(index) ? 1 : 0),
  }));
}

function keyWire(property: DemoProperty, events: number, visitsPerCount: number) {
  const carried = Math.round(events * property.carriedShare);
  const values = split(carried, property.values)
    .filter((entry) => entry.count > 0)
    .map(({ value, count }) => ({
      value,
      count,
      visits: Math.min(count, Math.max(1, Math.round(count * visitsPerCount))),
    }))
    .toSorted((a, b) => b.count - a.count || a.value.localeCompare(b.value));
  const shown = values.slice(0, VALUES_PER_KEY);
  const otherCount = carried - shown.reduce((sum, value) => sum + value.count, 0);
  return { key: property.key, events: carried, values: shown, other_count: otherCount };
}

export function demoPropertyBreakdownWire(range: DateRange, name: string): PropertyBreakdownWire {
  const feature = demoFeaturesWire(range, 'events').items.find((item) => item.name === name);
  if (feature === undefined) {
    return { name, events: 0, keys: [] };
  }
  const visitsPerCount = feature.visits / feature.count;
  return {
    name,
    events: feature.count,
    keys: (DEMO_PROPERTIES[name] ?? [])
      .map((property) => keyWire(property, feature.count, visitsPerCount))
      .filter((key) => key.events > 0)
      .toSorted((a, b) => b.events - a.events || a.key.localeCompare(b.key)),
  };
}

export function demoPropertyBreakdownReport(
  range: DateRange,
  name: string,
): PropertyBreakdownReport {
  return propertyBreakdownResponseSchema.parse(demoPropertyBreakdownWire(range, name));
}
