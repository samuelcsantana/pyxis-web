import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { AuthFrame } from '@/components/sign-up/auth-frame';
import { SignUpForm } from '@/components/sign-up/sign-up-form';
import { TEXT_LINK } from '@/components/ui/control-classes';
import { type Account, canCreateProjects, needsCheckout } from '@/domain/accounts';
import { openSignUpOf } from '@/domain/sign-up';
import { getI18n, getTranslator } from '@/i18n/get-messages';
import { isDemoMode } from '@/lib/api-config';
import { readOrSignIn } from '@/lib/current-admin';
import { landingPageOfLocale, landingUrlOf } from '@/lib/landing-pages';
import { LIVE_DEMO_URL } from '@/lib/site';
import { chosenTheme } from '@/lib/theme-cookie';
import { createAccountsService } from '@/services/accounts/accounts-service.factory';
import { ContractNotice } from '@/components/legal/contract-notice';
import { legalConfig } from '@/lib/legal-config';
import { DEMO_SIGN_IN_CODE } from '@/services/auth/mock-auth-service';
import { sessionToken } from '@/services/session-token';
import { createSignUpService } from '@/services/sign-up/sign-up-service.factory';
import { openCheckout } from '../account/actions';

export const DASHBOARD_HOME = '/';

const CARD =
  'flex w-full max-w-[440px] flex-col gap-4 rounded-panel border border-line bg-card p-8';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslator();
  return { title: t('signUpPage.title') };
}

async function ownedAccountsOfTheVisitor(): Promise<readonly Account[]> {
  if ((await sessionToken()) === undefined) {
    return [];
  }
  const accounts = await readOrSignIn(() => createAccountsService().list());
  return accounts.filter((account) => account.role === 'owner');
}

export default async function SignUpPage() {
  const [owned, status, i18n, theme] = await Promise.all([
    ownedAccountsOfTheVisitor(),
    createSignUpService().status(),
    getI18n(),
    chosenTheme(),
  ]);
  if (owned.some(canCreateProjects)) {
    redirect(DASHBOARD_HOME);
  }
  const unfinished = owned.find(needsCheckout);
  const open = openSignUpOf(status);
  const seller = legalConfig()?.seller;
  const { t } = i18n;
  return (
    <AuthFrame i18n={i18n} theme={theme}>
      {unfinished === undefined && open === null ? (
        <section className={CARD}>
          <h1 className="text-title font-semibold">{t('signUpPage.closedTitle')}</h1>
          <p className="text-sm text-muted">{t('signUpPage.closedBody')}</p>
          <a href={LIVE_DEMO_URL} className={`self-start text-sm ${TEXT_LINK}`}>
            {t('signUpPage.demo')}
          </a>
          <Link
            href={landingUrlOf(landingPageOfLocale(i18n.locale))}
            className={`self-start text-sm ${TEXT_LINK}`}
          >
            {t('signUpPage.home')}
          </Link>
        </section>
      ) : (
        <SignUpForm
          terms={open}
          unfinishedAccountId={unfinished?.id}
          openCheckout={openCheckout}
          demoCode={isDemoMode() ? DEMO_SIGN_IN_CODE : undefined}
        />
      )}
      {seller === undefined ? null : <ContractNotice i18n={i18n} seller={seller} />}
    </AuthFrame>
  );
}
