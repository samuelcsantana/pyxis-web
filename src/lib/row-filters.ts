import {
  type DashboardFilters,
  type RowFilterValues,
  toggledDashboardFilters,
  withDashboardFilters,
} from '@/domain/dashboard-filters';
import type { I18n } from '@/i18n/i18n';
import type { RowFilter } from '@/components/ui/row-filter-link';
import { screenOwnQuery } from '@/components/shell/dashboard-filters-row';
import type { ScreenSearch } from '@/components/shell/screen-search';
import { type ScreenSlug, screenHref } from '@/components/shell/screens';

export type RowFilterOf = (values: RowFilterValues, shown: string) => RowFilter;

export function rowFiltersOf(
  screenPath: string,
  ownQuery: string,
  filters: DashboardFilters,
  i18n: I18n,
): RowFilterOf {
  return (values, shown) => {
    const toggled = toggledDashboardFilters(filters, values);
    const query = withDashboardFilters(ownQuery, toggled.filters);
    const label = toggled.active
      ? i18n.t('rowFilter.remove', { value: shown })
      : i18n.t('rowFilter.add', { value: shown });
    return {
      href: query === '' ? screenPath : `${screenPath}?${query}`,
      active: toggled.active,
      label,
      title: toggled.active ? label : i18n.t('rowFilter.title', { value: shown }),
    };
  };
}

function isTextList(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

function definedOf(search: object): ScreenSearch {
  return Object.fromEntries(
    Object.entries(search).flatMap(([name, value]: [string, unknown]) =>
      typeof value === 'string' || isTextList(value) ? [[name, value]] : [],
    ),
  );
}

export function screenRowFilters(
  projectId: string,
  screen: ScreenSlug,
  search: object,
  filters: DashboardFilters,
  i18n: I18n,
): RowFilterOf {
  return rowFiltersOf(
    screenHref(projectId, screen),
    screenOwnQuery(screen, definedOf(search)),
    filters,
    i18n,
  );
}
