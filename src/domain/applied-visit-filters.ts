import type { I18n } from '@/i18n/i18n';
import { channelLabel } from './acquisition';
import { countryLabel, deviceTypeLabel } from './devices';
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
  'identity',
  'country',
  'source',
  'campaign',
  'route',
  'failed',
] as const;

export type VisitFilterField = (typeof VISIT_FILTER_FIELDS)[number];

const UPPERCASE_FIELDS: ReadonlySet<VisitFilterField> = new Set(['country']);

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
