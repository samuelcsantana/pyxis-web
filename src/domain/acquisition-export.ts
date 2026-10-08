import type { I18n } from '@/i18n/i18n';
import { type AcquisitionReport, CHANNELS, type Source } from './acquisition';
import type { CsvTable, CsvValue } from './csv';

export const ACQUISITION_TABLES = ['sources', 'channels'] as const;
export type AcquisitionTable = (typeof ACQUISITION_TABLES)[number];

export function acquisitionTableLabel(table: AcquisitionTable, i18n: I18n): string {
  return i18n.t(`exports.acquisition.${table}`);
}

interface SourceColumn {
  readonly name: string;
  readonly value: (source: Source) => CsvValue;
}

function sourceColumns(sources: readonly Source[]): readonly SourceColumn[] {
  const countsConversions = sources.some((source) => source.conversions !== null);
  const countsConvertingVisits = sources.some((source) => source.convertingVisits !== null);
  return [
    { name: 'source', value: (source) => source.source },
    { name: 'medium', value: (source) => source.medium },
    { name: 'channel', value: (source) => source.channel },
    { name: 'visits', value: (source) => source.visits },
    ...(countsConversions
      ? [{ name: 'conversion_events', value: (source: Source) => source.conversions }]
      : []),
    ...(countsConvertingVisits
      ? [{ name: 'converting_visits', value: (source: Source) => source.convertingVisits }]
      : []),
    { name: 'ad_click_visits', value: (source) => source.fromAdClickVisits },
  ];
}

function sourcesTable(report: AcquisitionReport): CsvTable {
  const columns = sourceColumns(report.sources);
  return {
    columns: columns.map((column) => column.name),
    rows: report.sources.map((source) => columns.map((column) => column.value(source))),
  };
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
    channels: channelsTable,
  };

export function acquisitionCsvTable(report: AcquisitionReport, table: AcquisitionTable): CsvTable {
  return TABLE_BUILDERS[table](report);
}
