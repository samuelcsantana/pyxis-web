import type { I18n } from '@/i18n/i18n';
import { type Channel, CHANNELS, channelLabel } from './acquisition';
import { browserLabel, countryLabel, deviceTypeLabel, operatingSystemLabel } from './devices';
import { stepProblem } from './funnel';
import { eventLabel, formatCount } from './metrics';
import { formatVisitDuration, shortId } from './timeline';
import {
  isFilterableProperty,
  MAX_PROPERTY_VALUE_LENGTH,
  PROPERTY_SEPARATOR,
} from './visit-property';
import type { VisitsReport, VisitsWire } from './visits.schema';

export type { VisitsReport, VisitsWire };

export type VisitSummary = VisitsReport['visits'][number];

export const PAGE_FILTER_PARAMETERS = ['path', 'path2', 'path3'] as const;
export const VISIT_DEVICE_TYPES = ['mobile', 'tablet', 'desktop', 'other'] as const;
export type VisitDeviceType = (typeof VISIT_DEVICE_TYPES)[number];
export const VISIT_IDENTITIES = ['identified', 'anonymous'] as const;
export type VisitIdentity = (typeof VISIT_IDENTITIES)[number];

const VISIT_CURSOR_PATTERN =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z~[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

export interface VisitsSearch {
  readonly path?: string | string[];
  readonly path2?: string | string[];
  readonly path3?: string | string[];
  readonly event?: string | string[];
  readonly property?: string | string[];
  readonly channel?: string | string[];
  readonly device?: string | string[];
  readonly identity?: string | string[];
}

export interface VisitFilters {
  readonly paths: readonly string[];
  readonly event: string | null;
  readonly property: string | null;
  readonly channel: Channel | null;
  readonly device: VisitDeviceType | null;
  readonly identity: VisitIdentity | null;
}

export const NO_VISIT_FILTERS: VisitFilters = {
  paths: [],
  event: null,
  property: null,
  channel: null,
  device: null,
  identity: null,
};

export interface VisitFilterReading {
  readonly filters: VisitFilters;
  readonly problems: readonly string[];
}

function single(value: string | string[] | undefined): string {
  return typeof value === 'string' ? value.trim() : '';
}

function oneOf<Value extends string>(values: readonly Value[], text: string): Value | null {
  return values.find((value) => value === text) ?? null;
}

export function deviceFilterOf(deviceType: string): VisitDeviceType | null {
  return oneOf(VISIT_DEVICE_TYPES, deviceType);
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

export function visitFiltersOf(search: VisitsSearch, i18n: I18n): VisitFilterReading {
  const typedPaths = PAGE_FILTER_PARAMETERS.map((name) => single(search[name])).filter(
    (path) => path !== '',
  );
  const pathProblems = typedPaths.map((path) => stepProblem({ type: 'page', path }, i18n.t));
  const typedEvent = single(search.event);
  const eventProblem =
    typedEvent === '' ? null : stepProblem({ type: 'event', name: typedEvent }, i18n.t);
  const event = typedEvent === '' || eventProblem !== null ? null : typedEvent;
  const typedProperty = single(search.property);
  const propertyIssue = typedProperty === '' ? null : propertyProblem(typedProperty, event, i18n);
  return {
    filters: {
      paths: typedPaths.filter((_path, index) => pathProblems[index] === null),
      event,
      property: typedProperty === '' || propertyIssue !== null ? null : typedProperty,
      channel: oneOf(CHANNELS, single(search.channel)),
      device: oneOf(VISIT_DEVICE_TYPES, single(search.device)),
      identity: oneOf(VISIT_IDENTITIES, single(search.identity)),
    },
    problems: [
      ...new Set(
        [...pathProblems, eventProblem, propertyIssue].filter((problem) => problem !== null),
      ),
    ],
  };
}

function optional(name: string, value: string | null): Readonly<Record<string, string>> {
  return value === null ? {} : { [name]: value };
}

export function visitFilterParameters(filters: VisitFilters): Readonly<Record<string, string>> {
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
    ...optional('identity', filters.identity),
  };
}

export function visitFilterCount(filters: VisitFilters): number {
  return Object.keys(visitFilterParameters(filters)).length;
}

export function hasVisitFilters(filters: VisitFilters): boolean {
  return visitFilterCount(filters) > 0;
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
  readonly visit: string;
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
  readonly account: VisitAccount | null;
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
  return [
    deviceTypeLabel(visit.deviceType, i18n),
    browserLabel(visit.browser, i18n),
    operatingSystemLabel(visit.os, i18n),
    ...(visit.country === null ? [] : [countryLabel(visit.country, i18n)]),
  ].join(' · ');
}

export function visitRows(
  visits: readonly VisitSummary[],
  timeZone: string,
  i18n: I18n,
): readonly VisitRow[] {
  const started = i18n.format.dateTime('visitStart', timeZone);
  return visits.map((visit) => ({
    key: visit.sessionId,
    visit: shortId(visit.sessionId),
    started: started(new Date(visit.startedAt)),
    startedAt: visit.startedAt,
    duration: formatVisitDuration(visit.startedAt, visit.endedAt, i18n),
    entryPath: visit.entryPath,
    pageViews: formatCount(visit.pageViews, i18n),
    pagesLabel: i18n.t('counts.page', { count: visit.pageViews }),
    highlights: visit.highlights.map(eventLabel),
    failedRequests: visit.failedRequests,
    failedRequestsLabel: failedRequestsLabel(visit.failedRequests, i18n),
    device: deviceLabel(visit, i18n),
    channel: visit.channel === null ? null : channelLabel(visit.channel, i18n),
    account: visitAccount(visit.userId, i18n),
  }));
}

export interface VisitRowsPage {
  readonly rows: readonly VisitRow[];
  readonly nextCursor: string | null;
}
