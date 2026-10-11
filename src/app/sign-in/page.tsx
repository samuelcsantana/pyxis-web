import type { Metadata } from 'next';
import { LogoMark } from '@/components/brand/logo-mark';
import { LanguageMenu } from '@/components/language/language-menu';
import { MainContent } from '@/components/shell/main-content';
import { returnPathOf } from '@/components/shell/screens';
import { SignInForm } from '@/components/sign-in/sign-in-form';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { TEXT_LINK } from '@/components/ui/control-classes';
import { chooseLocale } from '@/i18n/choose-locale';
import { getI18n, getTranslator } from '@/i18n/get-messages';
import { isDemoMode } from '@/lib/api-config';
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
  const { t, locale } = await getI18n();
  const demo = isDemoMode();
  return (
    <div className="flex min-h-dvh flex-col items-center bg-bg px-4 pt-6 pb-10 text-ink">
      <header className="flex w-full max-w-6xl flex-wrap items-center justify-end gap-2">
        <p className="mr-auto flex items-center gap-2.5 text-xl font-bold tracking-tight">
          <LogoMark size={28} />
          Pyxis
        </p>
        <LanguageMenu locale={locale} label={t('language.label')} choose={chooseLocale} />
        <ThemeToggle initialTheme={await chosenTheme()} />
      </header>
      <MainContent className="flex w-full grow flex-col items-center justify-start gap-7 pt-5 pb-8 sm:justify-center sm:py-8">
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
