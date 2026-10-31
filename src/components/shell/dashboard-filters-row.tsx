import { appliedVisitFilters } from '@/domain/applied-visit-filters';
import { DASHBOARD_FILTER_PARAMETERS } from '@/domain/dashboard-filter-parameters';
import {
  type DashboardFilters,
  dashboardFiltersOf,
  hasDashboardFilters,
  NO_DASHBOARD_FILTERS,
  withDashboardFilters,
} from '@/domain/dashboard-filters';
import { getI18n } from '@/i18n/get-messages';
import type { I18n } from '@/i18n/i18n';
import { AppliedVisitFilters } from '@/components/visits/applied-visit-filters';
import { carriedParameters, type ScreenSearch } from './screen-search';
import { periodParameters, type ScreenSlug, screenHref } from './screens';

export const DASHBOARD_FILTERS_LABEL_ID = 'dashboard-filters';

const DASHBOARD_FILTER_NAMES: ReadonlySet<string> = new Set(DASHBOARD_FILTER_PARAMETERS);

export interface DashboardFiltersRowProps {
  readonly projectId: string;
  readonly screen: ScreenSlug;
  readonly search: ScreenSearch;
  readonly i18n: I18n;
}

function singleOf(search: ScreenSearch, name: string): string | null {
  const value = search[name];
  return typeof value === 'string' ? value : null;
}

export function screenOwnQuery(screen: ScreenSlug, search: ScreenSearch): string {
  const query = new URLSearchParams(periodParameters({ get: (name) => singleOf(search, name) }));
  for (const [name, value] of Object.entries(carriedParameters(screen, search))) {
    if (!DASHBOARD_FILTER_NAMES.has(name)) {
      query.set(name, value);
    }
  }
  return query.toString();
}

export function DashboardFiltersRow({ projectId, screen, search, i18n }: DashboardFiltersRowProps) {
  const { filters } = dashboardFiltersOf(search, i18n);
  if (!hasDashboardFilters(filters)) {
    return null;
  }
  const basePath = screenHref(projectId, screen);
  const ownQuery = screenOwnQuery(screen, search);
  const hrefWith = (kept: DashboardFilters) => {
    const query = withDashboardFilters(ownQuery, kept);
    return query === '' ? basePath : `${basePath}?${query}`;
  };
  return (
    <div>
      <AppliedVisitFilters
        applied={appliedVisitFilters({ ...filters, route: null }, i18n)}
        removeHref={hrefWith}
        clearHref={hrefWith(NO_DASHBOARD_FILTERS)}
        label={i18n.t('dashboardFilters.label')}
        clearLabel={i18n.t('dashboardFilters.removeAll')}
        note={i18n.t('dashboardFilters.newsPaused')}
        labelId={DASHBOARD_FILTERS_LABEL_ID}
        i18n={i18n}
      />
    </div>
  );
}

export interface FiltersSlotProps {
  readonly params: Promise<{ readonly projectId: string }>;
  readonly searchParams: Promise<ScreenSearch>;
}

export function filtersSlot(screen: ScreenSlug) {
  return async function FiltersSlot({ params, searchParams }: FiltersSlotProps) {
    const [{ projectId }, search, i18n] = await Promise.all([params, searchParams, getI18n()]);
    return (
      <DashboardFiltersRow projectId={projectId} screen={screen} search={search} i18n={i18n} />
    );
  };
}
