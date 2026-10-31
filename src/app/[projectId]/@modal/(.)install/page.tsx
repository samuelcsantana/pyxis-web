import { InstallWindow } from '@/components/install/install-window';
import { getI18n } from '@/i18n/get-messages';
import { apiBaseUrl } from '@/lib/api-config';
import { projectOrNotFound, readOrSignIn } from '@/lib/current-admin';
import { PYXIS_INGESTION_URL } from '@/lib/landing-measurement-config';
import { createProjectsService } from '@/services/projects/projects-service.factory';
import type { InstallPageProps } from '@/app/[projectId]/install/page';

export { generateMetadata } from '@/app/[projectId]/install/page';

export default async function InstallWindowPage({ params }: InstallPageProps) {
  const { project } = await projectOrNotFound((await params).projectId);
  const settings = await readOrSignIn(() => createProjectsService().settings(project.id));
  const i18n = await getI18n();
  return (
    <InstallWindow settings={settings} endpoint={apiBaseUrl() ?? PYXIS_INGESTION_URL} i18n={i18n} />
  );
}
