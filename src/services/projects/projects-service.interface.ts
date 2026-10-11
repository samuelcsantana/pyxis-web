import type { Admin, ProjectIcon } from '@/domain/admin';
import type { ProjectSettings } from '@/domain/project-settings';

export interface IProjectsService {
  currentAdmin(): Promise<Admin>;
  icon(projectId: string): Promise<ProjectIcon | null>;
  settings(projectId: string): Promise<ProjectSettings>;
}
