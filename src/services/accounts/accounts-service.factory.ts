import { apiBaseUrl } from '@/lib/api-config';
import { createApiReader } from '../api-reader.factory';
import { createApiWriter } from '../api-writer.factory';
import type { IAccountsService } from './accounts-service.interface';
import { HttpAccountsService } from './http-accounts-service';
import { MockAccountsService } from './mock-accounts-service';

export function createAccountsService(): IAccountsService {
  const baseUrl = apiBaseUrl();
  return baseUrl === undefined
    ? new MockAccountsService()
    : new HttpAccountsService(createApiReader(baseUrl), createApiWriter(baseUrl));
}
