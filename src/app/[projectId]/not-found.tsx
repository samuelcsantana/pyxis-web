import type { Metadata } from 'next';
import { MainContent } from '@/components/shell/main-content';
import { NOT_FOUND_TITLE } from '@/components/states/not-found-panel';
import { ProjectNotFoundPanel } from '@/components/states/project-not-found-panel';

export const metadata: Metadata = { title: NOT_FOUND_TITLE };

export default function ProjectNotFound() {
  return (
    <MainContent className="flex w-full max-w-310 flex-col gap-6 p-4 sm:p-8">
      <ProjectNotFoundPanel />
    </MainContent>
  );
}
