import type { Metadata } from 'next';
import { BrandBackdrop } from '@/components/brand/brand-backdrop';
import { RAISED_CARDS } from '@/components/brand/raised-cards';
import { SiteHeader } from '@/components/landing/site-header';
import { LanguageMenu } from '@/components/language/language-menu';
import { MainContent } from '@/components/shell/main-content';
import { returnPathOf } from '@/components/shell/screens';
import { SignInForm } from '@/components/sign-in/sign-in-form';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { TEXT_LINK } from '@/components/ui/control-classes';
import { chooseLocale } from '@/i18n/choose-locale';
import { getI18n, getTranslator } from '@/i18n/get-messages';
import { isDemoMode } from '@/lib/api-config';
import { landingPageOfLocale, landingUrlOf } from '@/lib/landing-pages';
import { LIVE_DEMO_URL } from '@/lib/site';
import { chosenTheme } from '@/lib/theme-cookie';
import { DEMO_SIGN_IN_CODE } from '@/services/auth/mock-auth-service';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslator();
  return { title: t('signInPage.title') };
}

const SHIELD_ICON = 'M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z M9 12l2 2 4-4';
const ARROW_ICON = 'M5 12h14 M13 6l6 6-6 6';

export interface SignInPageProps {
  readonly searchParams: Promise<Readonly<Record<string, string | string[] | undefined>>>;
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const { expired, next } = await searchParams;
  const i18n = await getI18n();
  const { t, locale } = i18n;
  const demo = isDemoMode();
  return (
    <div className="relative isolate flex min-h-dvh flex-col bg-bg text-ink">
      <BrandBackdrop />
      <SiteHeader
        i18n={i18n}
        homeHref={landingUrlOf(landingPageOfLocale(locale))}
        language={
          <LanguageMenu
            locale={locale}
            label={t('language.label')}
            choose={chooseLocale}
            compactOnPhones
          />
        }
        theme={<ThemeToggle initialTheme={await chosenTheme()} />}
        withSignIn={false}
      />
      <MainContent
        className={`flex w-full grow flex-col items-center justify-start gap-7 px-4 pt-5 pb-10 sm:justify-center sm:py-8 ${RAISED_CARDS}`}
      >
        <SignInForm
          sessionExpired={expired === '1'}
          demoCode={demo ? DEMO_SIGN_IN_CODE : undefined}
          returnPath={returnPathOf(typeof next === 'string' ? next : undefined)}
        />
        {demo ? null : (
          <a href={LIVE_DEMO_URL} className={`text-center text-sm ${TEXT_LINK}`}>
            {t('signInPage.demoLink')}
            <svg
              width={16}
              height={16}
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="ml-1 inline align-[-3px]"
            >
              <path
                d={ARROW_ICON}
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        )}
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
      </MainContent>
    </div>
  );
}
