import type { ReactNode } from 'react';
import { ContentPlaceholder } from '@/components/shell/content-placeholder';
import { ScreenTopbar } from '@/components/shell/screen-topbar';
import { screenTopbarTexts } from '@/components/shell/screen-topbar-texts';
import { getI18n } from '@/i18n/get-messages';
import { projectOrNotFound } from '@/lib/current-admin';

export interface ScreensLayoutProps {
  readonly children: ReactNode;
  readonly params: Promise<{ readonly projectId: string }>;
}

export default async function ScreensLayout({ children, params }: ScreensLayoutProps) {
  const { project } = await projectOrNotFound((await params).projectId);
  const serverNow = new Date().getTime();
  const i18n = await getI18n();
  return (
    <>
      <ScreenTopbar
        projectId={project.id}
        timeZone={project.timezone}
        serverNow={serverNow}
        texts={screenTopbarTexts(project.name, i18n)}
      />
      <ContentPlaceholder label={i18n.t('states.loading')} />
      {children}
    </>
  );
}
