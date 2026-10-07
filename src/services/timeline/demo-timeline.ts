import {
  type Lookup,
  type TimelineReport,
  timelineResponseSchema,
  type TimelineWire,
} from '@/domain/timeline';
import { DEMO_VISITS, type DemoVisit, demoVisitWire } from '../demo/demo-visits';

export { DEMO_USER_ID } from '../demo/demo-visits';

const DEMO_PAGE_SIZE = 2;

function matchingVisits(lookup: Lookup): readonly DemoVisit[] {
  if (lookup.kind === 'user') {
    return DEMO_VISITS.filter((visit) => visit.userId === lookup.id);
  }
  return DEMO_VISITS.filter((visit) => visit.sessionId === lookup.id);
}

export function demoTimelineWire(lookup: Lookup, now: Date): TimelineWire {
  return {
    visits: matchingVisits(lookup).map((visit) => demoVisitWire(visit, now)),
    next_before: null,
  };
}

export function demoTimelineReport(lookup: Lookup, now: Date): TimelineReport {
  return timelineResponseSchema.parse(demoTimelineWire(lookup, now));
}

export function demoTimelinePage(lookup: Lookup, now: Date, before: string | null): TimelineReport {
  const older = demoTimelineWire(lookup, now).visits.filter(
    (visit) => before === null || visit.started_at < before,
  );
  const page = older.slice(0, DEMO_PAGE_SIZE);
  const last = page.at(-1);
  return timelineResponseSchema.parse({
    visits: page,
    next_before: older.length > DEMO_PAGE_SIZE && last !== undefined ? last.started_at : null,
  });
}
