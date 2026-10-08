import type { I18n } from '@/i18n/i18n';
import { barWidth, formatCount, formatPercent, rate } from './metrics';
import type { DevicesReport, DevicesWire } from './devices.schema';

export type { DevicesReport, DevicesWire };

export type ValueShare = DevicesReport['browsers'][number];

export const OTHER_VALUE = 'other';
const OTHER_LABEL = 'Other';
const OTHER_COUNTRIES_LABEL = 'Other countries';
const OTHER_COUNTRIES_CODE = '··';
const REGION_CODE = /^[A-Z]{2}$/;

const DEVICE_TYPE_LABELS: Readonly<Record<string, string>> = {
  mobile: 'Mobile',
  desktop: 'Desktop',
  tablet: 'Tablet',
};

const BROWSER_LABELS: Readonly<Record<string, string>> = {
  chrome: 'Chrome',
  safari: 'Safari',
  firefox: 'Firefox',
  edge: 'Edge',
  samsung: 'Samsung Internet',
  opera: 'Opera',
};

const OPERATING_SYSTEM_LABELS: Readonly<Record<string, string>> = {
  android: 'Android',
  ios: 'iOS',
  windows: 'Windows',
  macos: 'macOS',
  linux: 'Linux',
  chromeos: 'ChromeOS',
};

export type ValueLabeller = (value: string, i18n: I18n) => string;

function labelling(labels: Readonly<Record<string, string>>): ValueLabeller {
  return (value) => (value === OTHER_VALUE ? OTHER_LABEL : (labels[value] ?? value));
}

export const deviceTypeLabel = labelling(DEVICE_TYPE_LABELS);
export const browserLabel = labelling(BROWSER_LABELS);
export const operatingSystemLabel = labelling(OPERATING_SYSTEM_LABELS);

export function countryLabel(value: string, i18n: I18n): string {
  if (value === OTHER_VALUE) {
    return OTHER_COUNTRIES_LABEL;
  }
  return REGION_CODE.test(value) ? i18n.format.region(value) : value;
}

export function countryCode(value: string): string {
  return value === OTHER_VALUE ? OTHER_COUNTRIES_CODE : value;
}

export function hasVisits(report: DevicesReport): boolean {
  return report.deviceTypes.some((share) => share.visits > 0);
}

export interface ShareRow {
  readonly value: string;
  readonly label: string;
  readonly visits: string;
  readonly share: string;
  readonly fraction: number;
  readonly conversionRate: string | null;
}

function convertedVisits(share: ValueShare): number | null {
  return share.conversions === null ? null : (share.convertingVisits ?? share.conversions);
}

function conversionRateOf(share: ValueShare, i18n: I18n): string | null {
  const converted = convertedVisits(share);
  return converted === null ? null : formatPercent(rate(converted, share.visits), i18n);
}

export function shareRows(
  values: readonly ValueShare[],
  label: ValueLabeller,
  i18n: I18n,
): readonly ShareRow[] {
  const total = values.reduce((sum, share) => sum + share.visits, 0);
  return values.map((share) => {
    const fraction = rate(share.visits, total);
    return {
      value: share.value,
      label: label(share.value, i18n),
      visits: formatCount(share.visits, i18n),
      share: formatPercent(fraction, i18n),
      fraction: fraction ?? 0,
      conversionRate: conversionRateOf(share, i18n),
    };
  });
}

export function countsConversions(rows: readonly ShareRow[]): boolean {
  return rows.some((row) => row.conversionRate !== null);
}

export interface DeviceConversion {
  readonly label: string;
  readonly rate: string;
  readonly detail: string;
  readonly barWidth: string;
}

export function deviceConversions(
  deviceTypes: readonly ValueShare[],
  i18n: I18n,
): readonly DeviceConversion[] {
  const counted = deviceTypes.flatMap((share) => {
    const converted = convertedVisits(share);
    return converted === null ? [] : [{ ...share, converted }];
  });
  const rated = counted.map((share) => ({
    ...share,
    rate: rate(share.converted, share.visits),
  }));
  const best = Math.max(0, ...rated.map((share) => share.rate ?? 0));
  return rated.map((share) => ({
    label: deviceTypeLabel(share.value, i18n),
    rate: formatPercent(share.rate, i18n),
    detail: `${formatCount(share.converted, i18n)} of ${i18n.t('counts.visit', { count: share.visits })}`,
    barWidth: barWidth(share.rate ?? 0, best),
  }));
}
