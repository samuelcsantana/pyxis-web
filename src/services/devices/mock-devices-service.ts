import type { DevicesReport } from '@/domain/devices';
import type { DateRange } from '../date-range';
import { demoDevicesReport } from './demo-devices';
import type { IDevicesService } from './devices-service.interface';

export class MockDevicesService implements IDevicesService {
  devices(projectId: string, range: DateRange): Promise<DevicesReport> {
    return Promise.resolve(demoDevicesReport(projectId, range, new Date()));
  }
}
