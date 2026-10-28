import { CampaignsTable } from '@/components/acquisition/campaigns-table';
import { type RowFilterOf, screenRowFilters } from '@/lib/row-filters';
import { ChannelChart } from '@/components/acquisition/channel-chart';
import { SourcesTable } from '@/components/acquisition/sources-table';
import { ScreenContent } from '@/components/shell/screen-content';
import { withKeptParameters } from '@/components/shell/kept-parameters';
import { linkWith, screenHref } from '@/components/shell/screens';
import { EmptyPeriod } from '@/components/states/empty-period';
import { FilteredPeriodEmpty } from '@/components/states/filtered-period-empty';
import { type CsvDownload, CsvDownloads } from '@/components/ui/csv-downloads';
import { emptyPeriodView, WIDER_PERIOD_QUERY } from '@/domain/empty-period';
import { StatCard } from '@/components/ui/stat-card';
import {
  type AcquisitionReport,
  type CampaignRow,
  campaignRows,
  type Channel,
  channelLabel,
  paidVisits,
  sourceRows,
  topChannel,
  visitsTotal,
} from '@/domain/acquisition';
import { ACQUISITION_TABLES, acquisitionTableLabel } from '@/domain/acquisition-export';
import { describePeriod, type PeriodSearch, periodQuery, resolvePeriod } from '@/domain/period';
import { filteredPeriodLabel } from '@/domain/applied-visit-filters';
import {
  type DashboardSearch,
  dashboardFiltersOf,
  hasDashboardFilters,
  withDashboardFilters,
} from '@/domain/dashboard-filters';
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
  readonly searchParams: Promise<PeriodSearch & DashboardSearch>;
}

interface AcquisitionReportViewProps {
  readonly report: AcquisitionReport;
  readonly periodLabel: string;
  readonly downloads: readonly CsvDownload[];
  readonly channelVisitsHref: (channel: Channel) => string;
  readonly campaignVisitsHref: (row: CampaignRow) => string;
  readonly i18n: I18n;
  readonly sourceVisitsHref: (source: string) => string;
  readonly rowFilter: RowFilterOf;
}

function acquisitionDownloads(
  projectId: string,
  query: string,
  i18n: I18n,
): readonly CsvDownload[] {
  return ACQUISITION_TABLES.map((table) => ({
    label: acquisitionTableLabel(table, i18n),
    href: exportHref(
      projectId,
      'acquisition',
      withKeptParameters(query, { [TABLE_PARAMETER]: table }),
    ),
  }));
}

function AcquisitionReportView({
  report,
  periodLabel,
  downloads,
  channelVisitsHref,
  campaignVisitsHref,
  i18n,
  sourceVisitsHref,
  rowFilter,
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
      <ChannelChart days={report.days} periodLabel={periodLabel} i18n={i18n} />
      <SourcesTable
        rows={sourceRows(report.sources, i18n)}
        channelVisitsHref={channelVisitsHref}
        i18n={i18n}
        sourceVisitsHref={sourceVisitsHref}
        sourceFilterOf={(row) => rowFilter({ source: row.source }, row.label)}
        channelFilterOf={(channel) => rowFilter({ channel }, channelLabel(channel, i18n))}
      />
      <CampaignsTable
        rows={campaignRows(report.campaigns, i18n)}
        campaignVisitsHref={campaignVisitsHref}
        campaignFilterOf={(row) =>
          rowFilter({ campaign: row.campaign, source: row.source }, row.campaign)
        }
        i18n={i18n}
      />
      <CsvDownloads downloads={downloads} i18n={i18n} />
      <p className="text-xs leading-[18px] text-muted">{i18n.t('acquisition.footnote')}</p>
    </>
  );
}

export default async function AcquisitionPage({ params, searchParams }: AcquisitionPageProps) {
  const { project } = await projectOrNotFound((await params).projectId);
  const search = await searchParams;
  const now = new Date();
  const period = resolvePeriod(search, project.timezone, now);
  const i18n = await getI18n();
  const { filters } = dashboardFiltersOf(search, i18n);
  const report = await readOrSignIn(() =>
    createAcquisitionService().acquisition(project.id, {
      from: period.from,
      to: period.to,
      filters,
    }),
  );
  const filtered = hasDashboardFilters(filters);
  const query = withDashboardFilters(periodQuery(period), filters);
  const visitsPath = screenHref(project.id, 'visits', query);
  return (
    <ScreenContent
      readAt={now.getTime()}
      filtered={filtered}
      className="flex w-full max-w-310 flex-col gap-3.5 p-4 sm:gap-5 sm:px-8 sm:pt-7 sm:pb-12"
    >
      {visitsTotal(report.days) > 0 ? (
        <AcquisitionReportView
          report={report}
          periodLabel={filteredPeriodLabel(describePeriod(period, i18n), filters, i18n)}
          downloads={acquisitionDownloads(project.id, query, i18n)}
          channelVisitsHref={(channel) => linkWith(visitsPath, { channel })}
          sourceVisitsHref={(source) => linkWith(visitsPath, { source })}
          campaignVisitsHref={({ campaign, source }) => linkWith(visitsPath, { campaign, source })}
          rowFilter={screenRowFilters(project.id, 'acquisition', search, filters, i18n)}
          i18n={i18n}
        />
      ) : filtered ? (
        <FilteredPeriodEmpty
          periodLabel={describePeriod(period, i18n)}
          removeFiltersHref={screenHref(project.id, 'acquisition', periodQuery(period))}
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
    </ScreenContent>
  );
}
