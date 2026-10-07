import type { Channel } from '@/domain/acquisition';

type Properties = Readonly<Record<string, string | number | boolean>>;

export interface DemoRequest {
  readonly method: string;
  readonly route: string;
  readonly status: number;
  readonly durationMs: number;
  readonly errorCode?: string;
}

export interface DemoNamedEvent {
  readonly second: number;
  readonly name: string;
  readonly path: string;
  readonly properties?: Properties;
}

export interface DemoRequestEvent {
  readonly second: number;
  readonly path: string;
  readonly request: DemoRequest;
}

export type DemoEvent = DemoNamedEvent | DemoRequestEvent;

export interface DemoVisit {
  readonly sessionId: string;
  readonly daysAgo: number;
  readonly startHour: number;
  readonly startMinute: number;
  readonly deviceType: string;
  readonly browser: string;
  readonly os: string;
  readonly country: string;
  readonly channel: Channel;
  readonly userId?: string;
  readonly events: readonly DemoEvent[];
}

export interface DemoFailedRequest {
  readonly method: string;
  readonly route: string;
  readonly path: string;
  readonly occurredAt: string;
  readonly status: number;
  readonly errorCode: string | null;
  readonly sessionId: string;
}

const API_REQUEST_EVENT = 'api_request';
const NO_RESPONSE_STATUS = 0;
const FIRST_FAILING_STATUS = 400;
const MILLISECONDS_PER_DAY = 86_400_000;
const MILLISECONDS_PER_SECOND = 1000;

export function request(second: number, path: string, demoRequest: DemoRequest): DemoRequestEvent {
  return { second, path, request: demoRequest };
}

function visitStart(visit: DemoVisit, now: Date): number {
  const midnight = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  return (
    midnight -
    visit.daysAgo * MILLISECONDS_PER_DAY +
    Date.UTC(1970, 0, 1, visit.startHour, visit.startMinute)
  );
}

function eventId(sessionId: string, index: number): string {
  return `${sessionId.slice(0, 24)}${String(index).padStart(12, '0')}`;
}

function requestProperties(demoRequest: DemoRequest): Properties {
  return {
    method: demoRequest.method,
    route: demoRequest.route,
    status: demoRequest.status,
    duration_ms: demoRequest.durationMs,
    ...(demoRequest.errorCode === undefined ? {} : { error_code: demoRequest.errorCode }),
  };
}

function eventWire(event: DemoEvent): { name: string; properties: Properties } {
  if ('request' in event) {
    return { name: API_REQUEST_EVENT, properties: requestProperties(event.request) };
  }
  return { name: event.name, properties: event.properties ?? {} };
}

function secondAfter(start: number, second: number): string {
  return new Date(start + second * MILLISECONDS_PER_SECOND).toISOString();
}

export function isFailedStatus(status: number): boolean {
  return status === NO_RESPONSE_STATUS || status >= FIRST_FAILING_STATUS;
}

export function demoFailedRequests(
  visits: readonly DemoVisit[],
  now: Date,
): readonly DemoFailedRequest[] {
  return visits.flatMap((visit) => {
    const start = visitStart(visit, now);
    return visit.events.flatMap((event) =>
      'request' in event && isFailedStatus(event.request.status)
        ? [
            {
              method: event.request.method,
              route: event.request.route,
              path: event.path,
              occurredAt: secondAfter(start, event.second),
              status: event.request.status,
              errorCode: event.request.errorCode ?? null,
              sessionId: visit.sessionId,
            },
          ]
        : [],
    );
  });
}

export function demoVisitWire(visit: DemoVisit, now: Date) {
  const start = visitStart(visit, now);
  const at = (second: number) => secondAfter(start, second);
  const seconds = visit.events.map((event) => event.second);
  return {
    session_id: visit.sessionId,
    started_at: at(Math.min(...seconds)),
    ended_at: at(Math.max(...seconds)),
    device_type: visit.deviceType,
    browser: visit.browser,
    os: visit.os,
    country: visit.country,
    channel: visit.channel,
    events: visit.events.map((event, index) => {
      const { name, properties } = eventWire(event);
      return {
        id: eventId(visit.sessionId, index),
        occurred_at: at(event.second),
        name,
        path: event.path,
        properties,
      };
    }),
  };
}
