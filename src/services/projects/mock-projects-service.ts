import { type Admin, meResponseSchema } from '@/domain/admin';
import { DEMO_PROJECTS } from '../demo/demo-projects';
import type { IProjectsService } from './projects-service.interface';

export const DEMO_ME_RESPONSE = {
  email: 'owner@demo-store.example',
  projects: DEMO_PROJECTS.map((project) => ({
    id: project.id,
    name: project.name,
    timezone: project.timezone,
    conversion_event: project.conversionEvent,
  })),
};

export const DEMO_ADMIN: Admin = meResponseSchema.parse(DEMO_ME_RESPONSE);

export class MockProjectsService implements IProjectsService {
  currentAdmin(): Promise<Admin> {
    return Promise.resolve(DEMO_ADMIN);
  }
}
