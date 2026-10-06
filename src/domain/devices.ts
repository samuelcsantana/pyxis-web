import { z } from 'zod';
import { barWidth, formatCount, formatPercent, formatQuantity, rate } from './metrics';

const valueShareSchema = z.object({
  value: z.string(),
  visits: z.number(),
  conversions: z.number().nullable(),
});

export const devicesResponseSchema = z
  .object({
    device_types: z.array(valueShareSchema),
    browsers: z.array(valueShareSchema),
    operating_systems: z.array(valueShareSchema),
    countries: z.array(valueShareSchema),
  })
  .transform((body) => ({
    deviceTypes: body.device_types,
    browsers: body.browsers,
    operatingSystems: body.operating_systems,
    countries: body.countries,
  }));

export type DevicesReport = z.output<typeof devicesResponseSchema>;
export type DevicesWire = z.input<typeof devicesResponseSchema>;
export type ValueShare = DevicesReport['browsers'][number];

export const OTHER_VALUE = 'other';
const OTHER_LABEL = 'Other';
const OTHER_COUNTRIES_LABEL = 'Other countries';
const OTHER_COUNTRIES_CODE = '··';
const REGION_CODE = /^[A-Z]{2}$/;
const REGION_NAMES = new Intl.DisplayNames(['en'], { type: 'region', fallback: 'code' });

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

export type ValueLabeller = (value: string) => string;

function labelling(labels: Readonly<Record<string, string>>): ValueLabeller {
  return (value) => (value === OTHER_VALUE ? OTHER_LABEL : (labels[value] ?? value));
}

export const deviceTypeLabel = labelling(DEVICE_TYPE_LABELS);
export const browserLabel = labelling(BROWSER_LABELS);
export const operatingSystemLabel = labelling(OPERATING_SYSTEM_LABELS);

export function countryLabel(value: string): string {
  if (value === OTHER_VALUE) {
    return OTHER_COUNTRIES_LABEL;
  }
  return REGION_CODE.test(value) ? String(REGION_NAMES.of(value)) : value;
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
}

export function shareRows(
  values: readonly ValueShare[],
  label: ValueLabeller,
): readonly ShareRow[] {
  const total = values.reduce((sum, share) => sum + share.visits, 0);
  return values.map((share) => {
    const fraction = rate(share.visits, total);
    return {
      value: share.value,
      label: label(share.value),
      visits: formatCount(share.visits),
      share: formatPercent(fraction),
      fraction: fraction ?? 0,
    };
  });
}

export function shareSummary(title: string, rows: readonly ShareRow[]): string {
  return `${title}: ${rows.map((row) => `${row.label} ${row.share}`).join(', ')}.`;
}

export interface DeviceConversion {
  readonly label: string;
  readonly rate: string;
  readonly detail: string;
  readonly barWidth: string;
}

export function deviceConversions(deviceTypes: readonly ValueShare[]): readonly DeviceConversion[] {
  const counted = deviceTypes.flatMap((share) =>
    share.conversions === null ? [] : [{ ...share, conversions: share.conversions }],
  );
  const rated = counted.map((share) => ({
    ...share,
    rate: rate(share.conversions, share.visits),
  }));
  const best = Math.max(0, ...rated.map((share) => share.rate ?? 0));
  return rated.map((share) => ({
    label: deviceTypeLabel(share.value),
    rate: formatPercent(share.rate),
    detail: `${formatCount(share.conversions)} of ${formatQuantity(share.visits, 'visit', 'visits')}`,
    barWidth: barWidth(share.rate ?? 0, best),
  }));
}
