import { redirect } from 'next/navigation';
import { MainContent } from '@/components/shell/main-content';
import { SignOutButton } from '@/components/shell/sign-out-button';
import { FIRST_SCREEN, screenHref } from '@/components/shell/screens';
import { EmptyState } from '@/components/states/empty-state';
import { currentAdmin } from '@/lib/current-admin';

export default async function HomePage() {
  const admin = await currentAdmin();
  const firstProject = admin.projects[0];
  if (firstProject !== undefined) {
    redirect(screenHref(firstProject.id, FIRST_SCREEN));
  }
  return (
    <MainContent className="mx-auto flex min-h-dvh max-w-lg flex-col justify-center gap-4 px-4 py-16">
      <EmptyState headingLevel="h1" title="No projects yet">
        <p>
          <strong className="text-ink">{admin.email}</strong> can sign in, but no project was
          granted to it yet. Ask the operator of this Pyxis to run <code>admin:grant</code> for your
          email.
        </p>
      </EmptyState>
      <SignOutButton variant="page" />
    </MainContent>
  );
}
