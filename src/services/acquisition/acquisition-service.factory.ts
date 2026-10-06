import { apiBaseUrl } from '@/lib/api-config';
import { createApiReader } from '../api-reader.factory';
import type { IAcquisitionService } from './acquisition-service.interface';
import { HttpAcquisitionService } from './http-acquisition-service';
import { MockAcquisitionService } from './mock-acquisition-service';

export function createAcquisitionService(): IAcquisitionService {
  const baseUrl = apiBaseUrl();
  return baseUrl === undefined
    ? new MockAcquisitionService()
    : new HttpAcquisitionService(createApiReader(baseUrl));
}
