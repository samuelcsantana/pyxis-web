import { type DashboardFilters, dashboardFilterQuery } from '@/domain/dashboard-filters';
import { GOAL_PARAMETER } from '@/domain/goal-parameters';

export interface DateRange {
  readonly from: string;
  readonly to: string;
}

export interface ReportScope extends DateRange {
  readonly filters: DashboardFilters;
  readonly goal?: string | null;
}

export function rangeQuery(range: DateRange): string {
  return new URLSearchParams({ from: range.from, to: range.to }).toString();
}

export function reportQuery(scope: ReportScope): string {
  const query = new URLSearchParams(rangeQuery(scope));
  for (const [name, value] of dashboardFilterQuery(scope.filters)) {
    query.append(name, value);
  }
  if (scope.goal !== undefined && scope.goal !== null) {
    query.set(GOAL_PARAMETER, scope.goal);
  }
  return query.toString();
}
