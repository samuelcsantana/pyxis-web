import { apiBaseUrl } from '@/lib/api-config';
import { createApiReader } from '../api-reader.factory';
import type { IFeaturesService } from './features-service.interface';
import { HttpFeaturesService } from './http-features-service';
import { MockFeaturesService } from './mock-features-service';

export function createFeaturesService(): IFeaturesService {
  const baseUrl = apiBaseUrl();
  return baseUrl === undefined
    ? new MockFeaturesService()
    : new HttpFeaturesService(createApiReader(baseUrl));
}
