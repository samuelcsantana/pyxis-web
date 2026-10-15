import { apiBaseUrl } from '@/lib/api-config';
import { createApiReader } from '../api-reader.factory';
import { createApiWriter } from '../api-writer.factory';
import type { IExportsService } from './exports-service.interface';
import { HttpExportsService } from './http-exports-service';
import { MockExportsService } from './mock-exports-service';

export function createExportsService(): IExportsService {
  const baseUrl = apiBaseUrl();
  return baseUrl === undefined
    ? new MockExportsService()
    : new HttpExportsService(createApiReader(baseUrl), createApiWriter(baseUrl));
}
