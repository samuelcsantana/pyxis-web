import type { Metadata } from 'next';
import { InstallGuide } from '@/components/install/install-guide';
import { MainContent } from '@/components/shell/main-content';
import { Topbar } from '@/components/shell/topbar';
import { getI18n, getTranslator } from '@/i18n/get-messages';
import { apiBaseUrl } from '@/lib/api-config';
import { projectOrNotFound, readOrSignIn } from '@/lib/current-admin';
import { PYXIS_INGESTION_URL } from '@/lib/landing-measurement-config';
import { createProjectsService } from '@/services/projects/projects-service.factory';

export interface InstallPageProps {
  readonly params: Promise<{ readonly projectId: string }>;
}

export async function generateMetadata({ params }: InstallPageProps): Promise<Metadata> {
  const { project } = await projectOrNotFound((await params).projectId);
  const t = await getTranslator();
  return { title: t('meta.screenTitle', { screen: t('install.title'), project: project.name }) };
}

export default async function InstallPage({ params }: InstallPageProps) {
  const { project } = await projectOrNotFound((await params).projectId);
  const settings = await readOrSignIn(() => createProjectsService().settings(project.id));
  const i18n = await getI18n();
  return (
    <>
      <Topbar
        title={i18n.t('install.title')}
        subtitle={i18n.t('install.subtitle', { project: project.name })}
      />
      <MainContent
        data-window-page=""
        className="flex w-full max-w-200 flex-col gap-3.5 p-4 sm:gap-5 sm:px-8 sm:pt-7 sm:pb-12"
      >
        <InstallGuide
          settings={settings}
          endpoint={apiBaseUrl() ?? PYXIS_INGESTION_URL}
          i18n={i18n}
        />
      </MainContent>
    </>
  );
}
