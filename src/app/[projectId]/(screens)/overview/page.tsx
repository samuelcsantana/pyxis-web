import { OverviewReportView } from '@/components/overview/overview-report-view';
import { ScreenContent } from '@/components/shell/screen-content';
import { withKeptParameters } from '@/components/shell/kept-parameters';
import { linkWith, screenHref } from '@/components/shell/screens';
import { EmptyPeriod } from '@/components/states/empty-period';
import { FilteredPeriodEmpty } from '@/components/states/filtered-period-empty';
import type { CsvDownload } from '@/components/ui/csv-downloads';
import { emptyPeriodView, WIDER_PERIOD_QUERY } from '@/domain/empty-period';
import { hasActivity, overviewKpis, plottableKpis } from '@/domain/overview';
import { chartMetric } from '@/domain/overview-chart';
import { OVERVIEW_TABLES, overviewTableLabel } from '@/domain/overview-export';
import {
  daysBetween,
  describePeriod,
  type PeriodSearch,
  periodQuery,
  resolvePeriod,
  todayIn,
} from '@/domain/period';
import { filteredPeriodLabel } from '@/domain/applied-visit-filters';
import {
  type DashboardSearch,
  dashboardFiltersOf,
  hasDashboardFilters,
  withDashboardFilters,
} from '@/domain/dashboard-filters';
import { chosenGoal, goalQuery, withKnownReachedGoal } from '@/domain/goals';
import { projectCurrency } from '@/domain/currency';
import { getI18n } from '@/i18n/get-messages';
import type { I18n } from '@/i18n/i18n';
import { apiBaseUrl } from '@/lib/api-config';
import { projectOrNotFound, readOrSignIn } from '@/lib/current-admin';
import { exportHref, TABLE_PARAMETER } from '@/lib/csv-export';
import { screenMetadata } from '@/lib/screen-metadata';
import { screenRowFilters } from '@/lib/row-filters';
import { createOverviewService } from '@/services/overview/overview-service.factory';
import { createGoalsService } from '@/services/goals/goals-service.factory';
import { projectGoals } from '@/lib/project-goals';
import { SCREEN_WIDTH } from '@/components/shell/screen-width';

export const generateMetadata = screenMetadata('overview');

export interface OverviewSearch extends PeriodSearch, DashboardSearch {
  readonly metric?: string | string[];
  readonly goal?: string | string[];
}

export interface OverviewPageProps {
  readonly params: Promise<{ readonly projectId: string }>;
  readonly searchParams: Promise<OverviewSearch>;
}

function overviewDownloads(projectId: string, query: string, i18n: I18n): readonly CsvDownload[] {
  return OVERVIEW_TABLES.map((table) => ({
    label: overviewTableLabel(table, i18n),
    href: exportHref(
      projectId,
      'overview',
      withKeptParameters(query, { [TABLE_PARAMETER]: table }),
    ),
  }));
}

export default async function OverviewPage({ params, searchParams }: OverviewPageProps) {
  const { project } = await projectOrNotFound((await params).projectId);
  const search = await searchParams;
  const now = new Date();
  const period = resolvePeriod(search, project.timezone, now);
  const today = todayIn(project.timezone, now);
  const [i18n, goals] = await Promise.all([getI18n(), projectGoals(project.id)]);
  const { filters } = withKnownReachedGoal(dashboardFiltersOf(search, i18n), goals, i18n);
  const chosen = chosenGoal(goals, search.goal, i18n);
  const scope = { from: period.from, to: period.to, filters };
  const [report, timeOfDay, summary] = await readOrSignIn(() => {
    const service = createOverviewService();
    return Promise.all([
      service.overview(project.id, { ...scope, goal: chosen.askedId }),
      service.timeOfDay(project.id, scope),
      goals.length === 0 ? null : createGoalsService().summary(project.id, scope),
    ]);
  });
  const filtered = hasDashboardFilters(filters);
  const query = withDashboardFilters(periodQuery(period), filters);
  const downloadQuery = withKeptParameters(query, goalQuery(chosen));
  const compared = {
    days: daysBetween(period.from, period.to),
    endsToday: period.to === today,
    filtered,
  };
  const kpis = overviewKpis(report, compared, chosen.goal, projectCurrency(project), i18n);
  const metric = chartMetric(search.metric, plottableKpis(kpis));
  return (
    <ScreenContent
      readAt={now.getTime()}
      filtered={filtered}
      className={`flex ${SCREEN_WIDTH} flex-col gap-3.5 p-4 sm:gap-6 sm:px-8 sm:pt-7 sm:pb-12`}
    >
      {hasActivity(report) ? (
        <OverviewReportView
          report={report}
          timeOfDay={timeOfDay}
          kpis={kpis}
          metric={metric}
          projectId={project.id}
          goals={goals}
          chosen={chosen}
          summary={summary}
          currency={projectCurrency(project)}
          periodLabel={filteredPeriodLabel(describePeriod(period, i18n), filters, goals, i18n)}
          endsToday={compared.endsToday}
          filteredHref={(screen, filter) => linkWith(screenHref(project.id, screen, query), filter)}
          downloads={overviewDownloads(project.id, downloadQuery, i18n)}
          rowFilter={screenRowFilters(project.id, 'overview', search, filters, i18n)}
          i18n={i18n}
        />
      ) : filtered ? (
        <FilteredPeriodEmpty
          periodLabel={describePeriod(period, i18n)}
          removeFiltersHref={screenHref(project.id, 'overview', periodQuery(period))}
          i18n={i18n}
        />
      ) : (
        <EmptyPeriod
          view={emptyPeriodView(project, period, i18n)}
          widerPeriodHref={screenHref(project.id, 'overview', WIDER_PERIOD_QUERY)}
          endpoint={apiBaseUrl()}
          i18n={i18n}
        />
      )}
    </ScreenContent>
  );
}
