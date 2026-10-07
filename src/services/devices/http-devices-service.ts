import { type DevicesReport } from '@/domain/devices';
import { devicesResponseSchema } from '@/domain/devices.schema';
import type { ApiReader } from '../api-reader';
import { type DateRange, rangeQuery } from '../date-range';
import type { IDevicesService } from './devices-service.interface';

export class HttpDevicesService implements IDevicesService {
  constructor(private readonly api: ApiReader) {}

  devices(projectId: string, range: DateRange): Promise<DevicesReport> {
    return this.api.get(
      `/v1/projects/${encodeURIComponent(projectId)}/devices?${rangeQuery(range)}`,
      devicesResponseSchema,
    );
  }
}
