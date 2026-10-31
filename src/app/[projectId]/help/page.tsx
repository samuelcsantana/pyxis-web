import type { Metadata } from 'next';
import { HelpView } from '@/components/help/help-view';
import { MainContent } from '@/components/shell/main-content';
import { helpHref } from '@/components/shell/screens';
import { Topbar } from '@/components/shell/topbar';
import { supportPlanOf } from '@/domain/support';
import { getI18n, getTranslator } from '@/i18n/get-messages';
import { projectOrNotFound, readOrSignIn } from '@/lib/current-admin';
import { demoCanonical } from '@/lib/demo-canonical';
import type { ScreenMetadataProps } from '@/lib/screen-metadata';
import { createAccountsService } from '@/services/accounts/accounts-service.factory';

export interface HelpPageProps {
  readonly params: Promise<{ readonly projectId: string }>;
}

export async function generateMetadata({ params }: ScreenMetadataProps): Promise<Metadata> {
  const { project } = await projectOrNotFound((await params).projectId);
  const t = await getTranslator();
  return {
    title: t('meta.screenTitle', { screen: t('support.title'), project: project.name }),
    ...demoCanonical(helpHref(project.id)),
  };
}

export default async function HelpPage({ params }: HelpPageProps) {
  const { admin, project } = await projectOrNotFound((await params).projectId);
  const accounts = await readOrSignIn(() => createAccountsService().list());
  const i18n = await getI18n();
  return (
    <>
      <Topbar title={i18n.t('support.title')} subtitle={i18n.t('support.subtitle')} />
      <MainContent
        data-window-page=""
        className="flex w-full max-w-3xl flex-col gap-3.5 p-4 sm:gap-5 sm:px-8 sm:pt-7 sm:pb-12"
      >
        <HelpView
          projectId={project.id}
          email={admin.email}
          plan={supportPlanOf(accounts)}
          i18n={i18n}
        />
      </MainContent>
    </>
  );
}
