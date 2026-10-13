import type { MetadataRoute } from 'next';
import { SCREENS, screenHref, settingsHref } from '@/components/shell/screens';
import { isDemoMode } from '@/lib/api-config';
import { liveDemoUrlOf } from '@/lib/demo-canonical';
import { createProjectsService } from '@/services/projects/projects-service.factory';

function pagesOf(projectId: string): readonly string[] {
  return [...SCREENS.map((screen) => screenHref(projectId, screen.slug)), settingsHref(projectId)];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!isDemoMode()) {
    return [];
  }
  const { projects } = await createProjectsService().currentAdmin();
  return projects
    .flatMap((project) => pagesOf(project.id))
    .map((path) => ({ url: liveDemoUrlOf(path) }));
}
