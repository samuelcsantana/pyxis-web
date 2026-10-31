import type { ReactNode } from 'react';
import { ContentPlaceholder } from '@/components/shell/content-placeholder';
import { NewsBar } from '@/components/shell/news-bar';
import { ScreenTopbar } from '@/components/shell/screen-topbar';
import { screenTopbarTexts } from '@/components/shell/screen-topbar-texts';
import { getI18n } from '@/i18n/get-messages';
import { projectOrNotFound } from '@/lib/current-admin';

export interface ScreensLayoutProps {
  readonly children: ReactNode;
  readonly filters: ReactNode;
  readonly params: Promise<{ readonly projectId: string }>;
}

const STICKS_WITH_THE_TOPBAR = 'max-lg:contents lg:sticky lg:top-0 lg:z-20';

export default async function ScreensLayout({ children, filters, params }: ScreensLayoutProps) {
  const { project } = await projectOrNotFound((await params).projectId);
  const serverNow = new Date().getTime();
  const i18n = await getI18n();
  return (
    <>
      <div className={STICKS_WITH_THE_TOPBAR}>
        <ScreenTopbar
          projectId={project.id}
          timeZone={project.timezone}
          serverNow={serverNow}
          texts={screenTopbarTexts(i18n)}
        >
          {filters}
        </ScreenTopbar>
        <NewsBar />
      </div>
      <ContentPlaceholder label={i18n.t('states.loading')} />
      {children}
    </>
  );
}
