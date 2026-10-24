import type { ReactNode } from 'react';
import { BrandBackdrop } from '@/components/brand/brand-backdrop';
import { RAISED_CARDS } from '@/components/brand/raised-cards';
import { LanguageFormSelect } from '@/components/language/language-form-select';
import { SiteHeader } from '@/components/landing/site-header';
import { PreferenceCarrier } from '@/components/preferences/preference-carrier';
import { MainContent } from '@/components/shell/main-content';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { chooseLocale } from '@/i18n/choose-locale';
import type { I18n } from '@/i18n/i18n';
import { landingPageOfLocale, landingUrlOf } from '@/lib/landing-pages';
import type { Theme } from '@/lib/theme';

export interface AuthFrameProps {
  readonly i18n: I18n;
  readonly theme?: Theme;
  readonly children: ReactNode;
}

export function AuthFrame({ i18n, theme, children }: AuthFrameProps) {
  return (
    <div className="relative isolate flex min-h-dvh flex-col bg-bg text-ink">
      <BrandBackdrop />
      <PreferenceCarrier locale={i18n.locale} />
      <SiteHeader
        i18n={i18n}
        homeHref={landingUrlOf(landingPageOfLocale(i18n.locale))}
        onHomePage={false}
        language={
          <LanguageFormSelect
            locale={i18n.locale}
            label={i18n.t('language.label')}
            choose={chooseLocale}
          />
        }
        theme={<ThemeToggle initialTheme={theme} />}
        withSignIn={false}
      />
      <MainContent
        className={`flex w-full grow flex-col items-center justify-start gap-7 px-4 pt-5 pb-10 sm:justify-center sm:py-8 ${RAISED_CARDS}`}
      >
        {children}
      </MainContent>
    </div>
  );
}
