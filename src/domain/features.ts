import type { I18n } from '@/i18n/i18n';
import { barWidth, eventLabel, formatCount, formatPercent, rate } from './metrics';
import type { FeaturesReport, FeaturesWire } from './features.schema';

export type { FeaturesReport, FeaturesWire };

export const FEATURE_KINDS = ['events', 'screens'] as const;
export type FeatureKind = (typeof FEATURE_KINDS)[number];
export const DEFAULT_FEATURE_KIND: FeatureKind = 'events';
export const MAX_SEARCH_LENGTH = 100;

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

export function matchingFeatures(
  items: readonly Feature[],
  kind: FeatureKind,
  query: string,
): readonly Feature[] {
  return items.filter((item) => matches(item, featureLabel(kind, item.name), query));
}

export function featureRows(
  items: readonly Feature[],
  kind: FeatureKind,
  query: string,
  i18n: I18n,
): readonly FeatureRow[] {
  const total = items.reduce((sum, item) => sum + item.count, 0);
  const most = Math.max(0, ...items.map((item) => item.count));
  return matchingFeatures(items, kind, query).map((item) => ({
    name: item.name,
    label: featureLabel(kind, item.name),
    count: formatCount(item.count, i18n),
    visits: formatCount(item.visits, i18n),
    share: formatPercent(rate(item.count, total), i18n),
    barWidth: barWidth(item.count, most),
    daily: item.daily,
  }));
}
