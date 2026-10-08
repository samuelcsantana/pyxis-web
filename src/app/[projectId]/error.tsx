'use client';

import { MainContent } from '@/components/shell/main-content';
import { ErrorPanel } from '@/components/states/error-panel';
import { type ErrorBoundaryProps, errorDetail } from '@/components/states/error-screen';

export default function ProjectError({ error, retry }: ErrorBoundaryProps) {
  return (
    <MainContent className="flex flex-col gap-6 p-4 sm:p-8">
      <ErrorPanel headingLevel="h1" detail={errorDetail(error)} onRetry={retry} />
    </MainContent>
  );
}
