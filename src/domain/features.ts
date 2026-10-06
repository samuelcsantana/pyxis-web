import { z } from 'zod';
import { barWidth, eventLabel, formatCount, formatPercent, rate } from './metrics';

export const FEATURE_KINDS = ['events', 'screens'] as const;
export type FeatureKind = (typeof FEATURE_KINDS)[number];
export const DEFAULT_FEATURE_KIND: FeatureKind = 'events';
export const MAX_SEARCH_LENGTH = 100;

export const featuresResponseSchema = z.object({
  items: z.array(
    z.object({
      name: z.string(),
      count: z.number(),
      visits: z.number(),
      daily: z.array(z.number()),
    }),
  ),
});

export type FeaturesReport = z.output<typeof featuresResponseSchema>;
export type FeaturesWire = z.input<typeof featuresResponseSchema>;
export type Feature = FeaturesReport['items'][number];

export interface FeatureSearch {
  readonly kind?: string | string[];
  readonly q?: string | string[];
}

function single(value: string | string[] | undefined): string | undefined {
  return typeof value === 'string' ? value : undefined;
}

export function featureKindOf(search: FeatureSearch): FeatureKind {
  const kind = single(search.kind);
  return FEATURE_KINDS.find((candidate) => candidate === kind) ?? DEFAULT_FEATURE_KIND;
}

export function searchQueryOf(search: FeatureSearch): string {
  return (single(search.q) ?? '').trim().slice(0, MAX_SEARCH_LENGTH);
}

export function featureLabel(kind: FeatureKind, name: string): string {
  return kind === 'events' ? eventLabel(name) : name;
}

export interface FeatureRow {
  readonly name: string;
  readonly label: string;
  readonly count: string;
  readonly visits: string;
  readonly share: string;
  readonly barWidth: string;
  readonly daily: readonly number[];
}

function matches(feature: Feature, label: string, query: string): boolean {
  const needle = query.toLowerCase();
  return feature.name.toLowerCase().includes(needle) || label.toLowerCase().includes(needle);
}

export function featureRows(
  items: readonly Feature[],
  kind: FeatureKind,
  query: string,
): readonly FeatureRow[] {
  const total = items.reduce((sum, item) => sum + item.count, 0);
  const most = Math.max(0, ...items.map((item) => item.count));
  return items
    .map((item) => ({ item, label: featureLabel(kind, item.name) }))
    .filter(({ item, label }) => matches(item, label, query))
    .map(({ item, label }) => ({
      name: item.name,
      label,
      count: formatCount(item.count),
      visits: formatCount(item.visits),
      share: formatPercent(rate(item.count, total)),
      barWidth: barWidth(item.count, most),
      daily: item.daily,
    }));
}
