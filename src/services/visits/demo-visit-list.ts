import { type VisitFilters, type VisitsReport, type VisitsWire } from '@/domain/visits';
import { visitsResponseSchema } from '@/domain/visits.schema';
import type { DateRange } from '../date-range';
import { demoProjectOf } from '../demo/demo-projects';
import { API_REQUEST, type DemoEventRecord, type DemoVisitRecord } from '../demo/demo-records';
import {
  countWhere,
  demoScopeOf,
  demoVisitsIn,
  isFailedStatus,
  isNamedEvent,
  isPageView,
  pathPattern,
} from '../demo/demo-scope';

export const DEMO_VISITS_PAGE_SIZE = 8;
const MAX_HIGHLIGHTS = 5;
const CURSOR_SEPARATOR = '~';
const PROPERTY_SEPARATOR = '=';

type VisitSummaryWire = VisitsWire['visits'][number];

interface Listed {
  readonly visit: DemoVisitRecord;
  readonly cursor: string;
}

function isFailedCall(event: DemoEventRecord): boolean {
  return event.name === API_REQUEST && isFailedStatus(Number(event.properties.status));
}

function isoAt(at: number): string {
  return new Date(at).toISOString();
}

function startOf(visit: DemoVisitRecord): number {
  return Math.min(...visit.events.map((event) => event.at));
}

export function demoVisitSummary(visit: DemoVisitRecord): VisitSummaryWire {
  const times = visit.events.map((event) => event.at);
  const pageViews = visit.events.filter(isPageView);
  const named = visit.events.filter(isNamedEvent).map((event) => event.name);
  return {
    session_id: visit.sessionId,
    started_at: isoAt(Math.min(...times)),
    ended_at: isoAt(Math.max(...times)),
    entry_path: pageViews[0]?.path ?? null,
    page_views: pageViews.length,
    highlights: [...new Set(named)].slice(0, MAX_HIGHLIGHTS),
    failed_requests: countWhere(visit.events, isFailedCall),
    device_type: visit.deviceType,
    browser: visit.browser,
    os: visit.os,
    country: visit.country,
    channel: visit.channel,
    user_id: visit.userId,
    source: visit.source,
    campaign: visit.campaign,
  };
}

function carriesProperty(event: DemoEventRecord, property: string | null): boolean {
  if (property === null) {
    return true;
  }
  const separator = property.indexOf(PROPERTY_SEPARATOR);
  const value = event.properties[property.slice(0, separator)];
  return value !== undefined && String(value) === property.slice(separator + 1);
}

function sentEvent(visit: DemoVisitRecord, filters: VisitFilters): boolean {
  return (
    filters.event === null ||
    visit.events.some(
      (event) => event.name === filters.event && carriesProperty(event, filters.property),
    )
  );
}

function isRequestTo(event: DemoEventRecord, route: string, failed: boolean): boolean {
  return (
    event.name === API_REQUEST &&
    `${String(event.properties.method)} ${String(event.properties.route)}` === route &&
    (!failed || isFailedStatus(Number(event.properties.status)))
  );
}

function madeRequest(visit: DemoVisitRecord, route: string | null, failed: boolean): boolean {
  if (route === null) {
    return !failed || visit.events.some(isFailedCall);
  }
  return visit.events.some((event) => isRequestTo(event, route, failed));
}

function cameFrom(visit: DemoVisitRecord, filters: VisitFilters): boolean {
  return (
    (filters.country === null || visit.country === filters.country) &&
    (filters.source === null || visit.source === filters.source) &&
    (filters.campaign === null || visit.campaign === filters.campaign)
  );
}

function matcherOf(filters: VisitFilters): (visit: DemoVisitRecord) => boolean {
  const pages = filters.paths.map(pathPattern);
  const viewed = (visit: DemoVisitRecord, page: RegExp) =>
    visit.events.some((event) => isPageView(event) && page.test(event.path));
  return (visit) =>
    pages.every((page) => viewed(visit, page)) &&
    sentEvent(visit, filters) &&
    (filters.channel === null || visit.channel === filters.channel) &&
    (filters.device === null || visit.deviceType === filters.device) &&
    (filters.identity === null ||
      (visit.userId !== null) === (filters.identity === 'identified')) &&
    cameFrom(visit, filters) &&
    madeRequest(visit, filters.route, filters.failed);
}

export function demoVisitsPage(
  visits: readonly DemoVisitRecord[],
  filters: VisitFilters,
  cursor: string | null,
): VisitsWire {
  const matching = visits
    .filter(matcherOf(filters))
    .map((visit): Listed => ({
      visit,
      cursor: `${isoAt(startOf(visit))}${CURSOR_SEPARATOR}${visit.sessionId}`,
    }))
    .toSorted((left, right) => (left.cursor < right.cursor ? 1 : -1));
  const listed = matching.filter((visit) => cursor === null || visit.cursor < cursor);
  const page = listed.slice(0, DEMO_VISITS_PAGE_SIZE);
  const last = listed.length > DEMO_VISITS_PAGE_SIZE ? page.at(-1) : undefined;
  return {
    visits: page.map(({ visit }) => demoVisitSummary(visit)),
    next_cursor: last === undefined ? null : last.cursor,
    total: matching.length,
  };
}

export function demoVisitsWire(
  projectId: string,
  range: DateRange,
  filters: VisitFilters,
  cursor: string | null,
  now: Date,
): VisitsWire {
  return demoVisitsPage(
    demoVisitsIn(demoProjectOf(projectId), demoScopeOf(range, now)),
    filters,
    cursor,
  );
}

export function demoVisitsReport(
  projectId: string,
  range: DateRange,
  filters: VisitFilters,
  cursor: string | null,
  now: Date,
): VisitsReport {
  return visitsResponseSchema.parse(demoVisitsWire(projectId, range, filters, cursor, now));
}
