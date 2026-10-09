import { apiBaseUrl } from '@/lib/api-config';
import { createApiReader } from '../api-reader.factory';
import { createApiWriter } from '../api-writer.factory';
import type { IEmailPreferencesService } from './email-preferences-service.interface';
import { HttpEmailPreferencesService } from './http-email-preferences-service';
import { MockEmailPreferencesService } from './mock-email-preferences-service';

export function createEmailPreferencesService(): IEmailPreferencesService {
  const baseUrl = apiBaseUrl();
  return baseUrl === undefined
    ? new MockEmailPreferencesService()
    : new HttpEmailPreferencesService(createApiReader(baseUrl), createApiWriter(baseUrl));
}
