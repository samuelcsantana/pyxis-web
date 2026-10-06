import type { Admin } from '@/domain/admin';
import type { IProjectsService } from './projects-service.interface';

export const DEMO_ADMIN: Admin = {
  email: 'owner@demo-store.example',
  projects: [
    {
      id: '6f1d3c2a-8b4e-4f7a-9c1d-2e3f4a5b6c7d',
      name: 'Demo Store',
      timezone: 'America/Sao_Paulo',
      conversionEvent: 'signup_completed',
    },
    {
      id: '0c9b8a7d-6e5f-4a3b-8c2d-1e0f9a8b7c6d',
      name: 'Demo Docs',
      timezone: 'Europe/Lisbon',
      conversionEvent: null,
    },
  ],
};

export class MockProjectsService implements IProjectsService {
  currentAdmin(): Promise<Admin> {
    return Promise.resolve(DEMO_ADMIN);
  }
}
