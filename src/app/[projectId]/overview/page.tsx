import type { Metadata } from 'next';
import { DailyActivityChart } from '@/components/overview/daily-activity-chart';
import { KpiGrid } from '@/components/overview/kpi-grid';
import { TopEventsList } from '@/components/overview/top-events-list';
import { TopPagesTable } from '@/components/overview/top-pages-table';
import { screenHref } from '@/components/shell/screens';
import { Topbar } from '@/components/shell/topbar';
import { NoActivityYet } from '@/components/states/no-activity-yet';
import { activityTotals, hasActivity, type OverviewReport, overviewKpis } from '@/domain/overview';
import {
  daysBetween,
  describePeriod,
  type Period,
  type PeriodSearch,
  resolvePeriod,
  todayIn,
} from '@/domain/period';
import { apiBaseUrl } from '@/lib/api-config';
import { projectOrNotFound, readOrSignIn } from '@/lib/current-admin';
import { chosenTheme } from '@/lib/theme-cookie';
import { createOverviewService } from '@/services/overview/overview-service.factory';

export const metadata: Metadata = { title: 'Overview · Pyxis' };

export interface OverviewPageProps {
  readonly params: Promise<{ readonly projectId: string }>;
  readonly searchParams: Promise<PeriodSearch>;
}

function OverviewReportView({ report, period }: { report: OverviewReport; period: Period }) {
  return (
    <>
      <KpiGrid kpis={overviewKpis(report, daysBetween(period.from, period.to))} />
      <DailyActivityChart days={report.days} periodLabel={describePeriod(period)} />
      <div className="grid gap-3.5 sm:gap-4 xl:grid-cols-2">
        <TopPagesTable
          pages={report.topPages}
          totalPageViews={activityTotals(report.days).pageViews}
        />
        <TopEventsList events={report.topEvents} />
      </div>
    </>
  );
}

export default async function OverviewPage({ params, searchParams }: OverviewPageProps) {
  const { project } = await projectOrNotFound((await params).projectId);
  const now = new Date();
  const period = resolvePeriod(await searchParams, project.timezone, now);
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
        today={todayIn(project.timezone, now)}
        theme={await chosenTheme()}
      />
      <main className="flex w-full max-w-310 flex-col gap-3.5 p-4 sm:gap-6 sm:px-8 sm:pt-7 sm:pb-12">
        {hasActivity(report) ? (
          <OverviewReportView report={report} period={period} />
        ) : (
          <NoActivityYet endpoint={apiBaseUrl()} />
        )}
      </main>
    </>
  );
}
