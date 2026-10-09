import type { ReactNode } from 'react';
import { MobileMenu } from '@/components/shell/mobile-menu';
import { NavigationPendingProvider, NavigationRegion } from '@/components/shell/navigation-pending';
import { Sidebar } from '@/components/shell/sidebar';
import { SkipLink } from '@/components/shell/skip-link';
import { DemoBanner } from '@/components/states/demo-banner';
import { chooseLocale } from '@/i18n/choose-locale';
import { getI18n } from '@/i18n/get-messages';
import { isDemoMode } from '@/lib/api-config';
import { projectOrNotFound } from '@/lib/current-admin';
import { chosenTheme } from '@/lib/theme-cookie';

export interface ProjectLayoutProps {
  readonly children: ReactNode;
  readonly params: Promise<{ readonly projectId: string }>;
}

export default async function ProjectLayout({ children, params }: ProjectLayoutProps) {
  const { admin, project } = await projectOrNotFound((await params).projectId);
  const i18n = await getI18n();
  return (
    <NavigationPendingProvider>
      <div className="min-h-dvh lg:grid lg:grid-cols-[248px_minmax(0,1fr)]">
        <SkipLink i18n={i18n} />
        <MobileMenu>
          <Sidebar
            admin={admin}
            project={project}
            theme={await chosenTheme()}
            i18n={i18n}
            chooseLocale={chooseLocale}
          />
        </MobileMenu>
        <NavigationRegion className="flex min-w-0 flex-col">
          {isDemoMode() ? <DemoBanner i18n={i18n} /> : null}
          {children}
        </NavigationRegion>
      </div>
    </NavigationPendingProvider>
  );
}
