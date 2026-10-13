import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArchitectureSection } from '@/components/landing/architecture-section';
import { BuiltInPublicSection } from '@/components/landing/built-in-public-section';
import { ComparisonSection } from '@/components/landing/comparison-section';
import { DashboardAnswersSection } from '@/components/landing/dashboard-answers-section';
import { FaqSection } from '@/components/landing/faq-section';
import { InProductionSection } from '@/components/landing/in-production-section';
import { InstallSection } from '@/components/landing/install-section';
import { LandingFooter } from '@/components/landing/landing-footer';
import { LandingHero } from '@/components/landing/landing-hero';
import { LandingStructuredData } from '@/components/landing/landing-structured-data';
import { LanguageLinks } from '@/components/landing/language-links';
import { LandingMeasurementBoot } from '@/components/landing/measurement/landing-measurement-boot';
import {
  measurementLabelsOf,
  recordedLabelsOf,
} from '@/components/landing/measurement/measurement-labels';
import { MeasurementNote } from '@/components/landing/measurement/measurement-note';
import { NeverStoredSection } from '@/components/landing/never-stored-section';
import { SiteHeader } from '@/components/landing/site-header';
import { StorySection } from '@/components/landing/story-section';
import { MainContent } from '@/components/shell/main-content';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import {
  LANDING_PREVIEW_RANGE,
  type LandingPreviewView,
  landingPreviewOf,
} from '@/domain/landing-preview';
import { resolvePeriod, todayIn } from '@/domain/period';
import { SkipLink } from '@/components/shell/skip-link';
import { loadMessages } from '@/i18n/get-messages';
import { createI18n, displayTag, type I18n } from '@/i18n/i18n';
import type { Locale } from '@/i18n/locales';
import { isDemoMode } from '@/lib/api-config';
import { landingIngestionUrl, landingTrackingKey } from '@/lib/landing-measurement-config';
import {
  LANDING_PAGES,
  type LandingPage,
  landingPageOfSlug,
  languageAlternatesOf,
} from '@/lib/landing-pages';
import { APP_NAME, LANDING_ORIGIN } from '@/lib/site';
import './landing.css';
import { DEMO_STORE } from '@/services/demo/demo-projects';
import { createOverviewService } from '@/services/overview/overview-service.factory';

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

async function demoPreviewOf(i18n: I18n): Promise<LandingPreviewView> {
  const now = new Date();
  const period = resolvePeriod({ range: LANDING_PREVIEW_RANGE }, DEMO_STORE.timezone, now);
  const report = await createOverviewService().overview(DEMO_STORE.id, {
    from: period.from,
    to: period.to,
  });
  return landingPreviewOf(
    report,
    period,
    todayIn(DEMO_STORE.timezone, now),
    DEMO_STORE.conversionEvent,
    i18n,
  );
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
  const trackingKey = landingTrackingKey();
  return (
    <div className="flex min-h-dvh flex-col bg-bg text-ink">
      <SkipLink i18n={i18n} />
      <SiteHeader
        i18n={i18n}
        homeHref={page.path}
        language={<LanguageLinks current={page} label={i18n.t('landing.nav.language')} />}
        theme={<ThemeToggle remember="device" />}
        withSignIn
      />
      <MainContent className="grow">
        <LandingHero i18n={i18n} preview={await demoPreviewOf(i18n)} />
        <NeverStoredSection i18n={i18n} />
        <DashboardAnswersSection i18n={i18n} />
        <InstallSection i18n={i18n} />
        <InProductionSection i18n={i18n} />
        <BuiltInPublicSection i18n={i18n} />
        <ArchitectureSection i18n={i18n} />
        <ComparisonSection i18n={i18n} />
        <FaqSection i18n={i18n} />
        <StorySection i18n={i18n} />
      </MainContent>
      <LandingFooter
        i18n={i18n}
        note={
          trackingKey === undefined ? null : <MeasurementNote labels={measurementLabelsOf(i18n)} />
        }
      />
      {trackingKey === undefined ? null : (
        <LandingMeasurementBoot
          trackingKey={trackingKey}
          endpoint={landingIngestionUrl()}
          labels={recordedLabelsOf(i18n)}
          locale={displayTag(page.locale)}
        />
      )}
      <LandingStructuredData i18n={i18n} page={page} />
    </div>
  );
}
