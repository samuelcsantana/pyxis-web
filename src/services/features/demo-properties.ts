import {
  type PropertyBreakdownReport,
  type PropertyBreakdownWire,
} from '@/domain/property-breakdown';
import { propertyBreakdownResponseSchema } from '@/domain/property-breakdown.schema';
import type { DateRange } from '../date-range';
import type { DemoProperty } from '../demo/demo-catalog';
import { demoEventCountIn } from '../demo/demo-dataset';
import { demoProjectOf } from '../demo/demo-projects';
import { apportion } from '../demo/demo-series';

const VALUES_PER_KEY = 10;

function keyWire(property: DemoProperty, events: number, visitsPerCount: number) {
  const carried = Math.round(events * property.carriedShare);
  const values = apportion(carried, property.values, ([, share]) => share)
    .filter((entry) => entry.count > 0)
    .map(({ item: [value], count }) => ({
      value,
      count,
      visits: Math.min(count, Math.max(1, Math.round(count * visitsPerCount))),
    }))
    .toSorted((a, b) => b.count - a.count || a.value.localeCompare(b.value));
  const shown = values.slice(0, VALUES_PER_KEY);
  const otherCount = carried - shown.reduce((sum, value) => sum + value.count, 0);
  return { key: property.key, events: carried, values: shown, other_count: otherCount };
}

export function demoPropertyBreakdownWire(
  projectId: string,
  range: DateRange,
  name: string,
): PropertyBreakdownWire {
  const project = demoProjectOf(projectId);
  const event = project.events.find((candidate) => candidate.name === name);
  if (event === undefined) {
    return { name, events: 0, keys: [] };
  }
  const count = demoEventCountIn(project, event, range);
  return {
    name,
    events: count,
    keys: event.properties
      .map((property) => keyWire(property, count, event.visitsPerCount))
      .filter((key) => key.events > 0)
      .toSorted((a, b) => b.events - a.events || a.key.localeCompare(b.key)),
  };
}

export function demoPropertyBreakdownReport(
  projectId: string,
  range: DateRange,
  name: string,
): PropertyBreakdownReport {
  return propertyBreakdownResponseSchema.parse(demoPropertyBreakdownWire(projectId, range, name));
}
