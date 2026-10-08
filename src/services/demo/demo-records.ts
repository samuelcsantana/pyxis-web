import type { Channel } from '@/domain/acquisition';
import type { DemoRequest, DemoVisit } from './demo-visits';

export type DemoProperties = Readonly<Record<string, string | number | boolean>>;

export interface DemoEventRecord {
  readonly at: number;
  readonly date: string;
  readonly time: string;
  readonly name: string;
  readonly path: string;
  readonly properties: DemoProperties;
  readonly request: DemoRequest | null;
}

export interface DemoAttribution {
  readonly source: string;
  readonly medium: string | null;
  readonly campaign: string | null;
}

export interface DemoVisitRecord extends DemoAttribution {
  readonly sessionId: string;
  readonly userId: string | null;
  readonly deviceType: string;
  readonly browser: string;
  readonly os: string;
  readonly country: string;
  readonly channel: Channel;
  readonly fromAdClick: boolean;
  readonly events: readonly DemoEventRecord[];
}

export const PAGE_VIEW = 'page_view';
export const API_REQUEST = 'api_request';

const MILLISECONDS_PER_SECOND = 1000;
const MILLISECONDS_PER_HOUR = 3_600_000;
const MILLISECONDS_PER_DAY = 86_400_000;
const NOON_HOUR = 12;
const ISO_DATE_LENGTH = 10;
const ISO_TIME_START = 11;
const ISO_TIME_END = 23;
const EVENT_ID_PREFIX_LENGTH = 24;
const EVENT_ID_INDEX_LENGTH = 12;

const offsetFormatters = new Map<string, Intl.DateTimeFormat>();

function offsetFormatter(timeZone: string): Intl.DateTimeFormat {
  const cached = offsetFormatters.get(timeZone);
  if (cached !== undefined) {
    return cached;
  }
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  offsetFormatters.set(timeZone, formatter);
  return formatter;
}

export function zoneOffset(timeZone: string, instant: number): number {
  const wholeSeconds = Math.floor(instant / MILLISECONDS_PER_SECOND) * MILLISECONDS_PER_SECOND;
  const parts = Object.fromEntries(
    offsetFormatter(timeZone)
      .formatToParts(new Date(wholeSeconds))
      .map((part) => [part.type, part.value]),
  );
  const asUtc = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
    Number(parts.second),
  );
  return asUtc - wholeSeconds;
}

export function localMidnight(timeZone: string, date: string): number {
  const midnightUtc = new Date(`${date}T00:00:00.000Z`).getTime();
  return midnightUtc - zoneOffset(timeZone, midnightUtc + NOON_HOUR * MILLISECONDS_PER_HOUR);
}

export function localDateAndTime(timeZone: string, at: number) {
  const local = new Date(at + zoneOffset(timeZone, at)).toISOString();
  return {
    date: local.slice(0, ISO_DATE_LENGTH),
    time: local.slice(ISO_TIME_START, ISO_TIME_END),
  };
}

export function requestProperties(request: DemoRequest): DemoProperties {
  return {
    method: request.method,
    route: request.route,
    status: request.status,
    duration_ms: request.durationMs,
    ...(request.errorCode === undefined ? {} : { error_code: request.errorCode }),
  };
}

function visitStart(visit: DemoVisit, now: Date): number {
  const midnight = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  return (
    midnight -
    visit.daysAgo * MILLISECONDS_PER_DAY +
    Date.UTC(1970, 0, 1, visit.startHour, visit.startMinute)
  );
}

export function showcaseRecord(
  visit: DemoVisit,
  attribution: DemoAttribution,
  timeZone: string,
  now: Date,
): DemoVisitRecord {
  const start = visitStart(visit, now);
  return {
    sessionId: visit.sessionId,
    userId: visit.userId ?? null,
    deviceType: visit.deviceType,
    browser: visit.browser,
    os: visit.os,
    country: visit.country,
    channel: visit.channel,
    ...attribution,
    fromAdClick: false,
    events: visit.events.map((event) => {
      const at = start + event.second * MILLISECONDS_PER_SECOND;
      const place = { at, ...localDateAndTime(timeZone, at), path: event.path };
      return 'request' in event
        ? {
            ...place,
            name: API_REQUEST,
            properties: requestProperties(event.request),
            request: event.request,
          }
        : { ...place, name: event.name, properties: event.properties ?? {}, request: null };
    }),
  };
}

function eventId(sessionId: string, index: number): string {
  return `${sessionId.slice(0, EVENT_ID_PREFIX_LENGTH)}${String(index).padStart(EVENT_ID_INDEX_LENGTH, '0')}`;
}

function isoAt(at: number): string {
  return new Date(at).toISOString();
}

export function demoVisitRecordWire(visit: DemoVisitRecord) {
  const times = visit.events.map((event) => event.at);
  return {
    session_id: visit.sessionId,
    started_at: isoAt(Math.min(...times)),
    ended_at: isoAt(Math.max(...times)),
    device_type: visit.deviceType,
    browser: visit.browser,
    os: visit.os,
    country: visit.country,
    channel: visit.channel,
    user_id: visit.userId,
    events: visit.events.map((event, index) => ({
      id: eventId(visit.sessionId, index),
      occurred_at: isoAt(event.at),
      name: event.name,
      path: event.path,
      properties: event.properties,
    })),
  };
}
