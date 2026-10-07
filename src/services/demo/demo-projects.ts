import { DEMO_ADMIN } from '../projects/mock-projects-service';

export function demoCountsConversions(projectId: string): boolean {
  const project = DEMO_ADMIN.projects.find((candidate) => candidate.id === projectId);
  return project?.conversionEvent !== null;
}

const UNKNOWN_PROJECT_TIME_ZONE = 'UTC';

export function demoTimeZone(projectId: string): string {
  const project = DEMO_ADMIN.projects.find((candidate) => candidate.id === projectId);
  return project?.timezone ?? UNKNOWN_PROJECT_TIME_ZONE;
}
