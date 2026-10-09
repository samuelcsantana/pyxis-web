import { type Admin } from '@/domain/admin';
import { meResponseSchema } from '@/domain/admin.schema';
import type { ProjectSettings } from '@/domain/project-settings';
import { projectSettingsResponseSchema } from '@/domain/project-settings.schema';
import { DEMO_PROJECTS } from '../demo/demo-projects';
import { DEMO_FIRST_EVENT_AT, demoProjectSettingsWire } from './demo-project-settings';
import type { IProjectsService } from './projects-service.interface';

export const DEMO_ME_RESPONSE = {
  email: 'owner@demo-store.example',
  projects: DEMO_PROJECTS.map((project) => ({
    id: project.id,
    name: project.name,
    timezone: project.timezone,
    conversion_event: project.conversionEvent,
    first_event_at: DEMO_FIRST_EVENT_AT,
    last_event_at: new Date().toISOString(),
  })),
};

export const DEMO_ADMIN: Admin = meResponseSchema.parse(DEMO_ME_RESPONSE);

export class MockProjectsService implements IProjectsService {
  currentAdmin(): Promise<Admin> {
    return Promise.resolve(DEMO_ADMIN);
  }

  settings(projectId: string): Promise<ProjectSettings> {
    return Promise.resolve(
      projectSettingsResponseSchema.parse(demoProjectSettingsWire(projectId, new Date())),
    );
  }
}
