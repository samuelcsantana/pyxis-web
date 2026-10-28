import {
  type PropertyBreakdownReport,
  type PropertyBreakdownWire,
} from '@/domain/property-breakdown';
import { propertyBreakdownResponseSchema } from '@/domain/property-breakdown.schema';
import type { PropertySummaryReport, PropertySummaryWire } from '@/domain/property-summary';
import { propertySummaryResponseSchema } from '@/domain/property-summary.schema';
import type { PropertySummaryRequest } from './features-service.interface';
import { demoProjectOf } from '../demo/demo-projects';
import {
  byKeys,
  demoScopeOf,
  demoVisitsIn,
  distinctCount,
  groupedBy,
  isNamedEvent,
  percentile,
  type DemoReportRange,
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
  range: DemoReportRange,
  name: string,
  now: Date,
): PropertyBreakdownWire {
  const visits = demoVisitsIn(demoProjectOf(projectId), demoScopeOf(range, now, range.filters));
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
  range: DemoReportRange,
  name: string,
  now: Date,
): PropertyBreakdownReport {
  return propertyBreakdownResponseSchema.parse(
    demoPropertyBreakdownWire(projectId, range, name, now),
  );
}

export const SUMMARY_GROUPS = 10;
const QUARTER = 0.25;
const HALF = 0.5;
const THREE_QUARTERS = 0.75;

function figuresOf(numbers: readonly number[]) {
  return {
    events: numbers.length,
    median: percentile(numbers, HALF),
    p25: percentile(numbers, QUARTER),
    p75: percentile(numbers, THREE_QUARTERS),
  };
}

function groupsOf(measured: readonly { readonly number: number; readonly by: string | null }[]) {
  const grouped = [
    ...groupedBy(
      measured.flatMap((entry) => (entry.by === null ? [] : [{ ...entry, by: entry.by }])),
      (entry) => entry.by,
    ),
  ]
    .map(([value, group]) => ({ value, ...figuresOf(group.map((entry) => entry.number)) }))
    .toSorted(byKeys((group) => [-group.events, group.value]));
  const shown = grouped.slice(0, SUMMARY_GROUPS);
  const groupedEvents = grouped.reduce((total, group) => total + group.events, 0);
  return {
    groups: shown,
    otherCount: groupedEvents - shown.reduce((total, group) => total + group.events, 0),
  };
}

export function demoPropertySummaryWire(
  projectId: string,
  range: DemoReportRange,
  request: PropertySummaryRequest,
  now: Date,
): PropertySummaryWire {
  const visits = demoVisitsIn(demoProjectOf(projectId), demoScopeOf(range, now, range.filters));
  const measured = visits.flatMap((visit) =>
    visit.events.flatMap((event) => {
      const value = event.properties[request.key];
      if (!isNamedEvent(event) || event.name !== request.name || typeof value !== 'number') {
        return [];
      }
      const by = request.by === null ? undefined : event.properties[request.by];
      return [{ number: value, by: by === undefined ? null : String(by) }];
    }),
  );
  const { groups, otherCount } =
    request.by === null ? { groups: [], otherCount: 0 } : groupsOf(measured);
  return {
    name: request.name,
    key: request.key,
    by: request.by,
    overall: figuresOf(measured.map((entry) => entry.number)),
    groups,
    other_count: otherCount,
  };
}

export function demoPropertySummaryReport(
  projectId: string,
  range: DemoReportRange,
  request: PropertySummaryRequest,
  now: Date,
): PropertySummaryReport {
  return propertySummaryResponseSchema.parse(
    demoPropertySummaryWire(projectId, range, request, now),
  );
}
