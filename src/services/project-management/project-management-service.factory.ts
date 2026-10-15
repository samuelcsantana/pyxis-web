import { apiBaseUrl } from '@/lib/api-config';
import { createApiWriter } from '../api-writer.factory';
import { HttpProjectManagementService } from './http-project-management-service';
import { MockProjectManagementService } from './mock-project-management-service';
import type { IProjectManagementService } from './project-management-service.interface';

export function createProjectManagementService(): IProjectManagementService {
  const baseUrl = apiBaseUrl();
  return baseUrl === undefined
    ? new MockProjectManagementService()
    : new HttpProjectManagementService(createApiWriter(baseUrl));
}
