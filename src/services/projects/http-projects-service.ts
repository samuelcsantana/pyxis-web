import { type Admin, type ProjectIcon } from '@/domain/admin';
import { ApiNotFoundError } from '@/domain/errors';
import { meResponseSchema } from '@/domain/admin.schema';
import type { ProjectSettings } from '@/domain/project-settings';
import { projectSettingsResponseSchema } from '@/domain/project-settings.schema';
import type { ApiReader } from '../api-reader';
import type { IProjectsService } from './projects-service.interface';

export class HttpProjectsService implements IProjectsService {
  constructor(private readonly api: ApiReader) {}

  currentAdmin(): Promise<Admin> {
    return this.api.get('/v1/me', meResponseSchema);
  }

  async icon(projectId: string): Promise<ProjectIcon | null> {
    try {
      return await this.api.getBytes(`/v1/projects/${encodeURIComponent(projectId)}/icon`);
    } catch (error) {
      if (error instanceof ApiNotFoundError) {
        return null;
      }
      throw error;
    }
  }

  settings(projectId: string): Promise<ProjectSettings> {
    return this.api.get(
      `/v1/projects/${encodeURIComponent(projectId)}/settings`,
      projectSettingsResponseSchema,
    );
  }
}
