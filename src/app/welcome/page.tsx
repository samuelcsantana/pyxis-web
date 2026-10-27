import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { BrandedPage } from '@/components/brand/branded-page';
import { NEW_PROJECT_PAGE } from '@/components/shell/project-switcher';
import { BUTTON_PRIMARY, TEXT_LINK } from '@/components/ui/control-classes';
import { PANEL } from '@/components/ui/panel-classes';
import { RefreshWhilePending } from '@/components/ui/refresh-while-pending';
import { FreePlanWelcome } from '@/components/welcome/free-plan-welcome';
import { type Account, welcomeStage } from '@/domain/accounts';
import { getI18n, getTranslator } from '@/i18n/get-messages';
import type { I18n } from '@/i18n/i18n';
import { readOrSignIn } from '@/lib/current-admin';
import { createAccountsService } from '@/services/accounts/accounts-service.factory';

export const DASHBOARD_HOME = '/';

export interface WelcomePageProps {
  readonly searchParams: Promise<Readonly<Record<string, string | string[] | undefined>>>;
}

const NOTE = 'text-xs leading-[18px] text-muted';

const PRIMARY_LINK = `flex min-h-11 items-center self-start rounded-input px-4 text-sm ${BUTTON_PRIMARY}`;

function FirstSubscription({ account, i18n }: { readonly account: Account; readonly i18n: I18n }) {
  const { t } = i18n;
  return (
    <>
      <p role="status" className="text-sm font-semibold">
        {account.trialEndsAt === null
          ? t('welcome.active')
          : t('welcome.trial', { date: i18n.format.dayWithYear(new Date(account.trialEndsAt)) })}
      </p>
      <p className="text-sm">{t('welcome.next')}</p>
      <Link href={NEW_PROJECT_PAGE} className={PRIMARY_LINK}>
        {t('welcome.create')}
      </Link>
    </>
  );
}

function SubscriptionBack({ i18n }: { readonly i18n: I18n }) {
  const { t } = i18n;
  return (
    <>
      <p role="status" className="text-sm font-semibold">
        {t('welcome.activeAgain')}
      </p>
      <p className="text-sm">{t('welcome.nextAgain')}</p>
      <Link href={DASHBOARD_HOME} className={PRIMARY_LINK}>
        {t('welcome.dashboard')}
      </Link>
    </>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslator();
  return { title: t('welcome.title') };
}

export default async function WelcomePage({ searchParams }: WelcomePageProps) {
  const { account: accountId } = await searchParams;
  const accounts = await readOrSignIn(() => createAccountsService().list());
  const account = accounts.find(
    (candidate) => candidate.role === 'owner' && candidate.id === accountId,
  );
  if (account === undefined) {
    redirect(DASHBOARD_HOME);
  }
  const i18n = await getI18n();
  const { t } = i18n;
  const stage = welcomeStage(account);
  return (
    <BrandedPage>
      <h1 className="text-2xl font-bold tracking-tight">{t('welcome.title')}</h1>
      <section className={PANEL}>
        {stage === 'confirming' ? (
          <>
            <p role="status" className="text-sm font-semibold">
              {t('welcome.confirming')}
            </p>
            <p className={NOTE}>{t('welcome.confirmingNote')}</p>
          </>
        ) : null}
        {stage === 'firstSubscription' ? <FirstSubscription account={account} i18n={i18n} /> : null}
        {stage === 'freePlan' ? <FreePlanWelcome limits={account.limits} i18n={i18n} /> : null}
        {stage === 'subscriptionBack' ? <SubscriptionBack i18n={i18n} /> : null}
        <RefreshWhilePending pending={stage === 'confirming'} />
      </section>
      {stage === 'subscriptionBack' ? null : (
        <Link href={DASHBOARD_HOME} className={`self-start text-sm ${TEXT_LINK}`}>
          {t('welcome.dashboard')}
        </Link>
      )}
    </BrandedPage>
  );
}
