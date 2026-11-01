import type { ReactNode } from 'react';
import { PreferenceCarrier } from '@/components/preferences/preference-carrier';
import { AccountMenu } from '@/components/shell/account-menu';
import { ArrivalsLoader } from '@/components/shell/arrivals-loader';
import { BarAccountProvider } from '@/components/shell/bar-account';
import { PhoneBar } from '@/components/shell/phone-bar';
import { PhoneBarSlotsProvider } from '@/components/shell/phone-bar-slots';
import { NavigationPendingProvider, NavigationRegion } from '@/components/shell/navigation-pending';
import { ProjectChoicesProvider } from '@/components/shell/project-choices';
import { Sidebar, SIDEBAR_COLUMN } from '@/components/shell/sidebar';
import { SkipLink } from '@/components/shell/skip-link';
import { AccountNoticeBanner } from '@/components/account/account-notice-banner';
import { DemoBanner } from '@/components/states/demo-banner';
import { IngestionSuspendedBanner } from '@/components/states/ingestion-suspended-banner';
import { ingestionSuspensionOf } from '@/domain/admin';
import { getI18n } from '@/i18n/get-messages';
import { isDemoMode } from '@/lib/api-config';
import { bestEffortAccountsInView } from '@/lib/accounts-in-view';
import { projectOrNotFound } from '@/lib/current-admin';

export interface ProjectLayoutProps {
  readonly children: ReactNode;
  readonly modal: ReactNode;
  readonly params: Promise<{ readonly projectId: string }>;
}

export default async function ProjectLayout({ children, modal, params }: ProjectLayoutProps) {
  const { admin, project } = await projectOrNotFound((await params).projectId);
  const [i18n, { notice, canCreateProject, usage, ownsProject }] = await Promise.all([
    getI18n(),
    bestEffortAccountsInView(new Date(), project),
  ]);
  const suspension = ingestionSuspensionOf(project);
  return (
    <NavigationPendingProvider>
      <ProjectChoicesProvider
        projects={admin.projects}
        currentProject={project}
        canCreateProject={canCreateProject}
        ownsCurrentProject={ownsProject}
      >
        <BarAccountProvider
          account={
            <AccountMenu email={admin.email} projectId={project.id} i18n={i18n} usage={usage} />
          }
        >
          <PhoneBarSlotsProvider>
            <div className="min-h-dvh pb-[calc(3.75rem+env(safe-area-inset-bottom,0px))] lg:grid lg:grid-cols-[248px_minmax(0,1fr)] lg:pb-0">
              <SkipLink i18n={i18n} />
              <PreferenceCarrier locale={i18n.locale} />
              <ArrivalsLoader
                projectId={project.id}
                timeZone={project.timezone}
                serverNow={new Date().getTime()}
                awaitsItsFirstEvent={project.firstEventAt === null}
              />
              <nav aria-label={i18n.t('nav.label')} className={SIDEBAR_COLUMN}>
                <Sidebar project={project} />
              </nav>
              <PhoneBar project={project} />
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
          </PhoneBarSlotsProvider>
        </BarAccountProvider>
      </ProjectChoicesProvider>
    </NavigationPendingProvider>
  );
}
