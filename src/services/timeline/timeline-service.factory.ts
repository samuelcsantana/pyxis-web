import { apiBaseUrl } from '@/lib/api-config';
import { createApiReader } from '../api-reader.factory';
import { HttpTimelineService } from './http-timeline-service';
import { MockTimelineService } from './mock-timeline-service';
import type { ITimelineService } from './timeline-service.interface';

export function createTimelineService(): ITimelineService {
  const baseUrl = apiBaseUrl();
  return baseUrl === undefined
    ? new MockTimelineService()
    : new HttpTimelineService(createApiReader(baseUrl));
}
