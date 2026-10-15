import { redirect } from 'next/navigation';
import { BrandedPage } from '@/components/brand/branded-page';
import { FIRST_SCREEN, screenHref } from '@/components/shell/screens';
import { NoProjectsYet } from '@/components/states/no-projects-yet';
import { getI18n } from '@/i18n/get-messages';
import { bestEffortAccountsInView } from '@/lib/accounts-in-view';
import { currentAdmin } from '@/lib/current-admin';

export default async function HomePage() {
  const admin = await currentAdmin();
  const firstProject = admin.projects[0];
  if (firstProject !== undefined) {
    redirect(screenHref(firstProject.id, FIRST_SCREEN));
  }
  const [i18n, { canCreateProject }] = await Promise.all([
    getI18n(),
    bestEffortAccountsInView(new Date()),
  ]);
  return (
    <BrandedPage>
      <NoProjectsYet email={admin.email} i18n={i18n} canCreateProject={canCreateProject} />
    </BrandedPage>
  );
}
