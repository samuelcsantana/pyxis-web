import { cookies } from 'next/headers';
import { apiBaseUrl, SESSION_COOKIE_NAME } from '@/lib/api-config';
import { HttpProjectsService } from './http-projects-service';
import { MockProjectsService } from './mock-projects-service';
import type { IProjectsService } from './projects-service.interface';

async function sessionToken(): Promise<string | undefined> {
  return (await cookies()).get(SESSION_COOKIE_NAME)?.value;
}

export function createProjectsService(): IProjectsService {
  const baseUrl = apiBaseUrl();
  return baseUrl === undefined
    ? new MockProjectsService()
    : new HttpProjectsService(baseUrl, sessionToken);
}
