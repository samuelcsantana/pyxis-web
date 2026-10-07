import { apiBaseUrl } from '@/lib/api-config';
import { createApiReader } from '../api-reader.factory';
import { HttpVisitsService } from './http-visits-service';
import { MockVisitsService } from './mock-visits-service';
import type { IVisitsService } from './visits-service.interface';

export function createVisitsService(): IVisitsService {
  const baseUrl = apiBaseUrl();
  return baseUrl === undefined
    ? new MockVisitsService()
    : new HttpVisitsService(createApiReader(baseUrl));
}
