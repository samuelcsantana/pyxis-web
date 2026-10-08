import type { I18n } from '@/i18n/i18n';
import { type AcquisitionReport, type Campaign, CHANNELS, type Source } from './acquisition';
import type { CsvTable, CsvValue } from './csv';

export const ACQUISITION_TABLES = ['sources', 'campaigns', 'channels'] as const;
export type AcquisitionTable = (typeof ACQUISITION_TABLES)[number];

export function acquisitionTableLabel(table: AcquisitionTable, i18n: I18n): string {
  return i18n.t(`exports.acquisition.${table}`);
}

interface Column<Entry> {
  readonly name: string;
  readonly value: (entry: Entry) => CsvValue;
}

type Attributed = Source | Campaign;

function conversionColumns<Entry extends Attributed>(
  entries: readonly Entry[],
): readonly Column<Entry>[] {
  const countsConversions = entries.some((entry) => entry.conversions !== null);
  const countsConvertingVisits = entries.some((entry) => entry.convertingVisits !== null);
  return [
    { name: 'visits', value: (entry) => entry.visits },
    ...(countsConversions
      ? [{ name: 'conversion_events', value: (entry: Entry) => entry.conversions }]
      : []),
    ...(countsConvertingVisits
      ? [{ name: 'converting_visits', value: (entry: Entry) => entry.convertingVisits }]
      : []),
    { name: 'ad_click_visits', value: (entry) => entry.fromAdClickVisits },
  ];
}

function tableOf<Entry>(entries: readonly Entry[], columns: readonly Column<Entry>[]): CsvTable {
  return {
    columns: columns.map((column) => column.name),
    rows: entries.map((entry) => columns.map((column) => column.value(entry))),
  };
}

function sourcesTable(report: AcquisitionReport): CsvTable {
  return tableOf(report.sources, [
    { name: 'source', value: (source) => source.source },
    { name: 'medium', value: (source) => source.medium },
    { name: 'channel', value: (source) => source.channel },
    ...conversionColumns(report.sources),
  ]);
}

function campaignsTable(report: AcquisitionReport): CsvTable {
  return tableOf(report.campaigns, [
    { name: 'campaign', value: (campaign) => campaign.campaign },
    { name: 'source', value: (campaign) => campaign.source },
    { name: 'medium', value: (campaign) => campaign.medium },
    { name: 'channel', value: (campaign) => campaign.channel },
    ...conversionColumns(report.campaigns),
  ]);
}

function channelsTable(report: AcquisitionReport): CsvTable {
  return {
    columns: ['date', ...CHANNELS],
    rows: report.days.map((day) => [
      day.date,
      ...CHANNELS.map((channel) => day.byChannel[channel]),
    ]),
  };
}

const TABLE_BUILDERS: Readonly<Record<AcquisitionTable, (report: AcquisitionReport) => CsvTable>> =
  {
    sources: sourcesTable,
    campaigns: campaignsTable,
    channels: channelsTable,
  };

export function acquisitionCsvTable(report: AcquisitionReport, table: AcquisitionTable): CsvTable {
  return TABLE_BUILDERS[table](report);
}
