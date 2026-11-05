import { apiBaseUrl } from '@/lib/api-config';
import { createApiReader } from '../api-reader.factory';
import { createApiWriter } from '../api-writer.factory';
import { HttpShareLinksService } from './http-share-links-service';
import { MockShareLinksService } from './mock-share-links-service';
import type { IShareLinksService } from './share-links-service.interface';

export function createShareLinksService(): IShareLinksService {
  const baseUrl = apiBaseUrl();
  return baseUrl === undefined
    ? new MockShareLinksService()
    : new HttpShareLinksService(createApiReader(baseUrl), createApiWriter(baseUrl));
}
