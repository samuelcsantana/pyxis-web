'use client';

import { useParams } from 'next/navigation';
import { FIRST_SCREEN, screenHref } from '@/components/shell/screens';
import { NotFoundPanel } from './not-found-panel';

export function ProjectNotFoundPanel() {
  const { projectId } = useParams<{ projectId: string }>();
  return (
    <NotFoundPanel
      explanation="There is nothing at this address in this project."
      href={screenHref(projectId, FIRST_SCREEN)}
      linkLabel="Open the Overview"
    />
  );
}
