import type { I18n } from '@/i18n/i18n';
import { barWidth, formatCount, formatPercent, NO_VALUE, rate } from './metrics';
import type { DevicesReport, DevicesWire } from './devices.schema';

export type { DevicesReport, DevicesWire };

export type ValueShare = DevicesReport['browsers'][number];
export type RegionShare = DevicesReport['regions'][number];

export const OTHER_VALUE = 'other';
const OTHER_COUNTRIES_CODE = '··';
const OTHER_REGIONS_CODE = '··';
const UNKNOWN_REGION_KEY = 'unknown';
const COUNTRY_CODE = /^[A-Z]{2}$/;
const REGION_CODE = /^([A-Z]{2})-([A-Z0-9]{1,3})$/;

const DEVICE_TYPES = ['mobile', 'desktop', 'tablet'] as const;
type DeviceType = (typeof DEVICE_TYPES)[number];

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
  return (value, i18n) =>
    value === OTHER_VALUE ? i18n.t('devices.other') : (labels[value] ?? value);
}

function isDeviceType(value: string): value is DeviceType {
  return DEVICE_TYPES.some((type) => type === value);
}

export function deviceTypeLabel(value: string, i18n: I18n): string {
  if (value === OTHER_VALUE) {
    return i18n.t('devices.other');
  }
  return isDeviceType(value) ? i18n.t(`devices.types.${value}`) : value;
}

export const browserLabel = labelling(BROWSER_LABELS);
export const operatingSystemLabel = labelling(OPERATING_SYSTEM_LABELS);

export function countryLabel(value: string, i18n: I18n): string {
  if (value === OTHER_VALUE) {
    return i18n.t('devices.otherCountries');
  }
  return COUNTRY_CODE.test(value) ? i18n.format.country(value) : value;
}

export function countryCode(value: string): string {
  return value === OTHER_VALUE ? OTHER_COUNTRIES_CODE : value;
}

export function placeLabel(
  country: string | null,
  regionName: string | null,
  i18n: I18n,
): string | null {
  if (country === null) {
    return null;
  }
  const countryName = countryLabel(country, i18n);
  return regionName === null ? countryName : `${regionName}, ${countryName}`;
}

export function isRegionCode(value: string): boolean {
  return REGION_CODE.test(value);
}

function regionParts(value: string | null): { country: string; subdivision: string } | null {
  const match = value === null ? null : REGION_CODE.exec(value);
  return match === null ? null : { country: String(match[1]), subdivision: String(match[2]) };
}

export function hasVisits(report: DevicesReport): boolean {
  return report.deviceTypes.some((share) => share.visits > 0);
}

export interface ShareRow {
  readonly value: string;
  readonly label: string;
  readonly visits: string;
  readonly counted: number;
  readonly share: string;
  readonly fraction: number;
  readonly conversionRate: string | null;
}

type ConversionCounts = Pick<ValueShare, 'visits' | 'conversions' | 'convertingVisits'>;

function convertedVisits(share: ConversionCounts): number | null {
  return share.conversions === null ? null : (share.convertingVisits ?? share.conversions);
}

function conversionRateOf(share: ConversionCounts, i18n: I18n): string | null {
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
      counted: share.visits,
      share: formatPercent(fraction, i18n),
      fraction: fraction ?? 0,
      conversionRate: conversionRateOf(share, i18n),
    };
  });
}

export interface RegionRow {
  readonly key: string;
  readonly code: string;
  readonly label: string;
  readonly country: string | null;
  readonly filterValue: string | null;
  readonly visits: string;
  readonly counted: number;
  readonly share: string;
  readonly fraction: number;
  readonly conversionRate: string | null;
}

function regionCode(share: RegionShare): string {
  if (share.value === null) {
    return NO_VALUE;
  }
  return regionParts(share.value)?.subdivision ?? OTHER_REGIONS_CODE;
}

function regionName(share: RegionShare, i18n: I18n): string {
  if (share.value === null) {
    return i18n.t('devices.unknownRegion');
  }
  if (share.value === OTHER_VALUE) {
    return i18n.t('devices.otherRegions');
  }
  return share.name ?? share.value;
}

export function regionRows(regions: readonly RegionShare[], i18n: I18n): readonly RegionRow[] {
  const total = regions.reduce((sum, share) => sum + share.visits, 0);
  const countries = new Set(regions.flatMap((share) => regionParts(share.value)?.country ?? []));
  const namesCountry = countries.size > 1;
  return regions.map((share) => {
    const parts = regionParts(share.value);
    const fraction = rate(share.visits, total);
    return {
      key: share.value ?? UNKNOWN_REGION_KEY,
      code: regionCode(share),
      label: regionName(share, i18n),
      country: namesCountry && parts !== null ? countryLabel(parts.country, i18n) : null,
      filterValue: parts === null ? null : share.value,
      visits: formatCount(share.visits, i18n),
      counted: share.visits,
      share: formatPercent(fraction, i18n),
      fraction: fraction ?? 0,
      conversionRate: conversionRateOf(share, i18n),
    };
  });
}

export function countsConversions(rows: readonly { conversionRate: string | null }[]): boolean {
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
    detail: i18n.t('devices.convertedOfVisits', {
      converted: formatCount(share.converted, i18n),
      visits: i18n.t('counts.visit', { count: share.visits }),
    }),
    barWidth: barWidth(share.rate ?? 0, best),
  }));
}
