import type { ScreenSlug } from '@/components/shell/screens';
import { NoGoals } from '@/components/states/no-goals';
import { type CsvDownload, CsvDownloads } from '@/components/ui/csv-downloads';
import { changeToneRule } from '@/domain/glossary';
import {
  type ChosenGoal,
  type Goal,
  type GoalChoice,
  goalChoiceOf,
  type GoalRow,
  goalRows,
  type GoalsSummary,
} from '@/domain/goals';
import { eventLabel } from '@/domain/metrics';
import {
  activityTotals,
  type KpiView,
  type OverviewReport,
  plottableKpis,
} from '@/domain/overview';
import { type ChartMetric, overviewChart } from '@/domain/overview-chart';
import type { TimeOfDayReport } from '@/domain/time-of-day';
import type { I18n } from '@/i18n/i18n';
import type { RowFilterOf } from '@/lib/row-filters';
import { DayActivityFigures } from './day-activity-figures';
import { GoalPicker } from './goal-picker';
import { GoalsTable } from './goals-table';
import { KpiGrid } from './kpi-grid';
import { MetricChartArea, MetricSelection } from './metric-selection';
import { OverviewChartPanel } from './overview-chart-panel';
import { TopEventsList } from './top-events-list';
import { TopPagesTable } from './top-pages-table';
import { UniqueVisitorsPanel } from './unique-visitors-panel';
import { VisitStartsPanel } from './visit-starts-panel';

function footnote(i18n: I18n): string {
  return [
    i18n.t('glossary.visit'),
    i18n.t('glossary.identifiedUser'),
    i18n.t('glossary.conversion'),
    i18n.t('glossary.revenue'),
    i18n.t('glossary.write'),
    i18n.t('glossary.failure'),
    changeToneRule(i18n),
  ].join(' ');
}

export interface OverviewReportViewProps {
  readonly report: OverviewReport;
  readonly timeOfDay: TimeOfDayReport;
  readonly kpis: readonly KpiView[];
  readonly metric: ChartMetric;
  readonly projectId: string | null;
  readonly goals: readonly Goal[];
  readonly chosen: ChosenGoal;
  readonly summary: GoalsSummary | null;
  readonly currency: string;
  readonly periodLabel: string;
  readonly endsToday: boolean;
  readonly filteredHref: (
    screen: ScreenSlug,
    filter: Readonly<Record<string, string>>,
  ) => string | null;
  readonly downloads: readonly CsvDownload[];
  readonly rowFilter: RowFilterOf;
  readonly i18n: I18n;
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

export function OverviewReportView({
  report,
  timeOfDay,
  kpis,
  metric,
  projectId,
  goals,
  chosen,
  summary,
  currency,
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
      <MetricSelection available={plottableKpis(kpis)}>
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
        {goals.length === 0 && projectId !== null ? (
          <NoGoals projectId={projectId} i18n={i18n} />
        ) : null}
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
          rows={goalRows(summary, currency, i18n)}
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
      {downloads.length === 0 ? null : <CsvDownloads downloads={downloads} i18n={i18n} />}
      <p className="text-xs leading-[18px] text-muted">{footnote(i18n)}</p>
    </>
  );
}
