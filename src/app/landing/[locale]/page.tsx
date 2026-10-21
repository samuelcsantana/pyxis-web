import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArchitectureSection } from '@/components/landing/architecture-section';
import { LazyAskClaudeNudge } from '@/components/landing/lazy-ask-claude-nudge';
import { NUDGE_TIPS } from '@/components/landing/nudge-tips';
import { AskClaudeSection } from '@/components/landing/ask-claude-section';
import { CarriedSectionScript } from '@/components/landing/carried-section-script';
import { LandingBootScript } from '@/components/landing/landing-boot-script';
import { BuiltInPublicSection } from '@/components/landing/built-in-public-section';
import { ComparisonSection } from '@/components/landing/comparison-section';
import { DashboardAnswersSection } from '@/components/landing/dashboard-answers-section';
import { FaqSection } from '@/components/landing/faq-section';
import { InProductionSection } from '@/components/landing/in-production-section';
import { InstallSection } from '@/components/landing/install-section';
import { LandingFooter } from '@/components/landing/landing-footer';
import { LandingHero } from '@/components/landing/landing-hero';
import { LandingStructuredData } from '@/components/landing/landing-structured-data';
import { LandingLanguageSelect } from '@/components/landing/landing-language-select';
import { LanguageChoiceKeeper } from '@/components/landing/language-choice-keeper';
import { LanguagePrefetch } from '@/components/landing/language-prefetch';
import { LandingMeasurementBoot } from '@/components/landing/measurement/landing-measurement-boot';
import {
  measurementLabelsOf,
  recordedLabelsOf,
} from '@/components/landing/measurement/measurement-labels';
import { MeasurementNote } from '@/components/landing/measurement/measurement-note';
import { NeverStoredSection } from '@/components/landing/never-stored-section';
import { PricingSection } from '@/components/landing/pricing-section';
import { SectionGlide } from '@/components/landing/section-glide';
import { SectionHashSync } from '@/components/landing/section-hash-sync';
import { SiteHeader } from '@/components/landing/site-header';
import { StorySection } from '@/components/landing/story-section';
import { LinkPreferencesReceiver } from '@/components/preferences/link-preferences-receiver';
import { PreferenceCarrier } from '@/components/preferences/preference-carrier';
import { MainContent } from '@/components/shell/main-content';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import {
  LANDING_PREVIEW_RANGE,
  type LandingPreviewView,
  landingPreviewOf,
} from '@/domain/landing-preview';
import { DEFAULT_FUNNEL_MODE } from '@/domain/funnel';
import { resolvePeriod, todayIn } from '@/domain/period';
import { SkipLink } from '@/components/shell/skip-link';
import { loadMessages } from '@/i18n/get-messages';
import { createI18n, displayTag, type I18n } from '@/i18n/i18n';
import type { Locale } from '@/i18n/locales';
import { isDemoMode } from '@/lib/api-config';
import { landingIngestionUrl, landingTrackingKey } from '@/lib/landing-measurement-config';
import { legalConfig } from '@/lib/legal-config';
import { requestNonce } from '@/lib/request-nonce';
import { bestEffortEuroRates } from '@/lib/landing-exchange-rates';
import { bestEffortSignUpIsOpen } from '@/lib/landing-sign-up';
import {
  LANDING_PAGES,
  type LandingPage,
  landingPageOfSlug,
  languageAlternatesOf,
} from '@/lib/landing-pages';
import { APP_NAME, LANDING_ORIGIN } from '@/lib/site';
import './landing.css';
import { DEMO_STORE } from '@/services/demo/demo-projects';
import { DEMO_FUNNEL_STEPS } from '@/services/funnel/demo-funnel';
import { createFunnelService } from '@/services/funnel/funnel-service.factory';
import { createOverviewService } from '@/services/overview/overview-service.factory';
import { createRequestsService } from '@/services/requests/requests-service.factory';

export interface LandingHomeProps {
  readonly params: Promise<{ readonly locale: string }>;
}

interface Landing {
  readonly page: LandingPage;
  readonly i18n: I18n;
}

const OPEN_GRAPH_LOCALES: Readonly<Record<Locale, string>> = {
  en: 'en_US',
  'pt-BR': 'pt_BR',
  es: 'es_ES',
  de: 'de_DE',
  fr: 'fr_FR',
  it: 'it_IT',
  nl: 'nl_NL',
};

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
  const range = { from: period.from, to: period.to };
  const [overview, funnel, writes] = await Promise.all([
    createOverviewService().overview(DEMO_STORE.id, range),
    createFunnelService().funnel(DEMO_STORE.id, range, DEFAULT_FUNNEL_MODE, DEMO_FUNNEL_STEPS),
    createRequestsService().requests(DEMO_STORE.id, range, null),
  ]);
  return landingPreviewOf(
    { overview, funnelSteps: DEMO_FUNNEL_STEPS, funnel, writes },
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
  const [signUpOpen, euroRates] = await Promise.all([
    bestEffortSignUpIsOpen(),
    bestEffortEuroRates(),
  ]);
  const nonce = await requestNonce();
  return (
    <div className="flex min-h-dvh flex-col bg-bg text-ink">
      <LandingBootScript nonce={nonce} />
      <CarriedSectionScript nonce={nonce} />
      <SkipLink i18n={i18n} />
      <SiteHeader
        i18n={i18n}
        homeHref={page.path}
        language={<LandingLanguageSelect current={page} label={i18n.t('landing.nav.language')} />}
        theme={<ThemeToggle remember="device" />}
        withSignIn
      />
      <MainContent className="grow">
        <LandingHero i18n={i18n} preview={await demoPreviewOf(i18n)} signUpOpen={signUpOpen} />
        <NeverStoredSection i18n={i18n} />
        <DashboardAnswersSection i18n={i18n} />
        <AskClaudeSection i18n={i18n} />
        <InstallSection i18n={i18n} signUpOpen={signUpOpen} />
        <InProductionSection i18n={i18n} />
        <BuiltInPublicSection i18n={i18n} />
        <ArchitectureSection i18n={i18n} />
        <ComparisonSection i18n={i18n} />
        <PricingSection i18n={i18n} signUpOpen={signUpOpen} euroRates={euroRates} />
        <FaqSection i18n={i18n} signUpOpen={signUpOpen} />
        <StorySection i18n={i18n} />
      </MainContent>
      <LandingFooter
        i18n={i18n}
        seller={legalConfig()?.seller}
        note={
          trackingKey === undefined ? null : <MeasurementNote labels={measurementLabelsOf(i18n)} />
        }
      />
      <SectionHashSync />
      <LanguageChoiceKeeper />
      <SectionGlide />
      <LazyAskClaudeNudge
        labels={{
          label: i18n.t('landing.nudge.label'),
          badge: i18n.t('landing.nudge.badge'),
          title: i18n.t('landing.nudge.title'),
          tips: NUDGE_TIPS.map((tip) => i18n.t(`landing.nudge.tips.${tip}`)),
          another: i18n.t('landing.nudge.another'),
          cta: i18n.t('landing.nudge.cta'),
          dismiss: i18n.t('landing.nudge.dismiss'),
        }}
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
      <LanguagePrefetch current={page} nonce={nonce} />
      <PreferenceCarrier locale={page.locale} />
      <LinkPreferencesReceiver />
    </div>
  );
}
