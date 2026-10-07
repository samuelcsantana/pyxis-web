import { type Admin } from '@/domain/admin';
import { meResponseSchema } from '@/domain/admin.schema';
import { DEMO_PROJECTS } from '../demo/demo-projects';
import type { IProjectsService } from './projects-service.interface';

export const DEMO_FIRST_EVENT_AT = '2025-01-06T09:00:00.000Z';

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
}
