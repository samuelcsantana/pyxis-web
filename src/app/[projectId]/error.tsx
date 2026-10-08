'use client';

import { MainContent } from '@/components/shell/main-content';
import { ErrorPanel } from '@/components/states/error-panel';
import { type ErrorBoundaryProps, errorTexts } from '@/components/states/error-screen';
import { useT } from '@/i18n/messages-provider';

export default function ProjectError({ error, retry }: ErrorBoundaryProps) {
  const t = useT();
  return (
    <MainContent className="flex flex-col gap-6 p-4 sm:p-8">
      <ErrorPanel headingLevel="h1" texts={errorTexts(error, t)} onRetry={retry} />
    </MainContent>
  );
}
