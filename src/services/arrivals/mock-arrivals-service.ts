import { type Arrivals, type ArrivalsReport, MAX_ARRIVAL_TIMES } from '@/domain/arrivals';
import { addDays, todayIn } from '@/domain/period';
import type { DateRange } from '../date-range';
import type { DemoProject } from '../demo/demo-catalog';
import { demoProjectOf } from '../demo/demo-projects';
import type { DemoEventRecord, DemoVisitRecord } from '../demo/demo-records';
import { demoScopeOf, demoVisitsIn, hasFailed, isNamedEvent, isPageView } from '../demo/demo-scope';
import type { IArrivalsService } from './arrivals-service.interface';

const SECOND_MS = 1_000;
const ACTIVE_VISIT_WINDOW_MS = 5 * 60 * SECOND_MS;
const MAX_SINCE_AGE_MS = 7 * 24 * 60 * 60 * SECOND_MS;
const DAYS_BEFORE_THE_OLDEST_SINCE = 8;

function receivedAt(event: DemoEventRecord): number {
  return Math.ceil(event.at / SECOND_MS) * SECOND_MS;
}

function newestFirst(times: readonly number[]): Arrivals {
  const sorted = [...times].sort((later, earlier) => earlier - later);
  return { times: sorted.slice(0, MAX_ARRIVAL_TIMES), more: sorted.length > MAX_ARRIVAL_TIMES };
}

function boundedSince(since: Date, now: number): number {
  return Math.min(Math.max(since.getTime(), now - MAX_SINCE_AGE_MS), now);
}

function recentPartOf(range: DateRange, today: string): DateRange {
  const oldest = addDays(today, -DAYS_BEFORE_THE_OLDEST_SINCE);
  return { from: range.from > oldest ? range.from : oldest, to: range.to };
}

function eventsOf(visits: readonly DemoVisitRecord[]): readonly DemoEventRecord[] {
  return visits.flatMap((visit) => visit.events);
}

function entryTimes(visits: readonly DemoVisitRecord[], after: number): number[] {
  return visits.flatMap((visit) => {
    const entry = visit.events.find(isPageView);
    return entry !== undefined && entry.at > after ? [receivedAt(entry)] : [];
  });
}

function timesWhere(
  events: readonly DemoEventRecord[],
  after: number,
  test: (event: DemoEventRecord) => boolean,
): number[] {
  return events.filter((event) => event.at > after && test(event)).map(receivedAt);
}

function activeVisitsOf(project: DemoProject, now: Date): number {
  const today = todayIn(project.timezone, now);
  const lately = demoVisitsIn(project, demoScopeOf({ from: addDays(today, -1), to: today }, now));
  const windowStart = now.getTime() - ACTIVE_VISIT_WINDOW_MS;
  return lately.filter((visit) => visit.events.some((event) => event.at > windowStart)).length;
}

export class MockArrivalsService implements IArrivalsService {
  arrivals(projectId: string, range: DateRange, since: Date): Promise<ArrivalsReport> {
    const now = new Date();
    const project = demoProjectOf(projectId);
    const after = boundedSince(since, now.getTime());
    const scope = recentPartOf(range, todayIn(project.timezone, now));
    const visits = scope.from > scope.to ? [] : demoVisitsIn(project, demoScopeOf(scope, now));
    const events = eventsOf(visits);
    const conversionEvent = project.conversionEvent;
    return Promise.resolve({
      asOf: Math.floor(now.getTime() / SECOND_MS) * SECOND_MS,
      activeVisits: activeVisitsOf(project, now),
      visits: newestFirst(entryTimes(visits, after)),
      conversions:
        conversionEvent === null
          ? null
          : newestFirst(timesWhere(events, after, (event) => event.name === conversionEvent)),
      namedEvents: newestFirst(timesWhere(events, after, isNamedEvent)),
      failedRequests: newestFirst(timesWhere(events, after, hasFailed)),
    });
  }
}
