import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LandingFooter } from '@/components/landing/landing-footer';
import { LandingHeader } from '@/components/landing/landing-header';
import { LandingHero } from '@/components/landing/landing-hero';
import { LandingStructuredData } from '@/components/landing/landing-structured-data';
import { MainContent } from '@/components/shell/main-content';
import { SkipLink } from '@/components/shell/skip-link';
import { loadMessages } from '@/i18n/get-messages';
import { createI18n, type I18n } from '@/i18n/i18n';
import type { Locale } from '@/i18n/locales';
import { isDemoMode } from '@/lib/api-config';
import {
  LANDING_PAGES,
  type LandingPage,
  landingPageOfSlug,
  languageAlternatesOf,
} from '@/lib/landing-pages';
import { APP_NAME, LANDING_ORIGIN } from '@/lib/site';

export interface LandingHomeProps {
  readonly params: Promise<{ readonly locale: string }>;
}

interface Landing {
  readonly page: LandingPage;
  readonly i18n: I18n;
}

const OPEN_GRAPH_LOCALES: Readonly<Record<Locale, string>> = { en: 'en_US', 'pt-BR': 'pt_BR' };

const pathOf = (page: LandingPage): string => page.path;

async function landingOf(params: LandingHomeProps['params']): Promise<Landing | undefined> {
  const page = landingPageOfSlug((await params).locale);
  if (page === undefined || !isDemoMode()) {
    return undefined;
  }
  return { page, i18n: createI18n(page.locale, await loadMessages(page.locale)) };
}

export async function generateMetadata({ params }: LandingHomeProps): Promise<Metadata> {
  const landing = await landingOf(params);
  if (landing === undefined) {
    return {};
  }
  const { page, i18n } = landing;
  const title = i18n.t('landing.meta.title');
  const description = i18n.t('landing.meta.description');
  return {
    metadataBase: new URL(LANDING_ORIGIN),
    title: { absolute: title },
    description,
    alternates: { canonical: page.path, languages: languageAlternatesOf(pathOf) },
    openGraph: {
      type: 'website',
      siteName: APP_NAME,
      title,
      description,
      url: page.path,
      locale: OPEN_GRAPH_LOCALES[page.locale],
      alternateLocale: LANDING_PAGES.filter((other) => other !== page).map(
        (other) => OPEN_GRAPH_LOCALES[other.locale],
      ),
    },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default async function LandingHome({ params }: LandingHomeProps) {
  const landing = await landingOf(params);
  if (landing === undefined) {
    notFound();
  }
  const { page, i18n } = landing;
  return (
    <div className="flex min-h-dvh flex-col bg-bg text-ink">
      <SkipLink i18n={i18n} />
      <LandingHeader i18n={i18n} page={page} />
      <MainContent className="grow">
        <LandingHero i18n={i18n} />
      </MainContent>
      <LandingFooter i18n={i18n} />
      <LandingStructuredData i18n={i18n} page={page} />
    </div>
  );
}
