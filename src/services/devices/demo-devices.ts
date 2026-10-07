import { type DevicesReport, type DevicesWire } from '@/domain/devices';
import { devicesResponseSchema } from '@/domain/devices.schema';
import type { DateRange } from '../date-range';
import { demoConversionsTotal, demoShareCounts, demoVisitsTotal } from '../demo/demo-dataset';
import { demoProjectOf } from '../demo/demo-projects';
import { demoConvertingVisitsOrNull } from '../demo/demo-series';

export function demoDevicesWire(projectId: string, range: DateRange): DevicesWire {
  const project = demoProjectOf(projectId);
  const visits = demoVisitsTotal(project, range);
  const conversions = demoConversionsTotal(project, range);
  const shares = (values: Parameters<typeof demoShareCounts>[2]) =>
    demoShareCounts(visits, conversions, values).map((share) => ({
      ...share,
      converting_visits: demoConvertingVisitsOrNull(share.conversions),
    }));
  return {
    device_types: shares(project.deviceTypes),
    browsers: shares(project.browsers),
    operating_systems: shares(project.operatingSystems),
    countries: shares(project.countries),
  };
}

export function demoDevicesReport(projectId: string, range: DateRange): DevicesReport {
  return devicesResponseSchema.parse(demoDevicesWire(projectId, range));
}
