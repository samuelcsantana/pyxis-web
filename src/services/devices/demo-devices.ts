import { type DevicesReport, type DevicesWire, OTHER_VALUE } from '@/domain/devices';
import { devicesResponseSchema } from '@/domain/devices.schema';
import type { DateRange } from '../date-range';
import { demoProjectOf } from '../demo/demo-projects';
import type { DemoVisitRecord } from '../demo/demo-records';
import {
  byKeys,
  countWhere,
  demoScopeOf,
  demoVisitsIn,
  groupedBy,
  hasPageView,
} from '../demo/demo-scope';

export const TOP_DEVICE_VALUES = 5;

type ShareWire = DevicesWire['device_types'][number];

interface ValueCount {
  readonly value: string;
  readonly visits: number;
  readonly conversions: number;
  readonly convertingVisits: number;
}

function counted(
  value: string,
  visits: readonly DemoVisitRecord[],
  conversionEvent: string | null,
): ValueCount {
  const converts = (visit: DemoVisitRecord) =>
    countWhere(visit.events, (event) => event.name === conversionEvent);
  return {
    value,
    visits: countWhere(visits, hasPageView),
    conversions: visits.reduce((total, visit) => total + converts(visit), 0),
    convertingVisits: countWhere(visits, (visit) => converts(visit) > 0),
  };
}

function summed(value: string, counts: readonly ValueCount[]): ValueCount {
  return counts.reduce(
    (total, count) => ({
      value,
      visits: total.visits + count.visits,
      conversions: total.conversions + count.conversions,
      convertingVisits: total.convertingVisits + count.convertingVisits,
    }),
    { value, visits: 0, conversions: 0, convertingVisits: 0 },
  );
}

function shares(
  visits: readonly DemoVisitRecord[],
  valueOf: (visit: DemoVisitRecord) => string,
  conversionEvent: string | null,
): ShareWire[] {
  const ranked = [...groupedBy(visits, valueOf)]
    .map(([value, group]) => counted(value, group, conversionEvent))
    .toSorted(byKeys((count) => [-count.visits, count.value]));
  const rest = ranked.slice(TOP_DEVICE_VALUES);
  const shown =
    rest.length === 0 ? ranked : [...ranked.slice(0, TOP_DEVICE_VALUES), summed(OTHER_VALUE, rest)];
  const counts = conversionEvent !== null;
  return shown.map((share) => ({
    value: share.value,
    visits: share.visits,
    conversions: counts ? share.conversions : null,
    converting_visits: counts ? share.convertingVisits : null,
  }));
}

export function demoDevicesWire(projectId: string, range: DateRange, now: Date): DevicesWire {
  const project = demoProjectOf(projectId);
  const visits = demoVisitsIn(project, demoScopeOf(range, now));
  const of = (valueOf: (visit: DemoVisitRecord) => string) =>
    shares(visits, valueOf, project.conversionEvent);
  return {
    device_types: of((visit) => visit.deviceType),
    browsers: of((visit) => visit.browser),
    operating_systems: of((visit) => visit.os),
    countries: of((visit) => visit.country),
  };
}

export function demoDevicesReport(projectId: string, range: DateRange, now: Date): DevicesReport {
  return devicesResponseSchema.parse(demoDevicesWire(projectId, range, now));
}
