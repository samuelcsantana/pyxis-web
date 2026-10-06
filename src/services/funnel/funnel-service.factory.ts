import { apiBaseUrl } from '@/lib/api-config';
import { createApiReader } from '../api-reader.factory';
import type { IFunnelService } from './funnel-service.interface';
import { HttpFunnelService } from './http-funnel-service';
import { MockFunnelService } from './mock-funnel-service';

export function createFunnelService(): IFunnelService {
  const baseUrl = apiBaseUrl();
  return baseUrl === undefined
    ? new MockFunnelService()
    : new HttpFunnelService(createApiReader(baseUrl));
}
