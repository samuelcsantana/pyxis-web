import type { I18n } from '@/i18n/i18n';
import { barWidth, formatCount, formatPercent, NO_VALUE, rate } from './metrics';
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

function valueRow(value: string, count: number, visits: string, keyEvents: number, i18n: I18n) {
  return {
    value,
    count: formatCount(count, i18n),
    visits,
    share: formatPercent(rate(count, keyEvents), i18n),
    barWidth: barWidth(count, keyEvents),
  };
}

export function propertyKeyViews(
  report: PropertyBreakdownReport,
  i18n: I18n,
): readonly PropertyKeyView[] {
  return report.keys.map((key) => ({
    key: key.key,
    carriedBy: i18n.t('counts.event', { count: key.events }),
    rows: key.values.map((value) =>
      valueRow(value.value, value.count, formatCount(value.visits, i18n), key.events, i18n),
    ),
    other:
      key.otherCount === 0
        ? null
        : valueRow(OTHER_VALUES_LABEL, key.otherCount, NO_VALUE, key.events, i18n),
  }));
}
