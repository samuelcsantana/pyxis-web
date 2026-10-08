import type { I18n } from '@/i18n/i18n';
import { channelLabel } from './acquisition';
import { browserLabel, countryLabel, deviceTypeLabel, operatingSystemLabel } from './devices';
import { eventLabel } from './metrics';
import { statusLabel, type StatusTone, statusTone } from './requests';
import type { TimelineReport, TimelineWire } from './timeline.schema';

export type { TimelineReport, TimelineWire };

export const USER_ID_PATTERN = /^[A-Za-z0-9_-]{1,64}$/;
export const VISIT_ID_PATTERN =
  /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/;
const PAGE_VIEW = 'page_view';
const API_REQUEST = 'api_request';
const IDENTIFY = 'identify';
const SHORT_ID_LENGTH = 8;
const MILLISECONDS_PER_SECOND = 1000;
const SECONDS_PER_MINUTE = 60;
const MINUTES_PER_HOUR = 60;

export type TimelineVisit = TimelineReport['visits'][number];
export type TimelineEvent = TimelineVisit['events'][number];

export type Lookup =
  { readonly kind: 'user'; readonly id: string } | { readonly kind: 'visit'; readonly id: string };

export interface TimelineSearch {
  readonly user?: string | string[];
  readonly visit?: string | string[];
  readonly show?: string | string[];
}

function single(value: string | string[] | undefined): string | undefined {
  return typeof value === 'string' ? value.trim() : undefined;
}

export interface RejectedLookup {
  readonly kind: Lookup['kind'];
  readonly value: string;
  readonly problem: string;
}

function rejected(
  kind: Lookup['kind'],
  value: string | undefined,
  i18n: I18n,
): RejectedLookup | null {
  return value === undefined || value === ''
    ? null
    : {
        kind,
        value,
        problem: i18n.t('timeline.search.rejected', {
          hint: i18n.t(`timeline.lookupHints.${kind}`),
        }),
      };
}

export function rejectedLookupOf(search: TimelineSearch, i18n: I18n): RejectedLookup | null {
  if (lookupOf(search) !== null) {
    return null;
  }
  return (
    rejected('visit', single(search.visit), i18n) ?? rejected('user', single(search.user), i18n)
  );
}

export function lookupOf(search: TimelineSearch): Lookup | null {
  const visit = single(search.visit);
  if (visit !== undefined && VISIT_ID_PATTERN.test(visit)) {
    return { kind: 'visit', id: visit.toLowerCase() };
  }
  const user = single(search.user);
  return user !== undefined && USER_ID_PATTERN.test(user) ? { kind: 'user', id: user } : null;
}

export const TIMELINE_FILTERS = ['all', 'pages', 'events', 'requests', 'errors'] as const;
export type TimelineFilter = (typeof TIMELINE_FILTERS)[number];

export function timelineFilterOf(search: TimelineSearch): TimelineFilter {
  const show = single(search.show);
  return TIMELINE_FILTERS.find((filter) => filter === show) ?? 'all';
}

export type ItemKind = 'page' | 'request' | 'identify' | 'event';

export function itemKind(event: TimelineEvent): ItemKind {
  if (event.name === PAGE_VIEW) {
    return 'page';
  }
  if (event.name === API_REQUEST) {
    return 'request';
  }
  return event.name === IDENTIFY ? 'identify' : 'event';
}

function requestStatus(event: TimelineEvent): number | null {
  const status = event.properties.status;
  return typeof status === 'number' ? status : null;
}

export function isFailedRequest(event: TimelineEvent): boolean {
  const status = requestStatus(event);
  return itemKind(event) === 'request' && status !== null && statusTone(status) !== 'success';
}

const FILTER_RULES: Readonly<Record<TimelineFilter, (event: TimelineEvent) => boolean>> = {
  all: () => true,
  pages: (event) => itemKind(event) === 'page',
  events: (event) => itemKind(event) === 'event' || itemKind(event) === 'identify',
  requests: (event) => itemKind(event) === 'request',
  errors: isFailedRequest,
};

export interface ItemTag {
  readonly label: string;
  readonly tone: StatusTone;
}

export interface TimelineItem {
  readonly key: string;
  readonly time: string;
  readonly kind: ItemKind;
  readonly title: string;
  readonly detail: string;
  readonly tag: ItemTag | null;
}

const TITLE_PROPERTIES: ReadonlySet<string> = new Set(['method', 'route']);
const SHOWN_BY_REQUEST_ITEM: ReadonlySet<string> = new Set([...TITLE_PROPERTIES, 'status']);

function propertiesText(properties: TimelineEvent['properties']) {
  return Object.entries(properties)
    .map(([key, value]) => `${key}=${String(value)}`)
    .join(' · ');
}

function itemTitle(event: TimelineEvent, i18n: I18n): string {
  switch (itemKind(event)) {
    case 'page':
      return i18n.t('timeline.openedPage', { path: event.path });
    case 'request':
      return `${String(event.properties.method)} ${String(event.properties.route)}`;
    case 'identify':
      return i18n.t('timeline.linkedToUser');
    case 'event':
      return eventLabel(event.name);
  }
}

const REQUEST_VALUE_FORMATS: Readonly<Record<string, (value: string) => string>> = {
  duration_ms: (value) => `${value} ms`,
  error_code: (value) => value,
};

function requestDetail(event: TimelineEvent): string {
  const skipped = requestStatus(event) === null ? TITLE_PROPERTIES : SHOWN_BY_REQUEST_ITEM;
  return Object.entries(event.properties)
    .filter(([key]) => !skipped.has(key))
    .map(([key, value]) => {
      const format = REQUEST_VALUE_FORMATS[key];
      return format === undefined ? `${key}=${String(value)}` : format(String(value));
    })
    .join(' · ');
}

function itemDetail(event: TimelineEvent): string {
  const kind = itemKind(event);
  if (kind === 'request') {
    return requestDetail(event);
  }
  const properties = propertiesText(event.properties);
  const parts = kind === 'event' ? [event.path, properties] : [properties];
  return parts.filter((part) => part !== '').join(' · ');
}

function itemTag(event: TimelineEvent, i18n: I18n): ItemTag | null {
  const status = requestStatus(event);
  return itemKind(event) === 'request' && status !== null
    ? { label: statusLabel(status, i18n), tone: statusTone(status) }
    : null;
}

export function formatVisitDuration(startedAt: string, endedAt: string, i18n: I18n): string {
  return formatSeconds(
    Math.max(
      0,
      Math.round((Date.parse(endedAt) - Date.parse(startedAt)) / MILLISECONDS_PER_SECOND),
    ),
    i18n,
  );
}

export function formatSeconds(seconds: number, i18n: I18n): string {
  const minutes = Math.floor(seconds / SECONDS_PER_MINUTE);
  const hours = Math.floor(minutes / MINUTES_PER_HOUR);
  if (hours > 0) {
    return i18n.t('timeline.duration.hours', {
      hours: String(hours),
      minutes: String(minutes % MINUTES_PER_HOUR),
    });
  }
  return minutes === 0
    ? i18n.t('timeline.duration.seconds', { seconds: String(seconds) })
    : i18n.t('timeline.duration.minutes', {
        minutes: String(minutes),
        seconds: String(seconds % SECONDS_PER_MINUTE),
      });
}

export interface VisitView {
  readonly key: string;
  readonly personId: string | null;
  readonly heading: string;
  readonly meta: string;
  readonly items: readonly TimelineItem[];
}

export function shortId(id: string): string {
  return id.slice(0, SHORT_ID_LENGTH);
}

export function visitViews(
  visits: readonly TimelineVisit[],
  timeZone: string,
  filter: TimelineFilter,
  i18n: I18n,
): readonly VisitView[] {
  const time = i18n.format.dateTime('clock', timeZone);
  const started = i18n.format.dateTime('visitStart', timeZone);
  return visits.map((visit) => ({
    key: visit.sessionId,
    personId: visit.userId,
    heading: i18n.t('timeline.visitHeading', {
      visit: shortId(visit.sessionId),
      started: started(new Date(visit.startedAt)),
    }),
    meta: [
      deviceTypeLabel(visit.deviceType, i18n),
      browserLabel(visit.browser, i18n),
      operatingSystemLabel(visit.os, i18n),
      ...(visit.country === null ? [] : [countryLabel(visit.country, i18n)]),
      ...(visit.channel === null ? [] : [channelLabel(visit.channel, i18n)]),
      formatVisitDuration(visit.startedAt, visit.endedAt, i18n),
    ].join(' · '),
    items: visit.events.filter(FILTER_RULES[filter]).map((event) => ({
      key: event.id,
      time: time(new Date(event.occurredAt)),
      kind: itemKind(event),
      title: itemTitle(event, i18n),
      detail: itemDetail(event),
      tag: itemTag(event, i18n),
    })),
  }));
}

export interface TimelineTotals {
  readonly visits: string;
  readonly items: string;
  readonly failedRequests: string;
  readonly hasFailures: boolean;
}

export function timelineTotals(visits: readonly TimelineVisit[], i18n: I18n): TimelineTotals {
  const items = visits.flatMap((visit) => visit.events);
  const failed = items.filter(isFailedRequest).length;
  return {
    visits: i18n.t('counts.visit', { count: visits.length }),
    items: i18n.t('counts.item', { count: items.length }),
    failedRequests: i18n.t('counts.failedRequest', { count: failed }),
    hasFailures: failed > 0,
  };
}

export function lookupTitle(lookup: Lookup, i18n: I18n): string {
  return lookup.kind === 'user'
    ? i18n.t('timeline.userTitle', { user: lookup.id })
    : i18n.t('timeline.visitTitle', { visit: shortId(lookup.id) });
}

export interface TimelineSearchText {
  readonly lookUp: string;
  readonly kinds: Readonly<Record<Lookup['kind'], string>>;
  readonly ids: Readonly<Record<Lookup['kind'], string>>;
  readonly submit: string;
  readonly pending: string;
}

export function timelineSearchText(i18n: I18n): TimelineSearchText {
  return {
    lookUp: i18n.t('timeline.search.lookUp'),
    kinds: {
      user: i18n.t('timeline.search.kinds.user'),
      visit: i18n.t('timeline.search.kinds.visit'),
    },
    ids: {
      user: i18n.t('timeline.search.ids.user'),
      visit: i18n.t('timeline.search.ids.visit'),
    },
    submit: i18n.t('timeline.search.submit'),
    pending: i18n.t('timeline.search.pending'),
  };
}

export interface OlderVisitsText {
  readonly everyVisit: string;
  readonly load: string;
  readonly loading: string;
  readonly failed: string;
  readonly nothingOfThisKind: string;
}

export function olderVisitsText(i18n: I18n): OlderVisitsText {
  return {
    everyVisit: i18n.t('timeline.older.everyVisit'),
    load: i18n.t('timeline.older.load'),
    loading: i18n.t('timeline.older.loading'),
    failed: i18n.t('timeline.older.failed'),
    nothingOfThisKind: i18n.t('timeline.card.nothingOfThisKind'),
  };
}
