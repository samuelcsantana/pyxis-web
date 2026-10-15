import { apiBaseUrl } from '@/lib/api-config';
import { createApiReader } from '../api-reader.factory';
import { createApiWriter } from '../api-writer.factory';
import type { IConnectionsService } from './connections-service.interface';
import { HttpConnectionsService } from './http-connections-service';
import { MockConnectionsService } from './mock-connections-service';

export function createConnectionsService(): IConnectionsService {
  const baseUrl = apiBaseUrl();
  return baseUrl === undefined
    ? new MockConnectionsService()
    : new HttpConnectionsService(createApiReader(baseUrl), createApiWriter(baseUrl));
}
