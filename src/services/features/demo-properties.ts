import {
  type PropertyBreakdownReport,
  type PropertyBreakdownWire,
} from '@/domain/property-breakdown';
import { propertyBreakdownResponseSchema } from '@/domain/property-breakdown.schema';
import type { DateRange } from '../date-range';
import { demoProjectOf } from '../demo/demo-projects';
import {
  byKeys,
  demoScopeOf,
  demoVisitsIn,
  distinctCount,
  groupedBy,
  isNamedEvent,
} from '../demo/demo-scope';

export const VALUES_PER_KEY = 10;

interface Carried {
  readonly key: string;
  readonly value: string;
  readonly session: string;
}

function valuesOf(key: string, carried: readonly Carried[]) {
  const values = [...groupedBy(carried, (entry) => entry.value)]
    .map(([value, group]) => ({
      value,
      count: group.length,
      visits: distinctCount(group.map((entry) => entry.session)),
    }))
    .toSorted(byKeys((value) => [-value.count, value.value]));
  const shown = values.slice(0, VALUES_PER_KEY);
  return {
    key,
    events: carried.length,
    values: shown,
    other_count: carried.length - shown.reduce((total, value) => total + value.count, 0),
  };
}

export function demoPropertyBreakdownWire(
  projectId: string,
  range: DateRange,
  name: string,
  now: Date,
): PropertyBreakdownWire {
  const visits = demoVisitsIn(demoProjectOf(projectId), demoScopeOf(range, now));
  const events = visits.flatMap((visit) =>
    visit.events
      .filter((event) => isNamedEvent(event) && event.name === name)
      .map((event) => ({ event, session: visit.sessionId })),
  );
  const carried = events.flatMap(({ event, session }) =>
    Object.entries(event.properties).map(([key, value]) => ({
      key,
      value: String(value),
      session,
    })),
  );
  return {
    name,
    events: events.length,
    keys: [...groupedBy(carried, (entry) => entry.key)]
      .map(([key, group]) => valuesOf(key, group))
      .toSorted(byKeys((key) => [-key.events, key.key])),
  };
}

export function demoPropertyBreakdownReport(
  projectId: string,
  range: DateRange,
  name: string,
  now: Date,
): PropertyBreakdownReport {
  return propertyBreakdownResponseSchema.parse(
    demoPropertyBreakdownWire(projectId, range, name, now),
  );
}
