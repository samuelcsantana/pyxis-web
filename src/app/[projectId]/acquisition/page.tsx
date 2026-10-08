import { ChannelChart } from '@/components/acquisition/channel-chart';
import { SourcesTable } from '@/components/acquisition/sources-table';
import { MainContent } from '@/components/shell/main-content';
import { withKeptParameters } from '@/components/shell/period-selector';
import { linkWith, screenHref } from '@/components/shell/screens';
import { Topbar } from '@/components/shell/topbar';
import { EmptyPeriod } from '@/components/states/empty-period';
import { type CsvDownload, CsvDownloads } from '@/components/ui/csv-downloads';
import { emptyPeriodView, WIDER_PERIOD_QUERY } from '@/domain/empty-period';
import { StatCard } from '@/components/ui/stat-card';
import {
  type AcquisitionReport,
  type Channel,
  paidVisits,
  sourceRows,
  topChannel,
  visitsTotal,
} from '@/domain/acquisition';
import { ACQUISITION_TABLE_LABELS, ACQUISITION_TABLES } from '@/domain/acquisition-export';
import {
  describePeriod,
  type Period,
  type PeriodSearch,
  periodQuery,
  resolvePeriod,
  todayIn,
} from '@/domain/period';
import { getI18n } from '@/i18n/get-messages';
import type { I18n } from '@/i18n/i18n';
import { apiBaseUrl } from '@/lib/api-config';
import { exportHref, TABLE_PARAMETER } from '@/lib/csv-export';
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
  readonly downloads: readonly CsvDownload[];
  readonly channelVisitsHref: (channel: Channel) => string;
  readonly i18n: I18n;
}

function acquisitionDownloads(projectId: string, period: Period): readonly CsvDownload[] {
  return ACQUISITION_TABLES.map((table) => ({
    label: ACQUISITION_TABLE_LABELS[table],
    href: exportHref(
      projectId,
      'acquisition',
      withKeptParameters(periodQuery(period), { [TABLE_PARAMETER]: table }),
    ),
  }));
}

function AcquisitionReportView({
  report,
  period,
  downloads,
  channelVisitsHref,
  i18n,
}: AcquisitionReportViewProps) {
  const paid = paidVisits(report.days, i18n);
  const top = topChannel(report.days, i18n);
  return (
    <>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,8rem),1fr))] gap-2.5 sm:grid-cols-[repeat(auto-fit,minmax(13.75rem,1fr))] sm:gap-4">
        <StatCard id="paid-visits" label="Paid visits" value={paid.value} note={paid.note} />
        <StatCard id="top-channel" label={top.label} value={top.value} note={top.note} />
      </div>
      <ChannelChart days={report.days} periodLabel={describePeriod(period, i18n)} i18n={i18n} />
      <SourcesTable rows={sourceRows(report.sources, i18n)} channelVisitsHref={channelVisitsHref} />
      <CsvDownloads downloads={downloads} />
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
  const i18n = await getI18n();
  return (
    <>
      <Topbar
        title="Acquisition"
        subtitle={`Where visits to ${project.name} come from`}
        basePath={screenHref(project.id, 'acquisition')}
        period={period}
        today={todayIn(project.timezone, now)}
        theme={await chosenTheme()}
        i18n={i18n}
      />
      <MainContent className="flex w-full max-w-310 flex-col gap-3.5 p-4 sm:gap-5 sm:px-8 sm:pt-7 sm:pb-12">
        {visitsTotal(report.days) > 0 ? (
          <AcquisitionReportView
            report={report}
            period={period}
            downloads={acquisitionDownloads(project.id, period)}
            channelVisitsHref={(channel) =>
              linkWith(screenHref(project.id, 'visits', periodQuery(period)), { channel })
            }
            i18n={i18n}
          />
        ) : (
          <EmptyPeriod
            view={emptyPeriodView(project, period, i18n)}
            widerPeriodHref={screenHref(project.id, 'acquisition', WIDER_PERIOD_QUERY)}
            endpoint={apiBaseUrl()}
          />
        )}
      </MainContent>
    </>
  );
}
