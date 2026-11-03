import type { I18n } from '@/i18n/i18n';
import { type VisitKind, type VisitKindBadge, visitKindBadge } from './visit-kind';
import { channelLabel } from './acquisition';
import {
  BROWSER_FAMILIES,
  type BrowserFamily,
  COUNTRY_CODE_PATTERN,
  type DashboardFilters,
  dashboardFilterParameters,
  dashboardFiltersOf,
  type DashboardSearch,
  MAX_CAMPAIGN_LENGTH,
  MAX_CITY_LENGTH,
  MAX_SOURCE_LENGTH,
  NO_DASHBOARD_FILTERS,
  OS_FAMILIES,
  type OsFamily,
  PAGE_FILTER_PARAMETERS,
  singleValue,
  textFilter,
  VISIT_DEVICE_TYPES,
  VISIT_IDENTITIES,
  type VisitDeviceType,
  type VisitIdentity,
} from './dashboard-filters';
import { browserLabel, deviceTypeLabel, operatingSystemLabel, placeLabel } from './devices';
import { eventLabel, formatCount, NO_VALUE } from './metrics';
import { formatVisitDuration, shortId } from './timeline';
import type { VisitsReport, VisitsWire } from './visits.schema';

export type { VisitsReport, VisitsWire };

export type VisitSummary = VisitsReport['visits'][number];

export {
  BROWSER_FAMILIES,
  MAX_CAMPAIGN_LENGTH,
  MAX_CITY_LENGTH,
  MAX_SOURCE_LENGTH,
  OS_FAMILIES,
  PAGE_FILTER_PARAMETERS,
  VISIT_DEVICE_TYPES,
  VISIT_IDENTITIES,
};
export type { BrowserFamily, OsFamily, VisitDeviceType, VisitIdentity };
export const REQUEST_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] as const;
export const MAX_REGION_LENGTH = 6;
export const MAX_ROUTE_LENGTH = 100;
const ROUTE_SEPARATOR = ' ';

const VISIT_CURSOR_PATTERN =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z~[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

export const VISITOR_SPANS = ['day', 'month', 'new'] as const;
export type VisitorSpan = (typeof VISITOR_SPANS)[number];

export interface VisitsSearch extends DashboardSearch {
  readonly route?: string | string[];
  readonly visitors?: string | string[];
}

export interface VisitFilters extends DashboardFilters {
  readonly route: string | null;
  readonly visitors: VisitorSpan | null;
}

export const NO_VISIT_FILTERS: VisitFilters = {
  ...NO_DASHBOARD_FILTERS,
  route: null,
  visitors: null,
};

const KINDS_OF_SPAN: Readonly<Record<VisitorSpan, readonly VisitKind[]>> = {
  day: ['first_visit', 'first_this_month', 'first_today'],
  month: ['first_visit', 'first_this_month'],
  new: ['first_visit'],
};

export function spanKeeps(span: VisitorSpan | null, kind: VisitKind | null): boolean {
  return span === null || (kind !== null && KINDS_OF_SPAN[span].includes(kind));
}

export function visitorSpanOf(text: string): VisitorSpan | null {
  return VISITOR_SPANS.find((span) => span === text) ?? null;
}

export interface VisitFilterReading {
  readonly filters: VisitFilters;
  readonly problems: readonly string[];
}

export function countryFilterOf(country: string): string | null {
  return COUNTRY_CODE_PATTERN.test(country) ? country : null;
}

export function deviceFilterOf(deviceType: string): VisitDeviceType | null {
  return VISIT_DEVICE_TYPES.find((type) => type === deviceType) ?? null;
}

export function isRequestRoute(text: string): boolean {
  const separator = text.indexOf(ROUTE_SEPARATOR);
  const method = text.slice(0, separator);
  const route = text.slice(separator + 1);
  return (
    REQUEST_METHODS.some((known) => known === method) &&
    route.startsWith('/') &&
    route.length <= MAX_ROUTE_LENGTH &&
    !route.includes(ROUTE_SEPARATOR)
  );
}

export function visitFiltersOf(search: VisitsSearch, i18n: I18n): VisitFilterReading {
  const reading = dashboardFiltersOf(search, i18n);
  const route = textFilter(
    singleValue(search.route),
    isRequestRoute,
    i18n.t('visits.problems.route'),
  );
  return {
    filters: {
      ...reading.filters,
      route: route.value,
      visitors: visitorSpanOf(singleValue(search.visitors)),
    },
    problems:
      route.problem === null || reading.problems.includes(route.problem)
        ? reading.problems
        : [...reading.problems, route.problem],
  };
}

export function visitFilterParameters(filters: VisitFilters): Readonly<Record<string, string>> {
  const { failed, ...rest } = dashboardFilterParameters(filters);
  return {
    ...rest,
    ...(filters.route === null ? {} : { route: filters.route }),
    ...(filters.visitors === null ? {} : { visitors: filters.visitors }),
    ...(failed === undefined ? {} : { failed }),
  };
}

export function visitFilterCount(filters: VisitFilters): number {
  return Object.keys(visitFilterParameters(filters)).length;
}

export function hasVisitFilters(filters: VisitFilters): boolean {
  return visitFilterCount(filters) > 0;
}

const SPAN_COUNTS = {
  day: 'counts.uniqueVisitOfDay',
  month: 'counts.uniqueVisitOfMonth',
  new: 'counts.newVisitor',
} as const satisfies Readonly<Record<VisitorSpan, string>>;

export function visitsTotalLabel(
  total: number | null,
  filters: VisitFilters,
  i18n: I18n,
): string | null {
  if (total === null) {
    return null;
  }
  if (filters.visitors !== null) {
    return i18n.t(SPAN_COUNTS[filters.visitors], { count: total });
  }
  return i18n.t(hasVisitFilters(filters) ? 'counts.matchingVisit' : 'counts.visit', {
    count: total,
  });
}

export function withCountedVisitors(
  reading: VisitFilterReading,
  countsUniqueVisitors: boolean,
  i18n: I18n,
): VisitFilterReading {
  if (countsUniqueVisitors || reading.filters.visitors === null) {
    return reading;
  }
  return {
    filters: { ...reading.filters, visitors: null },
    problems: [...reading.problems, i18n.t('visits.problems.visitors')],
  };
}

export function isVisitCursor(text: string): boolean {
  return VISIT_CURSOR_PATTERN.test(text);
}

export interface VisitAccount {
  readonly userId: string;
  readonly shown: string;
  readonly linkName: string;
}

export interface VisitRow {
  readonly key: string;
  readonly openLabel: string;
  readonly started: string;
  readonly startedAt: string;
  readonly duration: string;
  readonly entryPath: string | null;
  readonly pageViews: string;
  readonly pagesLabel: string;
  readonly highlights: readonly string[];
  readonly failedRequests: number;
  readonly failedRequestsLabel: string;
  readonly device: string;
  readonly channel: string | null;
  readonly channelNote: string;
  readonly account: VisitAccount | null;
  readonly kind: VisitKindBadge | null;
}

function visitAccount(userId: string | null, i18n: I18n): VisitAccount | null {
  if (userId === null) {
    return null;
  }
  const short = shortId(userId);
  if (short === userId) {
    return {
      userId,
      shown: userId,
      linkName: i18n.t('visits.accountLink', { user: userId }),
    };
  }
  const shown = `${short}…`;
  return {
    userId,
    shown,
    linkName: i18n.t('visits.shortAccountLink', { shown, user: userId }),
  };
}

function failedRequestsLabel(count: number, i18n: I18n): string {
  return count === 0 ? i18n.t('visits.noFailedRequest') : i18n.t('counts.failedRequest', { count });
}

function deviceLabel(visit: VisitSummary, i18n: I18n): string {
  const place = placeLabel(visit, i18n);
  return [
    deviceTypeLabel(visit.deviceType, i18n),
    browserLabel(visit.browser, i18n),
    operatingSystemLabel(visit.os, i18n),
    ...(place === null ? [] : [place]),
  ].join(' · ');
}

export function visitRows(
  visits: readonly VisitSummary[],
  timeZone: string,
  i18n: I18n,
): readonly VisitRow[] {
  const started = i18n.format.dateTime('visitStart', timeZone);
  return visits.map((visit) => {
    const startedText = started(new Date(visit.startedAt));
    const channel = visit.channel === null ? null : channelLabel(visit.channel, i18n);
    return {
      key: visit.sessionId,
      openLabel: i18n.t('visits.table.openVisit', {
        started: startedText,
        visit: shortId(visit.sessionId),
      }),
      started: startedText,
      startedAt: visit.startedAt,
      duration: formatVisitDuration(visit.startedAt, visit.endedAt, i18n),
      entryPath: visit.entryPath,
      pageViews: formatCount(visit.pageViews, i18n),
      pagesLabel: i18n.t('counts.page', { count: visit.pageViews }),
      highlights: visit.highlights.map(eventLabel),
      failedRequests: visit.failedRequests,
      failedRequestsLabel: failedRequestsLabel(visit.failedRequests, i18n),
      device: deviceLabel(visit, i18n),
      channel,
      channelNote: i18n.t('visits.table.channelNote', { channel: channel ?? NO_VALUE }),
      account: visitAccount(visit.userId, i18n),
      kind: visitKindBadge(visit.visitor, i18n),
    };
  });
}

export interface VisitsTableText {
  readonly heading: string;
  readonly columns: {
    readonly started: string;
    readonly duration: string;
    readonly entryPage: string;
    readonly pages: string;
    readonly highlights: string;
    readonly failed: string;
    readonly device: string;
    readonly channel: string;
    readonly account: string;
  };
  readonly anonymous: string;
  readonly everyVisit: string;
  readonly load: string;
  readonly loading: string;
  readonly failed: string;
}

export function visitsTableText(i18n: I18n): VisitsTableText {
  return {
    heading: i18n.t('visits.table.heading'),
    columns: {
      started: i18n.t('visits.table.columns.started'),
      duration: i18n.t('visits.table.columns.duration'),
      entryPage: i18n.t('visits.table.columns.entryPage'),
      pages: i18n.t('visits.table.columns.pages'),
      highlights: i18n.t('visits.table.columns.highlights'),
      failed: i18n.t('visits.table.columns.failed'),
      device: i18n.t('visits.table.columns.device'),
      channel: i18n.t('visits.table.columns.channel'),
      account: i18n.t('visits.table.columns.account'),
    },
    anonymous: i18n.t('visits.table.anonymous'),
    everyVisit: i18n.t('visits.table.everyVisit'),
    load: i18n.t('visits.table.load'),
    loading: i18n.t('visits.table.loading'),
    failed: i18n.t('visits.table.failed'),
  };
}

export interface VisitRowsPage {
  readonly rows: readonly VisitRow[];
  readonly nextCursor: string | null;
}
