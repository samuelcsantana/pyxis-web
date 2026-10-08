import { addDays, todayIn } from '@/domain/period';
import { type Lookup, type TimelineReport, type TimelineWire } from '@/domain/timeline';
import { timelineResponseSchema } from '@/domain/timeline.schema';
import { demoProjectOf } from '../demo/demo-projects';
import { type DemoVisitRecord, demoVisitRecordWire } from '../demo/demo-records';
import { byKeys, demoScopeOf, demoVisitsIn } from '../demo/demo-scope';

export { DEMO_STORE_PERSON as DEMO_USER_ID } from '../demo/demo-store-visits';

export const DEMO_TIMELINE_DAYS = 90;
const DEMO_PAGE_SIZE = 2;

function matchingVisits(projectId: string, lookup: Lookup, now: Date): readonly DemoVisitRecord[] {
  const project = demoProjectOf(projectId);
  const today = todayIn(project.timezone, now);
  const range = { from: addDays(today, 1 - DEMO_TIMELINE_DAYS), to: today };
  const matches = (visit: DemoVisitRecord) =>
    (lookup.kind === 'user' ? visit.userId : visit.sessionId) === lookup.id;
  return demoVisitsIn(project, demoScopeOf(range, now)).filter(matches);
}

export function demoTimelineWire(projectId: string, lookup: Lookup, now: Date): TimelineWire {
  return {
    visits: matchingVisits(projectId, lookup, now)
      .map(demoVisitRecordWire)
      .toSorted(byKeys((visit) => [-new Date(visit.started_at).getTime(), visit.session_id])),
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
