import type { DevicesReport } from '@/domain/devices';
import type { DateRange } from '../date-range';

export interface IDevicesService {
  devices(projectId: string, range: DateRange): Promise<DevicesReport>;
}
