import { redirect } from 'next/navigation';
import { MainContent } from '@/components/shell/main-content';
import { FIRST_SCREEN, screenHref } from '@/components/shell/screens';
import { NoProjectsYet } from '@/components/states/no-projects-yet';
import { getI18n } from '@/i18n/get-messages';
import { currentAdmin } from '@/lib/current-admin';

export default async function HomePage() {
  const admin = await currentAdmin();
  const firstProject = admin.projects[0];
  if (firstProject !== undefined) {
    redirect(screenHref(firstProject.id, FIRST_SCREEN));
  }
  return (
    <MainContent className="mx-auto flex min-h-dvh max-w-lg flex-col justify-center gap-4 px-4 py-16">
      <NoProjectsYet email={admin.email} i18n={await getI18n()} />
    </MainContent>
  );
}
