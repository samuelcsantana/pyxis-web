import { HOURS_IN_A_DAY, WEEKDAYS } from '@/domain/time-of-day';
import type { DateRange } from '../date-range';
import { demoProjectOf } from '../demo/demo-projects';
import type { DemoEventRecord } from '../demo/demo-records';
import { demoScopeOf, demoVisitsIn, isPageView } from '../demo/demo-scope';

const SUNDAY_FROM_DATE = 0;
const HOUR_DIGITS = 2;

function isoWeekday(date: string): number {
  const day = new Date(`${date}T00:00:00.000Z`).getUTCDay();
  return day === SUNDAY_FROM_DATE ? WEEKDAYS : day;
}

function startKey(event: DemoEventRecord): string {
  return `${String(isoWeekday(event.date))}:${String(Number(event.time.slice(0, HOUR_DIGITS)))}`;
}

export function demoTimeOfDayWire(projectId: string, range: DateRange, now: Date) {
  const visits = demoVisitsIn(demoProjectOf(projectId), demoScopeOf(range, now));
  const starts = visits.flatMap((visit) =>
    visit.events
      .filter(isPageView)
      .toSorted((left, right) => left.at - right.at)
      .slice(0, 1)
      .map(startKey),
  );
  const counts = starts.reduce(
    (tally, key) => tally.set(key, (tally.get(key) ?? 0) + 1),
    new Map<string, number>(),
  );
  return {
    weekdays: Array.from({ length: WEEKDAYS }, (_, index) => ({
      weekday: index + 1,
      hours: Array.from(
        { length: HOURS_IN_A_DAY },
        (_, hour) => counts.get(`${String(index + 1)}:${String(hour)}`) ?? 0,
      ),
    })),
  };
}
