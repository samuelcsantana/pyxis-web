import { type Admin, type ProjectIcon } from '@/domain/admin';
import { meResponseSchema } from '@/domain/admin.schema';
import type { ProjectSettings } from '@/domain/project-settings';
import { projectSettingsResponseSchema } from '@/domain/project-settings.schema';
import { DEMO_PROJECTS } from '../demo/demo-projects';
import { DEMO_FIRST_EVENT_AT, demoProjectSettingsWire } from './demo-project-settings';
import type { IProjectsService } from './projects-service.interface';

export const DEMO_ME_RESPONSE = {
  email: 'owner@example.com',
  projects: DEMO_PROJECTS.map((project) => ({
    id: project.id,
    name: project.name,
    timezone: project.timezone,
    conversion_event: project.conversionEvent,
    first_event_at: DEMO_FIRST_EVENT_AT,
    last_event_at: new Date().toISOString(),
    icon_version: null,
    ingestion_suspended_at: null,
    ingestion_suspension_reason: null,
  })),
};

export const DEMO_ADMIN: Admin = meResponseSchema.parse(DEMO_ME_RESPONSE);

export class MockProjectsService implements IProjectsService {
  currentAdmin(): Promise<Admin> {
    return Promise.resolve(DEMO_ADMIN);
  }

  icon(): Promise<ProjectIcon | null> {
    return Promise.resolve(null);
  }

  settings(projectId: string): Promise<ProjectSettings> {
    return Promise.resolve(
      projectSettingsResponseSchema.parse(demoProjectSettingsWire(projectId, new Date())),
    );
  }
}
