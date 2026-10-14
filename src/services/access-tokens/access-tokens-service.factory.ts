import { apiBaseUrl } from '@/lib/api-config';
import { createApiReader } from '../api-reader.factory';
import { createApiWriter } from '../api-writer.factory';
import type { IAccessTokensService } from './access-tokens-service.interface';
import { HttpAccessTokensService } from './http-access-tokens-service';
import { MockAccessTokensService } from './mock-access-tokens-service';

export function createAccessTokensService(): IAccessTokensService {
  const baseUrl = apiBaseUrl();
  return baseUrl === undefined
    ? new MockAccessTokensService()
    : new HttpAccessTokensService(createApiReader(baseUrl), createApiWriter(baseUrl));
}
