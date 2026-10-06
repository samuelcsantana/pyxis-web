import { apiBaseUrl } from '@/lib/api-config';
import { createApiReader } from '../api-reader.factory';
import { HttpRequestsService } from './http-requests-service';
import { MockRequestsService } from './mock-requests-service';
import type { IRequestsService } from './requests-service.interface';

export function createRequestsService(): IRequestsService {
  const baseUrl = apiBaseUrl();
  return baseUrl === undefined
    ? new MockRequestsService()
    : new HttpRequestsService(createApiReader(baseUrl));
}
