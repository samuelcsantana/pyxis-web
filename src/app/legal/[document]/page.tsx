import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LandingFooter } from '@/components/landing/landing-footer';
import { SiteHeader } from '@/components/landing/site-header';
import { LegalDocumentView } from '@/components/legal/legal-document-view';
import { LEGAL_DOCUMENT_TITLES } from '@/components/legal/legal-titles';
import { PreferenceCarrier } from '@/components/preferences/preference-carrier';
import { MainContent } from '@/components/shell/main-content';
import { SkipLink } from '@/components/shell/skip-link';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { loadMessages } from '@/i18n/get-messages';
import { createI18n, type I18n } from '@/i18n/i18n';
import { isDemoMode } from '@/lib/api-config';
import { type LegalConfig, legalConfig, TERMS_VERSION } from '@/lib/legal-config';
import {
  type LegalDocument,
  legalDocumentOfSlug,
  legalUrlOf,
  versionsOf,
} from '@/lib/legal-documents';
import { legalSourceOf } from '@/lib/legal-source';
import { legalHtmlOf, legalTextOf } from '@/lib/legal-text';
import { landingPageOfLocale } from '@/lib/landing-pages';
import { LANDING_ORIGIN } from '@/lib/site';
import './legal.css';

export interface LegalPageProps {
  readonly params: Promise<{ readonly document: string }>;
}

interface LegalPage {
  readonly document: LegalDocument;
  readonly config: LegalConfig;
  readonly i18n: I18n;
}

async function legalPageOf(params: LegalPageProps['params']): Promise<LegalPage | undefined> {
  const document = legalDocumentOfSlug((await params).document);
  const config = legalConfig();
  if (document === undefined || config === null || !isDemoMode()) {
    return undefined;
  }
  return {
    document,
    config,
    i18n: createI18n(document.locale, await loadMessages(document.locale)),
  };
}

export async function generateMetadata({ params }: LegalPageProps): Promise<Metadata> {
  const page = await legalPageOf(params);
  if (page === undefined) {
    return {};
  }
  const { document, i18n } = page;
  const title = i18n.t(LEGAL_DOCUMENT_TITLES[document.kind]);
  return {
    metadataBase: new URL(LANDING_ORIGIN),
    title,
    description: i18n.t('legal.metaDescription', { document: title, version: TERMS_VERSION }),
    alternates: {
      canonical: document.path,
      languages: Object.fromEntries(
        versionsOf(document).map((version) => [version.locale, legalUrlOf(version)]),
      ),
    },
  };
}

export default async function LegalDocumentPage({ params }: LegalPageProps) {
  const page = await legalPageOf(params);
  if (page === undefined) {
    notFound();
  }
  const { document, config, i18n } = page;
  const html = legalHtmlOf(
    legalTextOf(await legalSourceOf(document), config, document.locale),
    document.locale,
  );
  return (
    <div className="flex min-h-dvh flex-col bg-bg text-ink">
      <SkipLink i18n={i18n} />
      <SiteHeader
        i18n={i18n}
        homeHref={landingPageOfLocale(document.locale).path}
        language={null}
        theme={<ThemeToggle remember="device" />}
        withSignIn
      />
      <MainContent className="grow">
        <LegalDocumentView i18n={i18n} current={document} html={html} />
      </MainContent>
      <LandingFooter i18n={i18n} seller={config.seller} />
      <PreferenceCarrier locale={document.locale} />
    </div>
  );
}
