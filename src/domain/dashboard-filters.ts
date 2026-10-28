import type { I18n } from '@/i18n/i18n';
import { type Channel, CHANNELS } from './acquisition';
import { isRegionCode } from './devices';
import { stepProblem } from './funnel';
import {
  isFilterableProperty,
  MAX_PROPERTY_VALUE_LENGTH,
  PROPERTY_SEPARATOR,
} from './visit-property';

export const PAGE_FILTER_PARAMETERS = ['path', 'path2', 'path3'] as const;
export const VISIT_DEVICE_TYPES = ['mobile', 'tablet', 'desktop', 'other'] as const;
export type VisitDeviceType = (typeof VISIT_DEVICE_TYPES)[number];
export const VISIT_IDENTITIES = ['identified', 'anonymous'] as const;
export type VisitIdentity = (typeof VISIT_IDENTITIES)[number];
export const BROWSER_FAMILIES = [
  'chrome',
  'safari',
  'firefox',
  'edge',
  'samsung',
  'opera',
  'other',
] as const;
export type BrowserFamily = (typeof BROWSER_FAMILIES)[number];
export const OS_FAMILIES = [
  'android',
  'ios',
  'windows',
  'macos',
  'linux',
  'chromeos',
  'other',
] as const;
export type OsFamily = (typeof OS_FAMILIES)[number];
export const MAX_SOURCE_LENGTH = 128;
export const MAX_CAMPAIGN_LENGTH = 64;
export const COUNTRY_CODE_PATTERN = /^[A-Z]{2}$/;
export const FAILED_ONLY = 'true';

export const DASHBOARD_FILTER_PARAMETERS = [
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
  'source',
  'campaign',
  'failed',
] as const;

export type DashboardFilterParameter = (typeof DASHBOARD_FILTER_PARAMETERS)[number];

export type DashboardSearch = Readonly<
  Partial<Record<DashboardFilterParameter, string | string[]>>
>;

export interface DashboardFilters {
  readonly paths: readonly string[];
  readonly event: string | null;
  readonly property: string | null;
  readonly channel: Channel | null;
  readonly device: VisitDeviceType | null;
  readonly browser: BrowserFamily | null;
  readonly os: OsFamily | null;
  readonly identity: VisitIdentity | null;
  readonly country: string | null;
  readonly region: string | null;
  readonly source: string | null;
  readonly campaign: string | null;
  readonly failed: boolean;
}

export const NO_DASHBOARD_FILTERS: DashboardFilters = {
  paths: [],
  event: null,
  property: null,
  channel: null,
  device: null,
  browser: null,
  os: null,
  identity: null,
  country: null,
  region: null,
  source: null,
  campaign: null,
  failed: false,
};

export interface DashboardFilterReading {
  readonly filters: DashboardFilters;
  readonly problems: readonly string[];
}

export interface TextFilter {
  readonly value: string | null;
  readonly problem: string | null;
}

export function singleValue(value: string | string[] | undefined): string {
  return typeof value === 'string' ? value.trim() : '';
}

function oneOf<Value extends string>(values: readonly Value[], text: string): Value | null {
  return values.find((value) => value === text) ?? null;
}

export function textFilter(
  typed: string,
  valid: (text: string) => boolean,
  problem: string,
): TextFilter {
  if (typed === '') {
    return { value: null, problem: null };
  }
  return valid(typed) ? { value: typed, problem: null } : { value: null, problem };
}

function propertyProblem(property: string, event: string | null, i18n: I18n): string | null {
  if (event === null) {
    return i18n.t('visits.problems.propertyNeedsEvent');
  }
  const separator = property.indexOf(PROPERTY_SEPARATOR);
  const wellFormed =
    separator >= 0 &&
    isFilterableProperty(property.slice(0, separator), property.slice(separator + 1));
  return wellFormed
    ? null
    : i18n.t('visits.problems.propertyFormat', { max: String(MAX_PROPERTY_VALUE_LENGTH) });
}

function attributionFilters(search: DashboardSearch, i18n: I18n) {
  return {
    country: textFilter(
      singleValue(search.country).toUpperCase(),
      (text) => COUNTRY_CODE_PATTERN.test(text),
      i18n.t('visits.problems.country'),
    ),
    region: textFilter(
      singleValue(search.region).toUpperCase(),
      isRegionCode,
      i18n.t('visits.problems.region'),
    ),
    source: textFilter(
      singleValue(search.source),
      (text) => text.length <= MAX_SOURCE_LENGTH,
      i18n.t('visits.problems.source', { max: String(MAX_SOURCE_LENGTH) }),
    ),
    campaign: textFilter(
      singleValue(search.campaign),
      (text) => text.length <= MAX_CAMPAIGN_LENGTH,
      i18n.t('visits.problems.campaign', { max: String(MAX_CAMPAIGN_LENGTH) }),
    ),
  };
}

export function dashboardFiltersOf(search: DashboardSearch, i18n: I18n): DashboardFilterReading {
  const typedPaths = PAGE_FILTER_PARAMETERS.map((name) => singleValue(search[name])).filter(
    (path) => path !== '',
  );
  const pathProblems = typedPaths.map((path) => stepProblem({ type: 'page', path }, i18n.t));
  const typedEvent = singleValue(search.event);
  const eventProblem =
    typedEvent === '' ? null : stepProblem({ type: 'event', name: typedEvent }, i18n.t);
  const event = typedEvent === '' || eventProblem !== null ? null : typedEvent;
  const typedProperty = singleValue(search.property);
  const propertyIssue = typedProperty === '' ? null : propertyProblem(typedProperty, event, i18n);
  const { country, region, source, campaign } = attributionFilters(search, i18n);
  return {
    filters: {
      paths: typedPaths.filter((_path, index) => pathProblems[index] === null),
      event,
      property: typedProperty === '' || propertyIssue !== null ? null : typedProperty,
      channel: oneOf(CHANNELS, singleValue(search.channel)),
      device: oneOf(VISIT_DEVICE_TYPES, singleValue(search.device)),
      browser: oneOf(BROWSER_FAMILIES, singleValue(search.browser)),
      os: oneOf(OS_FAMILIES, singleValue(search.os)),
      identity: oneOf(VISIT_IDENTITIES, singleValue(search.identity)),
      country: country.value,
      region: region.value,
      source: source.value,
      campaign: campaign.value,
      failed: singleValue(search.failed) === FAILED_ONLY,
    },
    problems: [
      ...new Set(
        [
          ...pathProblems,
          eventProblem,
          propertyIssue,
          country.problem,
          region.problem,
          source.problem,
          campaign.problem,
        ].filter((problem) => problem !== null),
      ),
    ],
  };
}

function optional(name: string, value: string | null): Readonly<Record<string, string>> {
  return value === null ? {} : { [name]: value };
}

export function dashboardFilterParameters(
  filters: DashboardFilters,
): Readonly<Record<string, string>> {
  const pages = PAGE_FILTER_PARAMETERS.flatMap((name, index) => {
    const path = filters.paths[index];
    return path === undefined ? [] : [[name, path] as const];
  });
  return {
    ...Object.fromEntries(pages),
    ...optional('event', filters.event),
    ...optional('property', filters.property),
    ...optional('channel', filters.channel),
    ...optional('device', filters.device),
    ...optional('browser', filters.browser),
    ...optional('os', filters.os),
    ...optional('identity', filters.identity),
    ...optional('country', filters.country),
    ...optional('region', filters.region),
    ...optional('source', filters.source),
    ...optional('campaign', filters.campaign),
    ...optional('failed', filters.failed ? FAILED_ONLY : null),
  };
}

export function hasDashboardFilters(filters: DashboardFilters): boolean {
  return Object.keys(dashboardFilterParameters(filters)).length > 0;
}

export function dashboardFilterQuery(filters: DashboardFilters): URLSearchParams {
  const query = new URLSearchParams();
  for (const path of filters.paths) {
    query.append('path', path);
  }
  for (const [name, value] of Object.entries(dashboardFilterParameters(filters))) {
    if (!PAGE_FILTER_PARAMETERS.some((page) => page === name)) {
      query.set(name, value);
    }
  }
  return query;
}
