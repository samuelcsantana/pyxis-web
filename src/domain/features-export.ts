import type { I18n } from '@/i18n/i18n';
import type { CsvTable } from './csv';
import { type Feature, type FeatureKind, matchingFeatures } from './features';

export function featuresTableLabel(kind: FeatureKind, i18n: I18n): string {
  return i18n.t(`exports.features.${kind}`);
}

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
