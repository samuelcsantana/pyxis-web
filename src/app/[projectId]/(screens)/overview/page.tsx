import { DayActivityFigures } from '@/components/overview/day-activity-figures';
import { GoalPicker } from '@/components/overview/goal-picker';
import { GoalsTable } from '@/components/overview/goals-table';
import { KpiGrid } from '@/components/overview/kpi-grid';
import { MetricChartArea, MetricSelection } from '@/components/overview/metric-selection';
import { OverviewChartPanel } from '@/components/overview/overview-chart-panel';
import { TopEventsList } from '@/components/overview/top-events-list';
import { TopPagesTable } from '@/components/overview/top-pages-table';
import { UniqueVisitorsPanel } from '@/components/overview/unique-visitors-panel';
import { VisitStartsPanel } from '@/components/overview/visit-starts-panel';
import { ScreenContent } from '@/components/shell/screen-content';
import { withKeptParameters } from '@/components/shell/kept-parameters';
import { linkWith, type ScreenSlug, screenHref } from '@/components/shell/screens';
import { EmptyPeriod } from '@/components/states/empty-period';
import { FilteredPeriodEmpty } from '@/components/states/filtered-period-empty';
import { NoGoals } from '@/components/states/no-goals';
import { type CsvDownload, CsvDownloads } from '@/components/ui/csv-downloads';
import { emptyPeriodView, WIDER_PERIOD_QUERY } from '@/domain/empty-period';
import { changeToneRule } from '@/domain/glossary';
import {
  activityTotals,
  hasActivity,
  type KpiView,
  type OverviewReport,
  overviewKpis,
} from '@/domain/overview';
import { type ChartMetric, chartMetric, overviewChart } from '@/domain/overview-chart';
import { OVERVIEW_TABLES, overviewTableLabel } from '@/domain/overview-export';
import {
  daysBetween,
  describePeriod,
  type PeriodSearch,
  periodQuery,
  resolvePeriod,
  todayIn,
} from '@/domain/period';
import type { TimeOfDayReport } from '@/domain/time-of-day';
import { filteredPeriodLabel } from '@/domain/applied-visit-filters';
import {
  type DashboardSearch,
  dashboardFiltersOf,
  hasDashboardFilters,
  withDashboardFilters,
} from '@/domain/dashboard-filters';
import {
  type ChosenGoal,
  chosenGoal,
  type Goal,
  type GoalChoice,
  goalChoiceOf,
  type GoalRow,
  goalQuery,
  goalRows,
  type GoalsSummary,
  withKnownReachedGoal,
} from '@/domain/goals';
import { getI18n } from '@/i18n/get-messages';
import type { I18n } from '@/i18n/i18n';
import { apiBaseUrl } from '@/lib/api-config';
import { projectOrNotFound, readOrSignIn } from '@/lib/current-admin';
import { exportHref, TABLE_PARAMETER } from '@/lib/csv-export';
import { screenMetadata } from '@/lib/screen-metadata';
import { type RowFilterOf, screenRowFilters } from '@/lib/row-filters';
import { eventLabel } from '@/domain/metrics';
import { createOverviewService } from '@/services/overview/overview-service.factory';
import { createGoalsService } from '@/services/goals/goals-service.factory';
import { projectGoals } from '@/lib/project-goals';
import { SCREEN_WIDTH } from '@/components/shell/screen-width';

export const generateMetadata = screenMetadata('overview');

function footnote(i18n: I18n): string {
  return [
    i18n.t('glossary.visit'),
    i18n.t('glossary.identifiedUser'),
    i18n.t('glossary.conversion'),
    i18n.t('glossary.write'),
    i18n.t('glossary.failure'),
    changeToneRule(i18n),
  ].join(' ');
}

export interface OverviewSearch extends PeriodSearch, DashboardSearch {
  readonly metric?: string | string[];
  readonly goal?: string | string[];
}

export interface OverviewPageProps {
  readonly params: Promise<{ readonly projectId: string }>;
  readonly searchParams: Promise<OverviewSearch>;
}

interface OverviewReportViewProps {
  readonly report: OverviewReport;
  readonly timeOfDay: TimeOfDayReport;
  readonly kpis: readonly KpiView[];
  readonly metric: ChartMetric;
  readonly projectId: string;
  readonly goals: readonly Goal[];
  readonly chosen: ChosenGoal;
  readonly summary: GoalsSummary | null;
  readonly periodLabel: string;
  readonly endsToday: boolean;
  readonly filteredHref: (screen: ScreenSlug, filter: Readonly<Record<string, string>>) => string;
  readonly downloads: readonly CsvDownload[];
  readonly rowFilter: RowFilterOf;
  readonly i18n: I18n;
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

interface ConversionsControlProps {
  readonly choice: Exclude<GoalChoice, { readonly kind: 'none' }>;
  readonly i18n: I18n;
}

function ConversionsControl({ choice, i18n }: ConversionsControlProps) {
  switch (choice.kind) {
    case 'single':
      return <p className="relative text-xs font-medium text-ink wrap-anywhere">{choice.name}</p>;
    case 'picker':
      return (
        <GoalPicker
          goals={choice.goals}
          selected={choice.selected}
          first={choice.first}
          label={i18n.t('goals.picker')}
        />
      );
  }
}

function controlsOf(choice: GoalChoice, i18n: I18n) {
  return choice.kind === 'none'
    ? {}
    : { conversions: <ConversionsControl choice={choice} i18n={i18n} /> };
}

function OverviewReportView({
  report,
  timeOfDay,
  kpis,
  metric,
  projectId,
  goals,
  chosen,
  summary,
  periodLabel,
  endsToday,
  filteredHref,
  downloads,
  rowFilter,
  i18n,
}: OverviewReportViewProps) {
  const visitsHref = (filter: Readonly<Record<string, string>>) => filteredHref('visits', filter);
  const singleDay = report.days.length === 1;
  return (
    <>
      <MetricSelection available={kpis.map((kpi) => kpi.id)}>
        <KpiGrid
          kpis={kpis}
          drillDownHref={(drillDown) => filteredHref(drillDown.screen, drillDown.filter)}
          selectable={!singleDay}
          controls={controlsOf(goalChoiceOf(goals, chosen), i18n)}
          i18n={i18n}
        />
        {chosen.problem === null ? null : (
          <p role="status" className="text-caption leading-5 text-muted">
            {chosen.problem}
          </p>
        )}
        {goals.length === 0 ? <NoGoals projectId={projectId} i18n={i18n} /> : null}
        {singleDay ? (
          <DayActivityFigures days={report.days} periodLabel={periodLabel} i18n={i18n} />
        ) : (
          <MetricChartArea>
            <OverviewChartPanel
              chart={overviewChart(report, metric, i18n)}
              periodLabel={periodLabel}
              i18n={i18n}
            />
          </MetricChartArea>
        )}
      </MetricSelection>
      {summary === null ? null : (
        <GoalsTable
          rows={goalRows(summary, i18n)}
          visits={i18n.t('counts.visit', { count: summary.visits })}
          periodLabel={periodLabel}
          visitsHref={(goalId) => visitsHref({ reached_goal: goalId })}
          filterOf={(row: GoalRow) => rowFilter({ reachedGoal: row.id }, row.name)}
          i18n={i18n}
        />
      )}
      <UniqueVisitorsPanel
        visitors={report.visitors}
        endsToday={endsToday}
        periodLabel={periodLabel}
        visitsHref={(span) => visitsHref({ visitors: span })}
        i18n={i18n}
      />
      <div className="grid gap-3.5 sm:gap-4 xl:grid-cols-2">
        <TopPagesTable
          pages={report.topPages}
          totalPageViews={activityTotals(report.days).pageViews}
          visitsHref={(path) => visitsHref({ path })}
          filterOf={(path) => rowFilter({ path }, path)}
          i18n={i18n}
        />
        <TopEventsList
          events={report.topEvents}
          visitsHref={(name) => visitsHref({ event: name })}
          filterOf={(name) => rowFilter({ event: name }, eventLabel(name))}
          i18n={i18n}
        />
      </div>
      <VisitStartsPanel report={timeOfDay} periodLabel={periodLabel} i18n={i18n} />
      <CsvDownloads downloads={downloads} i18n={i18n} />
      <p className="text-xs leading-[18px] text-muted">{footnote(i18n)}</p>
    </>
  );
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
  const kpis = overviewKpis(report, compared, chosen.goal, i18n);
  const metric = chartMetric(
    search.metric,
    kpis.map((kpi) => kpi.id),
  );
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
