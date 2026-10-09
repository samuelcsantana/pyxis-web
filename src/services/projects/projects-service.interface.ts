import type { Admin } from '@/domain/admin';
import type { ProjectSettings } from '@/domain/project-settings';

export interface IProjectsService {
  currentAdmin(): Promise<Admin>;
  settings(projectId: string): Promise<ProjectSettings>;
}
