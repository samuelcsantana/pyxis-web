import { barWidth, formatCount, formatPercent, formatQuantity, NO_VALUE, rate } from './metrics';
import type { PropertyBreakdownReport, PropertyBreakdownWire } from './property-breakdown.schema';

export type { PropertyBreakdownReport, PropertyBreakdownWire };

export const OTHER_VALUES_LABEL = 'Other values';

export interface PropertyValueRow {
  readonly value: string;
  readonly count: string;
  readonly visits: string;
  readonly share: string;
  readonly barWidth: string;
}

export interface PropertyKeyView {
  readonly key: string;
  readonly carriedBy: string;
  readonly rows: readonly PropertyValueRow[];
  readonly other: PropertyValueRow | null;
}

function valueRow(value: string, count: number, visits: string, keyEvents: number) {
  return {
    value,
    count: formatCount(count),
    visits,
    share: formatPercent(rate(count, keyEvents)),
    barWidth: barWidth(count, keyEvents),
  };
}

export function propertyKeyViews(report: PropertyBreakdownReport): readonly PropertyKeyView[] {
  return report.keys.map((key) => ({
    key: key.key,
    carriedBy: formatQuantity(key.events, 'event', 'events'),
    rows: key.values.map((value) =>
      valueRow(value.value, value.count, formatCount(value.visits), key.events),
    ),
    other:
      key.otherCount === 0
        ? null
        : valueRow(OTHER_VALUES_LABEL, key.otherCount, NO_VALUE, key.events),
  }));
}
