import type { DevicesReport } from '@/domain/devices';
import type { ReportScope } from '../date-range';

export interface IDevicesService {
  devices(projectId: string, scope: ReportScope): Promise<DevicesReport>;
}
