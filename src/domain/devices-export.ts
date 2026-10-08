import type { I18n } from '@/i18n/i18n';
import type { CsvTable, CsvValue } from './csv';
import type { DevicesReport, ValueShare } from './devices';

export function devicesTableLabel(i18n: I18n): string {
  return i18n.t('exports.devices');
}

const DIMENSIONS: readonly (readonly [string, keyof DevicesReport])[] = [
  ['device_type', 'deviceTypes'],
  ['browser', 'browsers'],
  ['operating_system', 'operatingSystems'],
  ['country', 'countries'],
];

interface ShareColumn {
  readonly name: string;
  readonly value: (share: ValueShare) => CsvValue;
}

function shareColumns(shares: readonly ValueShare[]): readonly ShareColumn[] {
  const countsConversions = shares.some((share) => share.conversions !== null);
  const countsConvertingVisits = shares.some((share) => share.convertingVisits !== null);
  return [
    { name: 'value', value: (share) => share.value },
    { name: 'visits', value: (share) => share.visits },
    ...(countsConversions
      ? [{ name: 'conversion_events', value: (share: ValueShare) => share.conversions }]
      : []),
    ...(countsConvertingVisits
      ? [{ name: 'converting_visits', value: (share: ValueShare) => share.convertingVisits }]
      : []),
  ];
}

export function devicesCsvTable(report: DevicesReport): CsvTable {
  const rows = DIMENSIONS.flatMap(([dimension, key]) =>
    report[key].map((share) => ({ dimension, share })),
  );
  const columns = shareColumns(rows.map((row) => row.share));
  return {
    columns: ['dimension', ...columns.map((column) => column.name)],
    rows: rows.map((row) => [row.dimension, ...columns.map((column) => column.value(row.share))]),
  };
}
