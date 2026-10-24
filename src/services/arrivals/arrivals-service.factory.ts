import { apiBaseUrl } from '@/lib/api-config';
import { createApiReader } from '../api-reader.factory';
import type { IArrivalsService } from './arrivals-service.interface';
import { HttpArrivalsService } from './http-arrivals-service';
import { MockArrivalsService } from './mock-arrivals-service';

export function createArrivalsService(): IArrivalsService {
  const baseUrl = apiBaseUrl();
  return baseUrl === undefined
    ? new MockArrivalsService()
    : new HttpArrivalsService(createApiReader(baseUrl));
}
