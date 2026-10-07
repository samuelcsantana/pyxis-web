import { todayIn } from '@/domain/period';
import {
  type VisitFilters,
  type VisitsReport,
  visitsResponseSchema,
  type VisitsWire,
} from '@/domain/visits';
import type { DateRange } from '../date-range';
import { DEMO_VISITS, type DemoVisit, demoVisitWire, isFailedStatus } from '../demo/demo-visits';

export const DEMO_VISITS_PAGE_SIZE = 8;
const MAX_HIGHLIGHTS = 5;
const PAGE_VIEW = 'page_view';
const API_REQUEST = 'api_request';
const UNNAMED_EVENTS: ReadonlySet<string> = new Set([PAGE_VIEW, 'identify', API_REQUEST]);
const CURSOR_SEPARATOR = '~';
const PROPERTY_SEPARATOR = '=';
const WILDCARD = '*';
const REGEX_SPECIAL_CHARACTERS = /[.*+?^${}()|[\]\\]/g;

type VisitSummaryWire = VisitsWire['visits'][number];
type TimelineVisitWire = ReturnType<typeof demoVisitWire>;
type TimelineEventWire = TimelineVisitWire['events'][number];

export interface ListedVisit {
  readonly summary: VisitSummaryWire;
  readonly events: readonly TimelineEventWire[];
}

export function listedDemoVisit(visit: DemoVisit, now: Date): ListedVisit {
  const wire = demoVisitWire(visit, now);
  const pageViews = wire.events.filter((event) => event.name === PAGE_VIEW);
  const named = wire.events.map((event) => event.name).filter((name) => !UNNAMED_EVENTS.has(name));
  return {
    summary: {
      session_id: wire.session_id,
      started_at: wire.started_at,
      ended_at: wire.ended_at,
      entry_path: pageViews[0]?.path ?? null,
      page_views: pageViews.length,
      highlights: [...new Set(named)].slice(0, MAX_HIGHLIGHTS),
      failed_requests: wire.events.filter(
        (event) => event.name === API_REQUEST && isFailedStatus(Number(event.properties.status)),
      ).length,
      device_type: wire.device_type,
      browser: wire.browser,
      os: wire.os,
      country: wire.country,
      channel: wire.channel,
      user_id: visit.userId ?? null,
    },
    events: wire.events,
  };
}

function pagePattern(path: string): RegExp {
  const parts = path
    .split(WILDCARD)
    .map((part) => part.replaceAll(REGEX_SPECIAL_CHARACTERS, String.raw`\$&`));
  return new RegExp(`^${parts.join('.*')}$`);
}

function viewedPage(visit: ListedVisit, path: string): boolean {
  const page = pagePattern(path);
  return visit.events.some((event) => event.name === PAGE_VIEW && page.test(event.path));
}

function carriesProperty(event: TimelineEventWire, property: string | null): boolean {
  if (property === null) {
    return true;
  }
  const separator = property.indexOf(PROPERTY_SEPARATOR);
  const value = event.properties[property.slice(0, separator)];
  return value !== undefined && String(value) === property.slice(separator + 1);
}

function sentEvent(visit: ListedVisit, filters: VisitFilters): boolean {
  return (
    filters.event === null ||
    visit.events.some(
      (event) => event.name === filters.event && carriesProperty(event, filters.property),
    )
  );
}

function isIdentified(visit: ListedVisit): boolean {
  return visit.summary.user_id !== null;
}

function matches(visit: ListedVisit, filters: VisitFilters): boolean {
  return (
    filters.paths.every((path) => viewedPage(visit, path)) &&
    sentEvent(visit, filters) &&
    (filters.channel === null || visit.summary.channel === filters.channel) &&
    (filters.device === null || visit.summary.device_type === filters.device) &&
    (filters.identity === null || isIdentified(visit) === (filters.identity === 'identified'))
  );
}

function withinRange(visit: ListedVisit, range: DateRange, timeZone: string): boolean {
  const day = todayIn(timeZone, new Date(visit.summary.started_at));
  return range.from <= day && day <= range.to;
}

function cursorOf(visit: VisitSummaryWire): string {
  return `${visit.started_at}${CURSOR_SEPARATOR}${visit.session_id}`;
}

export function demoVisitsWire(
  range: DateRange,
  filters: VisitFilters,
  cursor: string | null,
  now: Date,
  timeZone: string,
): VisitsWire {
  const listed = DEMO_VISITS.map((visit) => listedDemoVisit(visit, now))
    .filter((visit) => withinRange(visit, range, timeZone) && matches(visit, filters))
    .map((visit) => visit.summary)
    .toSorted((left, right) => cursorOf(right).localeCompare(cursorOf(left)))
    .filter((visit) => cursor === null || cursorOf(visit) < cursor);
  const page = listed.slice(0, DEMO_VISITS_PAGE_SIZE);
  const last = listed.length > DEMO_VISITS_PAGE_SIZE ? page.at(-1) : undefined;
  return { visits: page, next_cursor: last === undefined ? null : cursorOf(last) };
}

export function demoVisitsReport(
  range: DateRange,
  filters: VisitFilters,
  cursor: string | null,
  now: Date,
  timeZone: string,
): VisitsReport {
  return visitsResponseSchema.parse(demoVisitsWire(range, filters, cursor, now, timeZone));
}
