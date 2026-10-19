import { LogoMark } from '@/components/brand/logo-mark';
import type { ReactNode } from 'react';
import { LEGAL_DOCUMENT_TITLES } from '@/components/legal/legal-titles';
import { SellerLine } from '@/components/legal/seller-line';
import type { I18n } from '@/i18n/i18n';
import type { Seller } from '@/lib/legal-config';
import { CONTRACT_LANGUAGE, legalDocumentsIn } from '@/lib/legal-documents';
import { APP_NAME } from '@/lib/site';
import { LANDING_WIDTH, LINK_LIST } from './landing-classes';
import { CONTACT_EMAIL, LANDING_LINKS, PROPER_NAMES } from './landing-links';
import { LANDING_EVENTS, trackAttributes } from './measurement/landing-events';
import { PRICING_ID } from './pricing-section';

export interface LandingFooterProps {
  readonly i18n: I18n;
  readonly note?: ReactNode;
  readonly seller?: Seller;
}

interface FooterLink {
  readonly href: string;
  readonly label: string;
  readonly hrefLang?: string;
  readonly track?: Readonly<Record<string, string>>;
}

function codeLink(href: string, label: string): FooterLink {
  return { href, label, track: trackAttributes(LANDING_EVENTS.codeOpened, { repo: label }) };
}

interface FooterColumnProps {
  readonly title: string;
  readonly links: readonly FooterLink[];
  readonly note?: string;
}

const THREE_COLUMNS = 'md:grid-cols-[1.4fr_repeat(3,minmax(0,1fr))]';
const FOUR_COLUMNS = 'md:grid-cols-[1.4fr_repeat(4,minmax(0,1fr))]';

function FooterColumn({ title, links, note }: FooterColumnProps) {
  return (
    <div className="hyphens-auto wrap-anywhere">
      <h2 className="mb-2.5 text-micro font-semibold tracking-[0.08em] text-muted uppercase">
        {title}
      </h2>
      <ul className="grid gap-2 text-sm">
        {links.map((link) => (
          <li key={link.href}>
            <a href={link.href} hrefLang={link.hrefLang} className={LINK_LIST} {...link.track}>
              {link.label}
            </a>
          </li>
        ))}
      </ul>
      {note === undefined ? null : <p className="mt-2.5 text-caption text-muted">{note}</p>}
    </div>
  );
}

function contractLinks(i18n: I18n): readonly FooterLink[] {
  return legalDocumentsIn(i18n.locale).map((document) => ({
    href: document.path,
    label: i18n.t(LEGAL_DOCUMENT_TITLES[document.kind]),
    hrefLang: document.locale,
  }));
}

export function LandingFooter({ i18n, note, seller }: LandingFooterProps) {
  const { t } = i18n;
  return (
    <footer className="border-t border-line">
      <div
        className={`${LANDING_WIDTH} grid gap-7 pt-10 pb-6 ${seller === undefined ? THREE_COLUMNS : FOUR_COLUMNS}`}
      >
        <div className="flex flex-col gap-2.5">
          <p className="flex items-center gap-2 text-base font-bold tracking-tight">
            <LogoMark size={24} />
            {APP_NAME}
          </p>
          <p className="max-w-xs text-sm text-muted">{t('landing.footer.tagline')}</p>
        </div>
        <FooterColumn
          title={t('landing.footer.product')}
          links={[
            {
              href: LANDING_LINKS.demo,
              label: t('landing.footer.demo'),
              track: trackAttributes(LANDING_EVENTS.demoOpened, { from: 'footer' }),
            },
            {
              href: `#${PRICING_ID}`,
              label: t('landing.footer.pricing'),
              track: trackAttributes(LANDING_EVENTS.pricingOpened, { from: 'footer' }),
            },
            { href: LANDING_LINKS.storybook, label: PROPER_NAMES.storybook },
            { href: LANDING_LINKS.apiReference, label: t('landing.footer.apiReference') },
            { href: LANDING_LINKS.playground, label: t('landing.footer.playground') },
          ]}
        />
        <FooterColumn
          title={t('landing.footer.code')}
          links={[
            codeLink(LANDING_LINKS.api, PROPER_NAMES.api),
            codeLink(LANDING_LINKS.sdk, PROPER_NAMES.sdk),
            codeLink(LANDING_LINKS.web, PROPER_NAMES.web),
            codeLink(LANDING_LINKS.npm, PROPER_NAMES.npm),
          ]}
        />
        <FooterColumn
          title={t('landing.footer.author')}
          links={[
            { href: LANDING_LINKS.author, label: PROPER_NAMES.author },
            { href: `mailto:${CONTACT_EMAIL}`, label: CONTACT_EMAIL },
          ]}
        />
        {seller === undefined ? null : (
          <FooterColumn
            title={t('landing.footer.contract')}
            links={contractLinks(i18n)}
            note={
              i18n.locale === CONTRACT_LANGUAGE ? undefined : t('landing.footer.contractLanguage')
            }
          />
        )}
      </div>
      <div className={`${LANDING_WIDTH} pb-24`}>
        <div className="flex flex-col gap-2 border-t border-line pt-5 lg:flex-row lg:items-center lg:justify-between">
          {note}
          <p className="text-caption text-muted">{t('landing.footer.madeBy')}</p>
        </div>
        {seller === undefined ? null : (
          <div className="pt-3">
            <SellerLine i18n={i18n} seller={seller} />
          </div>
        )}
      </div>
    </footer>
  );
}
