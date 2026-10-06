import { DEMO_ADMIN } from '../projects/mock-projects-service';

export function demoCountsConversions(projectId: string): boolean {
  const project = DEMO_ADMIN.projects.find((candidate) => candidate.id === projectId);
  return project?.conversionEvent !== null;
}
