import { apiBaseUrl } from '@/lib/api-config';
import { createApiReader } from '../api-reader.factory';
import { HttpOverviewService } from './http-overview-service';
import { MockOverviewService } from './mock-overview-service';
import type { IOverviewService } from './overview-service.interface';

export function createOverviewService(): IOverviewService {
  const baseUrl = apiBaseUrl();
  return baseUrl === undefined
    ? new MockOverviewService()
    : new HttpOverviewService(createApiReader(baseUrl));
}
