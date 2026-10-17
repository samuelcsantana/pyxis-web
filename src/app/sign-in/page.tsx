import type { Metadata } from 'next';
import { LANDING_LINKS } from '@/components/landing/landing-links';
import { PRICING_ID } from '@/components/landing/pricing-section';
import { returnPathOf } from '@/components/shell/screens';
import { NoCodeHelp } from '@/components/sign-in/no-code-help';
import { AuthFrame } from '@/components/sign-up/auth-frame';
import { SignInForm } from '@/components/sign-in/sign-in-form';
import { TEXT_LINK } from '@/components/ui/control-classes';
import { getI18n, getTranslator } from '@/i18n/get-messages';
import { rich } from '@/i18n/rich';
import { isDemoMode } from '@/lib/api-config';
import { landingPageOfLocale, landingUrlOf } from '@/lib/landing-pages';
import { bestEffortSignUpIsOpen } from '@/lib/landing-sign-up';
import { LIVE_DEMO_URL } from '@/lib/site';
import { chosenTheme } from '@/lib/theme-cookie';
import { DEMO_SIGN_IN_CODE } from '@/services/auth/mock-auth-service';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslator();
  return { title: t('signInPage.title') };
}

const SHIELD_ICON = 'M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z M9 12l2 2 4-4';

export interface SignInPageProps {
  readonly searchParams: Promise<Readonly<Record<string, string | string[] | undefined>>>;
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const { expired, next } = await searchParams;
  const i18n = await getI18n();
  const { t, locale } = i18n;
  const demo = isDemoMode();
  const plansHref = `${landingUrlOf(landingPageOfLocale(locale))}#${PRICING_ID}`;
  return (
    <AuthFrame i18n={i18n} theme={await chosenTheme()}>
      <SignInForm
        sessionExpired={expired === '1'}
        demoCode={demo ? DEMO_SIGN_IN_CODE : undefined}
        returnPath={returnPathOf(typeof next === 'string' ? next : undefined)}
        noAccountHelp={
          demo ? undefined : (
            <p className="border-t border-line pt-4 text-sm leading-5 text-muted">
              {rich(t('signInPage.noAccount'), {
                plans: (text) => (
                  <a href={plansHref} className={TEXT_LINK}>
                    {text}
                  </a>
                ),
                demo: (text) => (
                  <a href={LIVE_DEMO_URL} className={TEXT_LINK}>
                    {text}
                  </a>
                ),
              })}
            </p>
          )
        }
        noCodeHelp={
          demo ? undefined : (
            <NoCodeHelp
              message={t('signInPage.noCode')}
              plans={{ label: t('signInPage.seePlans'), href: plansHref }}
              trial={
                (await bestEffortSignUpIsOpen())
                  ? { label: t('signInPage.startTrial'), href: LANDING_LINKS.signUp }
                  : undefined
              }
            />
          )
        }
      />
      <p className="flex items-center gap-2 text-center text-caption text-muted">
        <svg width={16} height={16} viewBox="0 0 24 24" aria-hidden="true" className="shrink-0">
          <path
            d={SHIELD_ICON}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {t('signInPage.privacy')}
      </p>
    </AuthFrame>
  );
}
