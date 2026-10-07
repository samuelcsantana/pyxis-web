import {
  type Lookup,
  type TimelineReport,
  timelineResponseSchema,
  type TimelineWire,
} from '@/domain/timeline';
import { demoProjectOf } from '../demo/demo-projects';
import { type DemoVisit, demoVisitWire } from '../demo/demo-visits';

export { DEMO_STORE_PERSON as DEMO_USER_ID } from '../demo/demo-store-visits';

const DEMO_PAGE_SIZE = 2;

function matchingVisits(projectId: string, lookup: Lookup): readonly DemoVisit[] {
  const { visits } = demoProjectOf(projectId);
  if (lookup.kind === 'user') {
    return visits.filter((visit) => visit.userId === lookup.id);
  }
  return visits.filter((visit) => visit.sessionId === lookup.id);
}

export function demoTimelineWire(projectId: string, lookup: Lookup, now: Date): TimelineWire {
  return {
    visits: matchingVisits(projectId, lookup).map((visit) => demoVisitWire(visit, now)),
    next_before: null,
  };
}

export function demoTimelineReport(projectId: string, lookup: Lookup, now: Date): TimelineReport {
  return timelineResponseSchema.parse(demoTimelineWire(projectId, lookup, now));
}

export function demoTimelinePage(
  projectId: string,
  lookup: Lookup,
  now: Date,
  before: string | null,
): TimelineReport {
  const older = demoTimelineWire(projectId, lookup, now).visits.filter(
    (visit) => before === null || visit.started_at < before,
  );
  const page = older.slice(0, DEMO_PAGE_SIZE);
  const last = page.at(-1);
  return timelineResponseSchema.parse({
    visits: page,
    next_before: older.length > DEMO_PAGE_SIZE && last !== undefined ? last.started_at : null,
  });
}
