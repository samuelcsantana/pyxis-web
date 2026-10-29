import { type VisitFilters, type VisitsReport, type VisitsWire } from '@/domain/visits';
import { visitsResponseSchema } from '@/domain/visits.schema';
import type { DateRange } from '../date-range';
import { demoProjectOf } from '../demo/demo-projects';
import { API_REQUEST, type DemoEventRecord, type DemoVisitRecord } from '../demo/demo-records';
import {
  countWhere,
  dashboardMatcherOf,
  demoScopeOf,
  demoVisitsIn,
  isFailedCall,
  isFailedStatus,
  isNamedEvent,
  isPageView,
} from '../demo/demo-scope';

export const DEMO_VISITS_PAGE_SIZE = 8;
const MAX_HIGHLIGHTS = 5;
const CURSOR_SEPARATOR = '~';

type VisitSummaryWire = VisitsWire['visits'][number];

interface Listed {
  readonly visit: DemoVisitRecord;
  readonly cursor: string;
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
    region: visit.region,
    region_name: visit.regionName,
    city: visit.city,
    channel: visit.channel,
    user_id: visit.userId,
    source: visit.source,
    campaign: visit.campaign,
  };
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

function matcherOf(filters: VisitFilters): (visit: DemoVisitRecord) => boolean {
  const matchesDashboard = dashboardMatcherOf({ ...filters, failed: false });
  return (visit) => matchesDashboard(visit) && madeRequest(visit, filters.route, filters.failed);
}

export function demoVisitsPage(
  visits: readonly DemoVisitRecord[],
  filters: VisitFilters,
  cursor: string | null,
  timezone: string,
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
    timezone,
  };
}

export function demoVisitsWire(
  projectId: string,
  range: DateRange,
  filters: VisitFilters,
  cursor: string | null,
  now: Date,
): VisitsWire {
  const project = demoProjectOf(projectId);
  return demoVisitsPage(
    demoVisitsIn(project, demoScopeOf(range, now)),
    filters,
    cursor,
    project.timezone,
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
