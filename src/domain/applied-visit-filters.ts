import type { I18n } from '@/i18n/i18n';
import { channelLabel } from './acquisition';
import { browserLabel, countryLabel, deviceTypeLabel, operatingSystemLabel } from './devices';
import type { DashboardFilters } from './dashboard-filters';
import { PAGE_FILTER_PARAMETERS, type VisitFilters } from './visits';

export interface AppliedVisitFilter {
  readonly key: string;
  readonly label: string;
  readonly value: string | null;
  readonly code: boolean;
  readonly without: VisitFilters;
}

export const VISIT_FILTER_FIELDS = [
  ...PAGE_FILTER_PARAMETERS,
  'event',
  'property',
  'channel',
  'device',
  'browser',
  'os',
  'identity',
  'country',
  'region',
  'city',
  'source',
  'campaign',
  'route',
  'failed',
] as const;

export type VisitFilterField = (typeof VISIT_FILTER_FIELDS)[number];

const UPPERCASE_FIELDS: ReadonlySet<VisitFilterField> = new Set(['country', 'region']);

function pageFilters(filters: VisitFilters, i18n: I18n): readonly AppliedVisitFilter[] {
  return PAGE_FILTER_PARAMETERS.flatMap((name, index) => {
    const path = filters.paths[index];
    return path === undefined
      ? []
      : [
          {
            key: name,
            label: i18n.t(`visits.filters.pages.${name}`),
            value: path,
            code: true,
            without: { ...filters, paths: filters.paths.filter((_, kept) => kept !== index) },
          },
        ];
  });
}

function shown(
  key: string,
  label: string,
  value: string | null,
  code: boolean,
  without: VisitFilters,
): readonly AppliedVisitFilter[] {
  return value === null ? [] : [{ key, label, value, code, without }];
}

function flag(
  key: string,
  label: string,
  on: boolean,
  without: VisitFilters,
): readonly AppliedVisitFilter[] {
  return on ? [{ key, label, value: null, code: false, without }] : [];
}

export function appliedVisitFilters(
  filters: VisitFilters,
  i18n: I18n,
): readonly AppliedVisitFilter[] {
  const t = i18n.t;
  return [
    ...pageFilters(filters, i18n),
    ...shown('event', t('visits.filters.event'), filters.event, true, {
      ...filters,
      event: null,
      property: null,
    }),
    ...shown('property', t('visits.filters.property'), filters.property, true, {
      ...filters,
      property: null,
    }),
    ...shown(
      'channel',
      t('visits.filters.channel'),
      filters.channel === null ? null : channelLabel(filters.channel, i18n),
      false,
      { ...filters, channel: null },
    ),
    ...shown(
      'device',
      t('visits.filters.device'),
      filters.device === null ? null : deviceTypeLabel(filters.device, i18n),
      false,
      { ...filters, device: null },
    ),
    ...shown(
      'browser',
      t('visits.filters.browser'),
      filters.browser === null ? null : browserLabel(filters.browser, i18n),
      false,
      { ...filters, browser: null },
    ),
    ...shown(
      'os',
      t('visits.filters.os'),
      filters.os === null ? null : operatingSystemLabel(filters.os, i18n),
      false,
      { ...filters, os: null },
    ),
    ...shown(
      'identity',
      t('visits.filters.account'),
      filters.identity === null ? null : t(`visits.filters.identities.${filters.identity}`),
      false,
      { ...filters, identity: null },
    ),
    ...shown(
      'country',
      t('visits.filters.country'),
      filters.country === null ? null : countryLabel(filters.country, i18n),
      false,
      { ...filters, country: null },
    ),
    ...shown('region', t('visits.filters.region'), filters.region, true, {
      ...filters,
      region: null,
    }),
    ...shown('city', t('visits.filters.city'), filters.city, false, {
      ...filters,
      city: null,
    }),
    ...shown('source', t('visits.filters.source'), filters.source, true, {
      ...filters,
      source: null,
    }),
    ...shown('campaign', t('visits.filters.campaign'), filters.campaign, true, {
      ...filters,
      campaign: null,
    }),
    ...shown('route', t('visits.filters.route'), filters.route, true, { ...filters, route: null }),
    ...flag('failed', t('visits.filters.failed'), filters.failed, { ...filters, failed: false }),
  ];
}

function entered(field: VisitFilterField, value: string): string {
  const trimmed = value.trim();
  return UPPERCASE_FIELDS.has(field) ? trimmed.toUpperCase() : trimmed;
}

export function changedVisitFilterFields(
  applied: Readonly<Partial<Record<string, string>>>,
  form: Readonly<Partial<Record<VisitFilterField, string>>>,
): readonly VisitFilterField[] {
  return VISIT_FILTER_FIELDS.filter(
    (field) => entered(field, form[field] ?? '') !== (applied[field] ?? ''),
  );
}

const VALUE_TAG = '<value/>';
const LIST_SEPARATOR = ', ';

export function filteredPeriodLabel(
  periodLabel: string,
  filters: DashboardFilters,
  i18n: I18n,
): string {
  const applied = appliedVisitFilters({ ...filters, route: null }, i18n);
  if (applied.length === 0) {
    return periodLabel;
  }
  const named = applied.map((filter) =>
    filter.value === null
      ? filter.label
      : i18n
          .t('visits.filters.applied.item', { filter: filter.label })
          .replace(VALUE_TAG, filter.value),
  );
  return i18n.t('dashboardFilters.periodFiltered', {
    period: periodLabel,
    filters: named.join(LIST_SEPARATOR),
  });
}
