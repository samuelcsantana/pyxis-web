import type { CsvTable } from './csv';
import { type Feature, type FeatureKind, matchingFeatures } from './features';

export const FEATURES_TABLE_LABELS: Readonly<Record<FeatureKind, string>> = {
  events: 'Events',
  screens: 'Screens',
};

const COLUMNS: Readonly<Record<FeatureKind, readonly string[]>> = {
  events: ['event', 'count', 'visits'],
  screens: ['screen', 'page_views', 'visits'],
};

export function featuresCsvTable(
  items: readonly Feature[],
  kind: FeatureKind,
  query: string,
): CsvTable {
  return {
    columns: COLUMNS[kind],
    rows: matchingFeatures(items, kind, query).map((item) => [item.name, item.count, item.visits]),
  };
}
