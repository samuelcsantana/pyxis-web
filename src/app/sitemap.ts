import type { MetadataRoute } from 'next';
import { SCREENS, screenHref, settingsHref } from '@/components/shell/screens';
import { isDemoMode } from '@/lib/api-config';
import { liveDemoUrlOf } from '@/lib/demo-canonical';
import { LANDING_PAGES, landingUrlOf, languageAlternatesOf } from '@/lib/landing-pages';
import { legalConfig } from '@/lib/legal-config';
import { LEGAL_DOCUMENTS, legalUrlOf } from '@/lib/legal-documents';
import { isOnLandingHost } from '@/lib/request-host';
import { createProjectsService } from '@/services/projects/projects-service.factory';

function pagesOf(projectId: string): readonly string[] {
  return [...SCREENS.map((screen) => screenHref(projectId, screen.slug)), settingsHref(projectId)];
}

function landingSitemap(): MetadataRoute.Sitemap {
  const languages = languageAlternatesOf(landingUrlOf);
  const homePages = LANDING_PAGES.map((page) => ({
    url: landingUrlOf(page),
    alternates: { languages },
  }));
  const legalPages =
    legalConfig() === null
      ? []
      : LEGAL_DOCUMENTS.map((document) => ({ url: legalUrlOf(document) }));
  return [...homePages, ...legalPages];
}

async function demoSitemap(): Promise<MetadataRoute.Sitemap> {
  const { projects } = await createProjectsService().currentAdmin();
  return projects
    .flatMap((project) => pagesOf(project.id))
    .map((path) => ({ url: liveDemoUrlOf(path) }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!isDemoMode()) {
    return [];
  }
  return (await isOnLandingHost()) ? landingSitemap() : demoSitemap();
}
