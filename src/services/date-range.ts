import { type DashboardFilters, dashboardFilterQuery } from '@/domain/dashboard-filters';

export interface DateRange {
  readonly from: string;
  readonly to: string;
}

export interface ReportScope extends DateRange {
  readonly filters: DashboardFilters;
}

export function rangeQuery(range: DateRange): string {
  return new URLSearchParams({ from: range.from, to: range.to }).toString();
}

export function reportQuery(scope: ReportScope): string {
  const query = new URLSearchParams(rangeQuery(scope));
  for (const [name, value] of dashboardFilterQuery(scope.filters)) {
    query.append(name, value);
  }
  return query.toString();
}
