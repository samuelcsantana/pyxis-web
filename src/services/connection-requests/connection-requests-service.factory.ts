import { apiBaseUrl } from '@/lib/api-config';
import { createApiReader } from '../api-reader.factory';
import { createApiWriter } from '../api-writer.factory';
import type { IConnectionRequestsService } from './connection-requests-service.interface';
import { HttpConnectionRequestsService } from './http-connection-requests-service';
import { MockConnectionRequestsService } from './mock-connection-requests-service';

export function createConnectionRequestsService(): IConnectionRequestsService {
  const baseUrl = apiBaseUrl();
  return baseUrl === undefined
    ? new MockConnectionRequestsService()
    : new HttpConnectionRequestsService(createApiReader(baseUrl), createApiWriter(baseUrl));
}
