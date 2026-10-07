'use client';

import { ErrorPanel } from '@/components/states/error-panel';

export interface ProjectErrorProps {
  readonly error: Error & { readonly digest?: string };
  readonly retry: () => void;
}

export default function ProjectError({ error, retry }: ProjectErrorProps) {
  return (
    <main className="flex flex-col gap-6 p-4 sm:p-8">
      <ErrorPanel
        headingLevel="h1"
        detail={error.digest === undefined ? undefined : `error id ${error.digest}`}
        onRetry={retry}
      />
    </main>
  );
}
