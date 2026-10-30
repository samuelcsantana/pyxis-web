import type { ReactNode } from 'react';
import { PreferenceCarrier } from '@/components/preferences/preference-carrier';
import { ArrivalsLoader } from '@/components/shell/arrivals-loader';
import { MobileMenu } from '@/components/shell/mobile-menu';
import { NavigationPendingProvider, NavigationRegion } from '@/components/shell/navigation-pending';
import { Sidebar } from '@/components/shell/sidebar';
import { SkipLink } from '@/components/shell/skip-link';
import { AccountNoticeBanner } from '@/components/account/account-notice-banner';
import { DemoBanner } from '@/components/states/demo-banner';
import { IngestionSuspendedBanner } from '@/components/states/ingestion-suspended-banner';
import { ingestionSuspensionOf } from '@/domain/admin';
import { chooseLocale } from '@/i18n/choose-locale';
import { getI18n } from '@/i18n/get-messages';
import { isDemoMode } from '@/lib/api-config';
import { bestEffortAccountsInView } from '@/lib/accounts-in-view';
import { projectOrNotFound } from '@/lib/current-admin';
import { chosenTheme } from '@/lib/theme-cookie';

export interface ProjectLayoutProps {
  readonly children: ReactNode;
  readonly modal: ReactNode;
  readonly params: Promise<{ readonly projectId: string }>;
}

export default async function ProjectLayout({ children, modal, params }: ProjectLayoutProps) {
  const { admin, project } = await projectOrNotFound((await params).projectId);
  const [i18n, { notice, canCreateProject, usage }] = await Promise.all([
    getI18n(),
    bestEffortAccountsInView(new Date(), project),
  ]);
  const suspension = ingestionSuspensionOf(project);
  return (
    <NavigationPendingProvider>
      <div className="min-h-dvh lg:grid lg:grid-cols-[248px_minmax(0,1fr)]">
        <SkipLink i18n={i18n} />
        <PreferenceCarrier locale={i18n.locale} />
        <ArrivalsLoader
          projectId={project.id}
          timeZone={project.timezone}
          serverNow={new Date().getTime()}
        />
        <MobileMenu
          project={project}
          homeLabel={i18n.t('meta.screenTitle', {
            screen: i18n.t('screens.overview'),
            project: project.name,
          })}
        >
          <Sidebar
            admin={admin}
            project={project}
            theme={await chosenTheme()}
            i18n={i18n}
            chooseLocale={chooseLocale}
            canCreateProject={canCreateProject}
            usage={usage}
          />
        </MobileMenu>
        <NavigationRegion className="relative flex min-w-0 flex-col">
          {isDemoMode() ? <DemoBanner i18n={i18n} /> : null}
          {notice === null ? null : <AccountNoticeBanner notice={notice} i18n={i18n} />}
          {suspension === null ? null : (
            <IngestionSuspendedBanner suspension={suspension} i18n={i18n} />
          )}
          {children}
        </NavigationRegion>
        {modal}
      </div>
    </NavigationPendingProvider>
  );
}
