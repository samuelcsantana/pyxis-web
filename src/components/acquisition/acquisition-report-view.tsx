import { CampaignsTable } from './campaigns-table';
import type { RowFilterOf } from '@/lib/row-filters';
import { ChannelChart } from './channel-chart';
import { SourcesTable } from './sources-table';
import { type CsvDownload, CsvDownloads } from '@/components/ui/csv-downloads';
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
} from '@/domain/acquisition';
import type { I18n } from '@/i18n/i18n';

export interface AcquisitionReportViewProps {
  readonly report: AcquisitionReport;
  readonly currency: string;
  readonly periodLabel: string;
  readonly downloads: readonly CsvDownload[];
  readonly channelVisitsHref: (channel: Channel) => string | null;
  readonly campaignVisitsHref: (row: CampaignRow) => string | null;
  readonly i18n: I18n;
  readonly sourceVisitsHref: (source: string) => string | null;
  readonly rowFilter: RowFilterOf;
}

export function AcquisitionReportView({
  report,
  currency,
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
        rows={sourceRows(report.sources, currency, i18n)}
        channelVisitsHref={channelVisitsHref}
        i18n={i18n}
        sourceVisitsHref={sourceVisitsHref}
        sourceFilterOf={(row) => rowFilter({ source: row.source }, row.label)}
        channelFilterOf={(channel) => rowFilter({ channel }, channelLabel(channel, i18n))}
      />
      <CampaignsTable
        rows={campaignRows(report.campaigns, currency, i18n)}
        campaignVisitsHref={campaignVisitsHref}
        campaignFilterOf={(row) =>
          rowFilter({ campaign: row.campaign, source: row.source }, row.campaign)
        }
        i18n={i18n}
      />
      {downloads.length === 0 ? null : <CsvDownloads downloads={downloads} i18n={i18n} />}
      <p className="text-xs leading-[18px] text-muted">{i18n.t('acquisition.footnote')}</p>
    </>
  );
}
