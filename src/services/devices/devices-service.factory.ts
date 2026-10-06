import { apiBaseUrl } from '@/lib/api-config';
import { createApiReader } from '../api-reader.factory';
import type { IDevicesService } from './devices-service.interface';
import { HttpDevicesService } from './http-devices-service';
import { MockDevicesService } from './mock-devices-service';

export function createDevicesService(): IDevicesService {
  const baseUrl = apiBaseUrl();
  return baseUrl === undefined
    ? new MockDevicesService()
    : new HttpDevicesService(createApiReader(baseUrl));
}
