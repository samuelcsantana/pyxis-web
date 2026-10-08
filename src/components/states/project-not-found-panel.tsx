'use client';

import { useParams } from 'next/navigation';
import { FIRST_SCREEN, screenHref } from '@/components/shell/screens';
import { useT } from '@/i18n/messages-provider';
import { NotFoundPanel } from './not-found-panel';

export function ProjectNotFoundPanel() {
  const t = useT();
  const { projectId } = useParams<{ projectId: string }>();
  return (
    <NotFoundPanel
      title={t('notFound.title')}
      explanation={t('notFound.inProject')}
      href={screenHref(projectId, FIRST_SCREEN)}
      linkLabel={t('notFound.toOverview')}
    />
  );
}
