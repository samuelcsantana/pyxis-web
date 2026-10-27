import type { SignUpOffer } from '@/domain/sign-up';
import type { I18n } from '@/i18n/i18n';
import { landingDescriptionOf } from '@/lib/landing-description';
import { type LandingPage, landingUrlOf } from '@/lib/landing-pages';
import { APP_NAME } from '@/lib/site';
import { LANDING_LINKS } from './landing-links';

export interface LandingStructuredDataProps {
  readonly i18n: I18n;
  readonly page: LandingPage;
  readonly offer: SignUpOffer;
}

const MIT_LICENSE = 'https://opensource.org/licenses/MIT';

export function softwareApplicationOf(i18n: I18n, page: LandingPage, offer: SignUpOffer) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: APP_NAME,
    description: landingDescriptionOf(i18n, offer),
    url: landingUrlOf(page),
    inLanguage: page.locale,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web',
    license: MIT_LICENSE,
    isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    sameAs: [LANDING_LINKS.api, LANDING_LINKS.sdk, LANDING_LINKS.web, LANDING_LINKS.npm],
  } as const;
}

export function jsonForScript(value: unknown): string {
  return JSON.stringify(value).replaceAll('<', '\\u003c');
}

export function LandingStructuredData({ i18n, page, offer }: LandingStructuredDataProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonForScript(softwareApplicationOf(i18n, page, offer)) }}
    />
  );
}
