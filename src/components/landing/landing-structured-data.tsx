import { PLAN_PRICE_IN_REAIS } from '@/domain/approximate-price';
import { offersTheFreePlan, type SignUpOffer } from '@/domain/sign-up';
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
const PLAN_CURRENCY = 'BRL';

const HOBBY_OFFER = {
  '@type': 'Offer',
  name: 'Hobby',
  price: '0',
  priceCurrency: PLAN_CURRENCY,
} as const;
const PRO_OFFER = {
  '@type': 'Offer',
  name: 'Pro',
  price: String(PLAN_PRICE_IN_REAIS.month),
  priceCurrency: PLAN_CURRENCY,
} as const;

function offersOf(offer: SignUpOffer) {
  return offersTheFreePlan(offer) ? [HOBBY_OFFER, PRO_OFFER] : [PRO_OFFER];
}

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
    offers: offersOf(offer),
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
