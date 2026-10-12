import type { I18n } from '@/i18n/i18n';
import type { CsvTable, CsvValue } from './csv';
import type { DevicesReport, RegionShare, ValueShare } from './devices';

export function devicesTableLabel(i18n: I18n): string {
  return i18n.t('exports.devices');
}

const DIMENSIONS: readonly (readonly [string, Exclude<keyof DevicesReport, 'regions'>])[] = [
  ['device_type', 'deviceTypes'],
  ['browser', 'browsers'],
  ['operating_system', 'operatingSystems'],
  ['country', 'countries'],
];
const REGION_DIMENSION = 'region';

interface ExportedShare {
  readonly dimension: string;
  readonly value: string | null;
  readonly name: string | null;
  readonly visits: number;
  readonly conversions: number | null;
  readonly convertingVisits: number | null;
}

interface ShareColumn {
  readonly name: string;
  readonly value: (share: ExportedShare) => CsvValue;
}

function exportedShare(dimension: string, share: ValueShare): ExportedShare {
  return { dimension, ...share, name: null };
}

function exportedRegion(share: RegionShare): ExportedShare {
  return { dimension: REGION_DIMENSION, ...share };
}

function shareColumns(shares: readonly ExportedShare[]): readonly ShareColumn[] {
  const namesRegions = shares.some((share) => share.name !== null);
  const countsConversions = shares.some((share) => share.conversions !== null);
  const countsConvertingVisits = shares.some((share) => share.convertingVisits !== null);
  return [
    { name: 'dimension', value: (share) => share.dimension },
    { name: 'value', value: (share) => share.value },
    ...(namesRegions ? [{ name: 'name', value: (share: ExportedShare) => share.name }] : []),
    { name: 'visits', value: (share) => share.visits },
    ...(countsConversions
      ? [{ name: 'conversion_events', value: (share: ExportedShare) => share.conversions }]
      : []),
    ...(countsConvertingVisits
      ? [{ name: 'converting_visits', value: (share: ExportedShare) => share.convertingVisits }]
      : []),
  ];
}

export function devicesCsvTable(report: DevicesReport): CsvTable {
  const shares = [
    ...DIMENSIONS.flatMap(([dimension, key]) =>
      report[key].map((share) => exportedShare(dimension, share)),
    ),
    ...report.regions.map(exportedRegion),
  ];
  const columns = shareColumns(shares);
  return {
    columns: columns.map((column) => column.name),
    rows: shares.map((share) => columns.map((column) => column.value(share))),
  };
}
