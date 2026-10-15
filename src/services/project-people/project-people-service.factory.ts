import { apiBaseUrl } from '@/lib/api-config';
import { createApiReader } from '../api-reader.factory';
import { createApiWriter } from '../api-writer.factory';
import { HttpProjectPeopleService } from './http-project-people-service';
import { MockProjectPeopleService } from './mock-project-people-service';
import type { IProjectPeopleService } from './project-people-service.interface';

export function createProjectPeopleService(): IProjectPeopleService {
  const baseUrl = apiBaseUrl();
  return baseUrl === undefined
    ? new MockProjectPeopleService()
    : new HttpProjectPeopleService(createApiReader(baseUrl), createApiWriter(baseUrl));
}
