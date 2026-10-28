import type { Metadata } from 'next';
import { MainContent } from '@/components/shell/main-content';
import { ProjectNotFoundPanel } from '@/components/states/project-not-found-panel';
import { getTranslator } from '@/i18n/get-messages';
import { brandedTitle } from '@/lib/site';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslator();
  return { title: { absolute: brandedTitle(t('notFound.title')) } };
}

export default function ProjectNotFound() {
  return (
    <MainContent className="flex w-full max-w-310 flex-col gap-6 p-4 sm:p-8">
      <ProjectNotFoundPanel />
    </MainContent>
  );
}
