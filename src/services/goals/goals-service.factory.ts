import { apiBaseUrl } from '@/lib/api-config';
import { createApiReader } from '../api-reader.factory';
import { createApiWriter } from '../api-writer.factory';
import type { IGoalsService } from './goals-service.interface';
import { HttpGoalsService } from './http-goals-service';
import { MockGoalsService } from './mock-goals-service';

export function createGoalsService(): IGoalsService {
  const baseUrl = apiBaseUrl();
  return baseUrl === undefined
    ? new MockGoalsService()
    : new HttpGoalsService(createApiReader(baseUrl), createApiWriter(baseUrl));
}
