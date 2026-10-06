import { z } from 'zod';
import { CHANNELS, CHANNEL_LABELS } from './acquisition';
import { browserLabel, countryLabel, deviceTypeLabel, operatingSystemLabel } from './devices';
import { eventLabel, formatQuantity } from './metrics';
import { statusLabel, type StatusTone, statusTone } from './requests';

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

const propertyValueSchema = z.union([z.string(), z.number(), z.boolean()]);

export const timelineResponseSchema = z
  .object({
    visits: z.array(
      z.object({
        session_id: z.string(),
        started_at: z.string(),
        ended_at: z.string(),
        device_type: z.string(),
        browser: z.string(),
        os: z.string(),
        country: z.string().nullable(),
        channel: z.enum(CHANNELS).nullable(),
        events: z.array(
          z.object({
            id: z.string(),
            occurred_at: z.string(),
            name: z.string(),
            path: z.string(),
            properties: z.record(z.string(), propertyValueSchema),
          }),
        ),
      }),
    ),
    next_before: z.string().nullable(),
  })
  .transform((body) => ({
    visits: body.visits.map((visit) => ({
      sessionId: visit.session_id,
      startedAt: visit.started_at,
      endedAt: visit.ended_at,
      deviceType: visit.device_type,
      browser: visit.browser,
      os: visit.os,
      country: visit.country,
      channel: visit.channel,
      events: visit.events.map((event) => ({
        id: event.id,
        occurredAt: event.occurred_at,
        name: event.name,
        path: event.path,
        properties: event.properties,
      })),
    })),
    nextBefore: body.next_before,
  }));

export type TimelineReport = z.output<typeof timelineResponseSchema>;
export type TimelineWire = z.input<typeof timelineResponseSchema>;
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
const NO_PROPERTIES: ReadonlySet<string> = new Set();

function propertiesText(properties: TimelineEvent['properties'], skipped: ReadonlySet<string>) {
  return Object.entries(properties)
    .filter(([key]) => !skipped.has(key))
    .map(([key, value]) => `${key}=${String(value)}`)
    .join(' · ');
}

function itemTitle(event: TimelineEvent): string {
  switch (itemKind(event)) {
    case 'page':
      return `Opened ${event.path}`;
    case 'request':
      return `${String(event.properties.method)} ${String(event.properties.route)}`;
    case 'identify':
      return 'Visit linked to the user';
    case 'event':
      return eventLabel(event.name);
  }
}

function itemDetail(event: TimelineEvent): string {
  const kind = itemKind(event);
  const properties = propertiesText(
    event.properties,
    kind === 'request' ? TITLE_PROPERTIES : NO_PROPERTIES,
  );
  const parts = kind === 'event' ? [event.path, properties] : [properties];
  return parts.filter((part) => part !== '').join(' · ');
}

function itemTag(event: TimelineEvent): ItemTag | null {
  const status = requestStatus(event);
  return itemKind(event) === 'request' && status !== null
    ? { label: statusLabel(status), tone: statusTone(status) }
    : null;
}

function clock(timeZone: string): Intl.DateTimeFormat {
  return new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  });
}

function day(timeZone: string): Intl.DateTimeFormat {
  return new Intl.DateTimeFormat('en-US', {
    timeZone,
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  });
}

export function formatVisitDuration(startedAt: string, endedAt: string): string {
  const seconds = Math.max(
    0,
    Math.round((Date.parse(endedAt) - Date.parse(startedAt)) / MILLISECONDS_PER_SECOND),
  );
  const minutes = Math.floor(seconds / SECONDS_PER_MINUTE);
  const hours = Math.floor(minutes / MINUTES_PER_HOUR);
  if (hours > 0) {
    return `${String(hours)} h ${String(minutes % MINUTES_PER_HOUR)} min`;
  }
  return minutes === 0
    ? `${String(seconds)} s`
    : `${String(minutes)} min ${String(seconds % SECONDS_PER_MINUTE)} s`;
}

export interface VisitView {
  readonly key: string;
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
): readonly VisitView[] {
  const time = clock(timeZone);
  const started = day(timeZone);
  return visits.map((visit) => ({
    key: visit.sessionId,
    heading: `Visit ${shortId(visit.sessionId)} · ${started.format(new Date(visit.startedAt))}`,
    meta: [
      deviceTypeLabel(visit.deviceType),
      browserLabel(visit.browser),
      operatingSystemLabel(visit.os),
      ...(visit.country === null ? [] : [countryLabel(visit.country)]),
      ...(visit.channel === null ? [] : [CHANNEL_LABELS[visit.channel]]),
      formatVisitDuration(visit.startedAt, visit.endedAt),
    ].join(' · '),
    items: visit.events.filter(FILTER_RULES[filter]).map((event) => ({
      key: event.id,
      time: time.format(new Date(event.occurredAt)),
      kind: itemKind(event),
      title: itemTitle(event),
      detail: itemDetail(event),
      tag: itemTag(event),
    })),
  }));
}

export interface TimelineTotals {
  readonly visits: string;
  readonly events: string;
  readonly failedRequests: string;
  readonly hasFailures: boolean;
}

export function timelineTotals(visits: readonly TimelineVisit[]): TimelineTotals {
  const events = visits.flatMap((visit) => visit.events);
  const failed = events.filter(isFailedRequest).length;
  return {
    visits: formatQuantity(visits.length, 'visit', 'visits'),
    events: formatQuantity(events.length, 'event', 'events'),
    failedRequests: formatQuantity(failed, 'failed request', 'failed requests'),
    hasFailures: failed > 0,
  };
}

export function lookupTitle(lookup: Lookup): string {
  return lookup.kind === 'user' ? `User ${lookup.id}` : `Visit ${shortId(lookup.id)}`;
}
