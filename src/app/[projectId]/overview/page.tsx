import { DailyActivityChart } from '@/components/overview/daily-activity-chart';
import { DayActivityFigures } from '@/components/overview/day-activity-figures';
import { KpiGrid } from '@/components/overview/kpi-grid';
import { TopEventsList } from '@/components/overview/top-events-list';
import { TopPagesTable } from '@/components/overview/top-pages-table';
import { withKeptParameters } from '@/components/shell/period-selector';
import { screenHref } from '@/components/shell/screens';
import { Topbar } from '@/components/shell/topbar';
import { NoActivityYet } from '@/components/states/no-activity-yet';
import { activityTotals, hasActivity, type OverviewReport, overviewKpis } from '@/domain/overview';
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
import { screenMetadata } from '@/lib/screen-metadata';
import { chosenTheme } from '@/lib/theme-cookie';
import { createOverviewService } from '@/services/overview/overview-service.factory';

export const generateMetadata = screenMetadata('Overview');

export interface OverviewPageProps {
  readonly params: Promise<{ readonly projectId: string }>;
  readonly searchParams: Promise<PeriodSearch>;
}

interface OverviewReportViewProps {
  readonly report: OverviewReport;
  readonly period: Period;
  readonly today: string;
  readonly visitsHref: (filter: Readonly<Record<string, string>>) => string;
}

function OverviewReportView({ report, period, today, visitsHref }: OverviewReportViewProps) {
  const compared = { days: daysBetween(period.from, period.to), endsToday: period.to === today };
  return (
    <>
      <KpiGrid kpis={overviewKpis(report, compared)} />
      {report.days.length === 1 ? (
        <DayActivityFigures days={report.days} periodLabel={describePeriod(period)} />
      ) : (
        <DailyActivityChart days={report.days} periodLabel={describePeriod(period)} />
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
      <main className="flex w-full max-w-310 flex-col gap-3.5 p-4 sm:gap-6 sm:px-8 sm:pt-7 sm:pb-12">
        {hasActivity(report) ? (
          <OverviewReportView
            report={report}
            period={period}
            today={today}
            visitsHref={(filter) =>
              screenHref(project.id, 'visits', withKeptParameters(periodQuery(period), filter))
            }
          />
        ) : (
          <NoActivityYet endpoint={apiBaseUrl()} />
        )}
      </main>
    </>
  );
}
