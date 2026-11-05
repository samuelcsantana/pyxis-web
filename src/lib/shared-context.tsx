import type { ReactNode } from 'react';
import { SharedEmptyPeriod } from '@/components/share/shared-empty-period';
import type { ScreenSearch } from '@/components/shell/screen-search';
import { FilteredPeriodEmpty } from '@/components/states/filtered-period-empty';
import { filteredPeriodLabel } from '@/domain/applied-visit-filters';
import {
  type DashboardFilters,
  dashboardFiltersOf,
  hasDashboardFilters,
} from '@/domain/dashboard-filters';
import { WIDER_PERIOD_QUERY } from '@/domain/empty-period';
import { withKnownReachedGoal } from '@/domain/goals';
import { describePeriod, type Period, periodQuery, resolvePeriod } from '@/domain/period';
import {
  type SharedProject,
  type SharedRequest,
  type SharedScreen,
  sharedApiPath,
  sharedFiltersOf,
  sharedPageHref,
} from '@/domain/shared-project';
import type { I18n } from '@/i18n/i18n';
import type { ReportScope } from '@/services/date-range';
import { reportQuery } from '@/services/date-range';

export interface SharedContext {
  readonly token: string;
  readonly project: SharedProject;
  readonly search: ScreenSearch;
  readonly i18n: I18n;
  readonly now: Date;
}

export type SharedAnswers = Readonly<Record<string, unknown>>;

export interface SharedScope {
  readonly period: Period;
  readonly filters: DashboardFilters;
  readonly filtered: boolean;
  readonly scope: ReportScope;
}

export function sharedScopeOf({ project, search, i18n, now }: SharedContext): SharedScope {
  const period = resolvePeriod(search, project.timezone, now);
  const { filters: dashboardFilters } = withKnownReachedGoal(
    dashboardFiltersOf(search, i18n),
    project.goals,
    i18n,
  );
  const filters = sharedFiltersOf(dashboardFilters);
  return {
    period,
    filters,
    filtered: hasDashboardFilters(filters),
    scope: { from: period.from, to: period.to, filters },
  };
}

export function sharedReport(
  context: SharedContext,
  key: string,
  report: string,
  scope: ReportScope,
  extra: Readonly<Record<string, string>> = {},
): SharedRequest {
  const query = new URLSearchParams(reportQuery(scope));
  for (const [name, value] of Object.entries(extra)) {
    query.set(name, value);
  }
  return { key, path: sharedApiPath(context.token, report, query.toString()) };
}

export function sharedPeriodLabel(context: SharedContext, shared: SharedScope): string {
  return filteredPeriodLabel(
    describePeriod(shared.period, context.i18n),
    shared.filters,
    context.project.goals,
    context.i18n,
  );
}

export function sharedEmptyState(
  context: SharedContext,
  screen: SharedScreen,
  shared: SharedScope,
): ReactNode {
  const page = sharedPageHref(context.token, screen);
  return shared.filtered ? (
    <FilteredPeriodEmpty
      periodLabel={describePeriod(shared.period, context.i18n)}
      removeFiltersHref={`${page}?${periodQuery(shared.period)}`}
      i18n={context.i18n}
    />
  ) : (
    <SharedEmptyPeriod widerPeriodHref={`${page}?${WIDER_PERIOD_QUERY}`} i18n={context.i18n} />
  );
}
