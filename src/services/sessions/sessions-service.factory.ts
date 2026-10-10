import { apiBaseUrl } from '@/lib/api-config';
import { createApiReader } from '../api-reader.factory';
import { createApiWriter } from '../api-writer.factory';
import { HttpSessionsService } from './http-sessions-service';
import { MockSessionsService } from './mock-sessions-service';
import type { ISessionsService } from './sessions-service.interface';

export function createSessionsService(): ISessionsService {
  const baseUrl = apiBaseUrl();
  return baseUrl === undefined
    ? new MockSessionsService()
    : new HttpSessionsService(createApiReader(baseUrl), createApiWriter(baseUrl));
}
