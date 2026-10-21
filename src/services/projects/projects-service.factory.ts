import { getTranslator } from '@/i18n/get-messages';
import { apiBaseUrl } from '@/lib/api-config';
import { createApiReader } from '../api-reader.factory';
import { HttpProjectsService } from './http-projects-service';
import { MockProjectsService } from './mock-projects-service';
import type { IProjectsService } from './projects-service.interface';

export function createProjectsService(): IProjectsService {
  const baseUrl = apiBaseUrl();
  return baseUrl === undefined
    ? new MockProjectsService(getTranslator)
    : new HttpProjectsService(createApiReader(baseUrl));
}
