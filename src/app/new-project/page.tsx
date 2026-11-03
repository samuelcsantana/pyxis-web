import type { Metadata } from 'next';
import Link from 'next/link';
import { NewProjectForm } from '@/components/account/new-project-form';
import { BrandedPage } from '@/components/brand/branded-page';
import { DemoBanner } from '@/components/states/demo-banner';
import { TEXT_LINK } from '@/components/ui/control-classes';
import { canCreateProjects } from '@/domain/accounts';
import { timeZoneChoices } from '@/domain/project-management';
import { getI18n, getTranslator } from '@/i18n/get-messages';
import { isDemoMode } from '@/lib/api-config';
import { landingPageOfLocale, landingUrlOf } from '@/lib/landing-pages';
import { readOrSignIn } from '@/lib/current-admin';
import { createAccountsService } from '@/services/accounts/accounts-service.factory';
import { createProject } from './actions';

export const DASHBOARD_HOME = '/';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslator();
  return { title: t('newProject.title') };
}

export default async function NewProjectPage() {
  const accounts = await readOrSignIn(() => createAccountsService().list());
  const account = accounts.find(canCreateProjects);
  const i18n = await getI18n();
  const demo = isDemoMode();
  const back = (
    <Link href={DASHBOARD_HOME} className={`self-start text-sm ${TEXT_LINK}`}>
      {i18n.t('newProject.back')}
    </Link>
  );
  return (
    <>
      {demo ? <DemoBanner i18n={i18n} /> : null}
      <BrandedPage logoHref={demo ? landingUrlOf(landingPageOfLocale(i18n.locale)) : undefined}>
        {demo ? back : null}
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">{i18n.t('newProject.title')}</h1>
          <p className="text-sm text-muted">{i18n.t('newProject.intro')}</p>
        </div>
        {account === undefined ? (
          <p className="text-sm">{i18n.t('newProject.noAccount')}</p>
        ) : (
          <NewProjectForm
            timezones={timeZoneChoices('UTC')}
            projectLimit={account.limits.projects}
            create={createProject.bind(null, account.id)}
          />
        )}
        {demo ? null : back}
      </BrandedPage>
    </>
  );
}
