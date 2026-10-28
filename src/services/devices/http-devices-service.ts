import { type DevicesReport } from '@/domain/devices';
import { devicesResponseSchema } from '@/domain/devices.schema';
import type { ApiReader } from '../api-reader';
import { type ReportScope, reportQuery } from '../date-range';
import type { IDevicesService } from './devices-service.interface';

export class HttpDevicesService implements IDevicesService {
  constructor(private readonly api: ApiReader) {}

  devices(projectId: string, scope: ReportScope): Promise<DevicesReport> {
    return this.api.get(
      `/v1/projects/${encodeURIComponent(projectId)}/devices?${reportQuery(scope)}`,
      devicesResponseSchema,
    );
  }
}
