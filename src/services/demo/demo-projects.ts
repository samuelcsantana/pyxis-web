import type { DemoProject } from './demo-catalog';
import { DEMO_DOCS } from './demo-docs';
import { DEMO_STORE } from './demo-store';

export const DEMO_PROJECTS: readonly DemoProject[] = [DEMO_STORE, DEMO_DOCS];

export function demoProjectOf(projectId: string): DemoProject {
  return DEMO_PROJECTS.find((project) => project.id === projectId) ?? DEMO_STORE;
}

export function demoPersonOf(projectId: string): string | null {
  return demoProjectOf(projectId).person;
}

export { DEMO_DOCS, DEMO_STORE };
