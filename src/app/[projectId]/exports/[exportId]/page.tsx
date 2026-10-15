import type { Metadata } from 'next';
import { ExportView } from '@/components/exports/export-view';
import { MainContent } from '@/components/shell/main-content';
import { Topbar } from '@/components/shell/topbar';
import { getI18n, getTranslator } from '@/i18n/get-messages';
import { projectOrNotFound, readOrSignIn } from '@/lib/current-admin';
import { createExportsService } from '@/services/exports/exports-service.factory';

export interface ExportPageProps {
  readonly params: Promise<{ readonly projectId: string; readonly exportId: string }>;
}

export async function generateMetadata({ params }: ExportPageProps): Promise<Metadata> {
  const { project } = await projectOrNotFound((await params).projectId);
  const t = await getTranslator();
  return { title: t('meta.screenTitle', { screen: t('exportPage.title'), project: project.name }) };
}

export default async function ExportPage({ params }: ExportPageProps) {
  const { projectId, exportId } = await params;
  const { project } = await projectOrNotFound(projectId);
  const found = await readOrSignIn(() => createExportsService().get(project.id, exportId));
  const i18n = await getI18n();
  return (
    <>
      <Topbar
        title={i18n.t('exportPage.title')}
        subtitle={i18n.t('exportPage.subtitle', { project: project.name })}
      />
      <MainContent className="flex w-full max-w-180 flex-col gap-3.5 p-4 sm:gap-5 sm:px-8 sm:pt-7 sm:pb-12">
        <ExportView projectId={project.id} found={found} i18n={i18n} now={new Date()} />
      </MainContent>
    </>
  );
}
