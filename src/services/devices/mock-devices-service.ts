import type { DevicesReport } from '@/domain/devices';
import type { ReportScope } from '../date-range';
import { demoDevicesReport } from './demo-devices';
import type { IDevicesService } from './devices-service.interface';

export class MockDevicesService implements IDevicesService {
  devices(projectId: string, scope: ReportScope): Promise<DevicesReport> {
    return Promise.resolve(demoDevicesReport(projectId, scope, new Date()));
  }
}
