import { z } from 'zod';
import { barWidth, formatCount, formatPercent, formatQuantity, NO_VALUE, rate } from './metrics';

export const OTHER_VALUES_LABEL = 'Other values';

export const propertyBreakdownResponseSchema = z
  .object({
    name: z.string(),
    events: z.number(),
    keys: z.array(
      z.object({
        key: z.string(),
        events: z.number(),
        values: z.array(z.object({ value: z.string(), count: z.number(), visits: z.number() })),
        other_count: z.number(),
      }),
    ),
  })
  .transform((body) => ({
    name: body.name,
    events: body.events,
    keys: body.keys.map((key) => ({
      key: key.key,
      events: key.events,
      values: key.values,
      otherCount: key.other_count,
    })),
  }));

export type PropertyBreakdownReport = z.output<typeof propertyBreakdownResponseSchema>;
export type PropertyBreakdownWire = z.input<typeof propertyBreakdownResponseSchema>;

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
