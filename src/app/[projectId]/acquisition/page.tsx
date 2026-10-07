import { ChannelChart } from '@/components/acquisition/channel-chart';
import { SourcesTable } from '@/components/acquisition/sources-table';
import { screenHref } from '@/components/shell/screens';
import { Topbar } from '@/components/shell/topbar';
import { NoActivityYet } from '@/components/states/no-activity-yet';
import { StatCard } from '@/components/ui/stat-card';
import {
  type AcquisitionReport,
  paidVisits,
  sourceRows,
  topChannel,
  visitsTotal,
} from '@/domain/acquisition';
import {
  describePeriod,
  type Period,
  type PeriodSearch,
  resolvePeriod,
  todayIn,
} from '@/domain/period';
import { apiBaseUrl } from '@/lib/api-config';
import { projectOrNotFound, readOrSignIn } from '@/lib/current-admin';
import { screenMetadata } from '@/lib/screen-metadata';
import { chosenTheme } from '@/lib/theme-cookie';
import { createAcquisitionService } from '@/services/acquisition/acquisition-service.factory';

export const generateMetadata = screenMetadata('Acquisition');

export interface AcquisitionPageProps {
  readonly params: Promise<{ readonly projectId: string }>;
  readonly searchParams: Promise<PeriodSearch>;
}

interface AcquisitionReportViewProps {
  readonly report: AcquisitionReport;
  readonly period: Period;
}

function AcquisitionReportView({ report, period }: AcquisitionReportViewProps) {
  const paid = paidVisits(report.days);
  const top = topChannel(report.days);
  return (
    <>
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-[repeat(auto-fill,minmax(13.75rem,1fr))] sm:gap-4">
        <StatCard id="paid-visits" label="Paid visits" value={paid.value} note={paid.note} />
        <StatCard id="top-channel" label="Top channel" value={top.value} note={top.note} />
      </div>
      <ChannelChart days={report.days} periodLabel={describePeriod(period)} />
      <SourcesTable rows={sourceRows(report.sources)} />
      <p className="text-xs leading-[18px] text-muted">
        An ad click is recognised by the click id in the landing URL. Pyxis keeps only the fact that
        it was there, never the id itself, and keeps just the domain of a referring site.
      </p>
    </>
  );
}

export default async function AcquisitionPage({ params, searchParams }: AcquisitionPageProps) {
  const { project } = await projectOrNotFound((await params).projectId);
  const now = new Date();
  const period = resolvePeriod(await searchParams, project.timezone, now);
  const report = await readOrSignIn(() =>
    createAcquisitionService().acquisition(project.id, { from: period.from, to: period.to }),
  );
  return (
    <>
      <Topbar
        title="Acquisition"
        subtitle={`Where visits to ${project.name} come from`}
        basePath={screenHref(project.id, 'acquisition')}
        period={period}
        today={todayIn(project.timezone, now)}
        theme={await chosenTheme()}
      />
      <main className="flex w-full max-w-310 flex-col gap-3.5 p-4 sm:gap-5 sm:px-8 sm:pt-7 sm:pb-12">
        {visitsTotal(report.days) > 0 ? (
          <AcquisitionReportView report={report} period={period} />
        ) : (
          <NoActivityYet endpoint={apiBaseUrl()} />
        )}
      </main>
    </>
  );
}
