import { type DevicesReport, devicesResponseSchema, type DevicesWire } from '@/domain/devices';
import type { DateRange } from '../date-range';
import { demoConversionsTotal, demoShareCounts, demoVisitsTotal } from '../demo/demo-dataset';
import { demoProjectOf } from '../demo/demo-projects';

export function demoDevicesWire(projectId: string, range: DateRange): DevicesWire {
  const project = demoProjectOf(projectId);
  const visits = demoVisitsTotal(project, range);
  const conversions = demoConversionsTotal(project, range);
  return {
    device_types: [...demoShareCounts(visits, conversions, project.deviceTypes)],
    browsers: [...demoShareCounts(visits, conversions, project.browsers)],
    operating_systems: [...demoShareCounts(visits, conversions, project.operatingSystems)],
    countries: [...demoShareCounts(visits, conversions, project.countries)],
  };
}

export function demoDevicesReport(projectId: string, range: DateRange): DevicesReport {
  return devicesResponseSchema.parse(demoDevicesWire(projectId, range));
}
