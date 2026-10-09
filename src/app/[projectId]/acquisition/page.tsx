import { CampaignsTable } from '@/components/acquisition/campaigns-table';
import { ChannelChart } from '@/components/acquisition/channel-chart';
import { SourcesTable } from '@/components/acquisition/sources-table';
import { MainContent } from '@/components/shell/main-content';
import { withKeptParameters } from '@/components/shell/period-selector';
import { linkWith, screenHref, screenLabelKey } from '@/components/shell/screens';
import { Topbar } from '@/components/shell/topbar';
import { EmptyPeriod } from '@/components/states/empty-period';
import { type CsvDownload, CsvDownloads } from '@/components/ui/csv-downloads';
import { emptyPeriodView, WIDER_PERIOD_QUERY } from '@/domain/empty-period';
import { StatCard } from '@/components/ui/stat-card';
import {
  type AcquisitionReport,
  type CampaignRow,
  campaignRows,
  type Channel,
  paidVisits,
  sourceRows,
  topChannel,
  visitsTotal,
} from '@/domain/acquisition';
import { ACQUISITION_TABLES, acquisitionTableLabel } from '@/domain/acquisition-export';
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
import { createAcquisitionService } from '@/services/acquisition/acquisition-service.factory';

export const generateMetadata = screenMetadata('acquisition');

export interface AcquisitionPageProps {
  readonly params: Promise<{ readonly projectId: string }>;
  readonly searchParams: Promise<PeriodSearch>;
}

interface AcquisitionReportViewProps {
  readonly report: AcquisitionReport;
  readonly period: Period;
  readonly downloads: readonly CsvDownload[];
  readonly channelVisitsHref: (channel: Channel) => string;
  readonly campaignVisitsHref: (row: CampaignRow) => string;
  readonly i18n: I18n;
  readonly sourceVisitsHref: (source: string) => string;
}

function acquisitionDownloads(
  projectId: string,
  period: Period,
  i18n: I18n,
): readonly CsvDownload[] {
  return ACQUISITION_TABLES.map((table) => ({
    label: acquisitionTableLabel(table, i18n),
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
  campaignVisitsHref,
  i18n,
  sourceVisitsHref,
}: AcquisitionReportViewProps) {
  const paid = paidVisits(report.days, i18n);
  const top = topChannel(report.days, i18n);
  return (
    <>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,8rem),1fr))] gap-2.5 sm:grid-cols-[repeat(auto-fit,minmax(13.75rem,1fr))] sm:gap-4">
        <StatCard
          id="paid-visits"
          label={i18n.t('acquisition.paidVisits')}
          value={paid.value}
          note={paid.note}
        />
        <StatCard id="top-channel" label={top.label} value={top.value} note={top.note} />
      </div>
      <ChannelChart days={report.days} periodLabel={describePeriod(period, i18n)} i18n={i18n} />
      <SourcesTable
        rows={sourceRows(report.sources, i18n)}
        channelVisitsHref={channelVisitsHref}
        i18n={i18n}
        sourceVisitsHref={sourceVisitsHref}
      />
      <CampaignsTable
        rows={campaignRows(report.campaigns, i18n)}
        campaignVisitsHref={campaignVisitsHref}
        i18n={i18n}
      />
      <CsvDownloads downloads={downloads} i18n={i18n} />
      <p className="text-xs leading-[18px] text-muted">{i18n.t('acquisition.footnote')}</p>
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
  const visitsPath = screenHref(project.id, 'visits', periodQuery(period));
  return (
    <>
      <Topbar
        title={i18n.t(screenLabelKey('acquisition'))}
        subtitle={i18n.t('acquisition.subtitle', { project: project.name })}
        basePath={screenHref(project.id, 'acquisition')}
        period={period}
        today={todayIn(project.timezone, now)}
        i18n={i18n}
      />
      <MainContent className="flex w-full max-w-310 flex-col gap-3.5 p-4 sm:gap-5 sm:px-8 sm:pt-7 sm:pb-12">
        {visitsTotal(report.days) > 0 ? (
          <AcquisitionReportView
            report={report}
            period={period}
            downloads={acquisitionDownloads(project.id, period, i18n)}
            channelVisitsHref={(channel) => linkWith(visitsPath, { channel })}
            sourceVisitsHref={(source) => linkWith(visitsPath, { source })}
            campaignVisitsHref={({ campaign, source }) =>
              linkWith(visitsPath, { campaign, source })
            }
            i18n={i18n}
          />
        ) : (
          <EmptyPeriod
            view={emptyPeriodView(project, period, i18n)}
            widerPeriodHref={screenHref(project.id, 'acquisition', WIDER_PERIOD_QUERY)}
            endpoint={apiBaseUrl()}
            i18n={i18n}
          />
        )}
      </MainContent>
    </>
  );
}
