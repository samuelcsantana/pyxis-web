import { DayActivityFigures } from '@/components/overview/day-activity-figures';
import { KpiGrid } from '@/components/overview/kpi-grid';
import { OverviewChartPanel } from '@/components/overview/overview-chart-panel';
import { TopEventsList } from '@/components/overview/top-events-list';
import { TopPagesTable } from '@/components/overview/top-pages-table';
import { MainContent } from '@/components/shell/main-content';
import { withKeptParameters } from '@/components/shell/period-selector';
import { linkWith, type ScreenSlug, screenHref } from '@/components/shell/screens';
import { Topbar } from '@/components/shell/topbar';
import { EmptyPeriod } from '@/components/states/empty-period';
import { NoConversionEvent } from '@/components/states/no-conversion-event';
import { type CsvDownload, CsvDownloads } from '@/components/ui/csv-downloads';
import { emptyPeriodView, WIDER_PERIOD_QUERY } from '@/domain/empty-period';
import {
  CHANGE_TONE_RULE,
  CONVERSION_DEFINITION,
  FAILURE_DEFINITION,
  IDENTIFIED_USER_DEFINITION,
  VISIT_DEFINITION,
  WRITE_DEFINITION,
} from '@/domain/glossary';
import { activityTotals, hasActivity, type OverviewReport, overviewKpis } from '@/domain/overview';
import { ACTIVITY, overviewChart } from '@/domain/overview-chart';
import { OVERVIEW_TABLE_LABELS, OVERVIEW_TABLES } from '@/domain/overview-export';
import {
  daysBetween,
  describePeriod,
  type Period,
  type PeriodSearch,
  periodQuery,
  resolvePeriod,
  todayIn,
} from '@/domain/period';
import { apiBaseUrl } from '@/lib/api-config';
import { projectOrNotFound, readOrSignIn } from '@/lib/current-admin';
import { exportHref, TABLE_PARAMETER } from '@/lib/csv-export';
import { screenMetadata } from '@/lib/screen-metadata';
import { chosenTheme } from '@/lib/theme-cookie';
import { createOverviewService } from '@/services/overview/overview-service.factory';

export const generateMetadata = screenMetadata('Overview');

const FOOTNOTE = [
  VISIT_DEFINITION,
  IDENTIFIED_USER_DEFINITION,
  CONVERSION_DEFINITION,
  WRITE_DEFINITION,
  FAILURE_DEFINITION,
  CHANGE_TONE_RULE,
].join(' ');

export interface OverviewPageProps {
  readonly params: Promise<{ readonly projectId: string }>;
  readonly searchParams: Promise<PeriodSearch>;
}

interface OverviewReportViewProps {
  readonly report: OverviewReport;
  readonly conversionEvent: string | null;
  readonly period: Period;
  readonly today: string;
  readonly filteredHref: (screen: ScreenSlug, filter: Readonly<Record<string, string>>) => string;
  readonly downloads: readonly CsvDownload[];
}

function overviewDownloads(projectId: string, period: Period): readonly CsvDownload[] {
  return OVERVIEW_TABLES.map((table) => ({
    label: OVERVIEW_TABLE_LABELS[table],
    href: exportHref(
      projectId,
      'overview',
      withKeptParameters(periodQuery(period), { [TABLE_PARAMETER]: table }),
    ),
  }));
}

function OverviewReportView({
  report,
  conversionEvent,
  period,
  today,
  filteredHref,
  downloads,
}: OverviewReportViewProps) {
  const compared = { days: daysBetween(period.from, period.to), endsToday: period.to === today };
  const visitsHref = (filter: Readonly<Record<string, string>>) => filteredHref('visits', filter);
  return (
    <>
      <KpiGrid
        kpis={overviewKpis(report, compared, conversionEvent)}
        drillDownHref={(drillDown) => filteredHref(drillDown.screen, drillDown.filter)}
      />
      {conversionEvent === null ? <NoConversionEvent /> : null}
      {report.days.length === 1 ? (
        <DayActivityFigures days={report.days} periodLabel={describePeriod(period)} />
      ) : (
        <OverviewChartPanel
          chart={overviewChart(report, ACTIVITY)}
          periodLabel={describePeriod(period)}
        />
      )}
      <div className="grid gap-3.5 sm:gap-4 xl:grid-cols-2">
        <TopPagesTable
          pages={report.topPages}
          totalPageViews={activityTotals(report.days).pageViews}
          visitsHref={(path) => visitsHref({ path })}
        />
        <TopEventsList
          events={report.topEvents}
          visitsHref={(name) => visitsHref({ event: name })}
        />
      </div>
      <CsvDownloads downloads={downloads} />
      <p className="text-xs leading-[18px] text-muted">{FOOTNOTE}</p>
    </>
  );
}

export default async function OverviewPage({ params, searchParams }: OverviewPageProps) {
  const { project } = await projectOrNotFound((await params).projectId);
  const now = new Date();
  const period = resolvePeriod(await searchParams, project.timezone, now);
  const today = todayIn(project.timezone, now);
  const report = await readOrSignIn(() =>
    createOverviewService().overview(project.id, { from: period.from, to: period.to }),
  );
  return (
    <>
      <Topbar
        title="Overview"
        subtitle={`How ${project.name} was used in the period`}
        basePath={screenHref(project.id, 'overview')}
        period={period}
        today={today}
        theme={await chosenTheme()}
      />
      <MainContent className="flex w-full max-w-310 flex-col gap-3.5 p-4 sm:gap-6 sm:px-8 sm:pt-7 sm:pb-12">
        {hasActivity(report) ? (
          <OverviewReportView
            report={report}
            conversionEvent={project.conversionEvent}
            period={period}
            today={today}
            filteredHref={(screen, filter) =>
              linkWith(screenHref(project.id, screen, periodQuery(period)), filter)
            }
            downloads={overviewDownloads(project.id, period)}
          />
        ) : (
          <EmptyPeriod
            view={emptyPeriodView(project, period)}
            widerPeriodHref={screenHref(project.id, 'overview', WIDER_PERIOD_QUERY)}
            endpoint={apiBaseUrl()}
          />
        )}
      </MainContent>
    </>
  );
}
