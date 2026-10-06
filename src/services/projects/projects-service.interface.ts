import type { Admin } from '@/domain/admin';

export interface IProjectsService {
  currentAdmin(): Promise<Admin>;
}
