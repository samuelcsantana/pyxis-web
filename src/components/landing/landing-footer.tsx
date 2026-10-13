import { LogoMark } from '@/components/brand/logo-mark';
import type { ReactNode } from 'react';
import type { I18n } from '@/i18n/i18n';
import { APP_NAME } from '@/lib/site';
import { LANDING_WIDTH, LINK_LIST } from './landing-classes';
import { LANDING_LINKS, PROPER_NAMES } from './landing-links';
import { LANDING_EVENTS, trackAttributes } from './measurement/landing-events';

export interface LandingFooterProps {
  readonly i18n: I18n;
  readonly note?: ReactNode;
}

interface FooterLink {
  readonly href: string;
  readonly label: string;
  readonly track?: Readonly<Record<string, string>>;
}

function codeLink(href: string, label: string): FooterLink {
  return { href, label, track: trackAttributes(LANDING_EVENTS.codeOpened, { repo: label }) };
}

interface FooterColumnProps {
  readonly title: string;
  readonly links: readonly FooterLink[];
}

function FooterColumn({ title, links }: FooterColumnProps) {
  return (
    <div>
      <h2 className="mb-2.5 text-micro font-semibold tracking-[0.08em] text-muted uppercase">
        {title}
      </h2>
      <ul className="grid gap-2 text-sm">
        {links.map((link) => (
          <li key={link.href}>
            <a href={link.href} className={LINK_LIST} {...link.track}>
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function LandingFooter({ i18n, note }: LandingFooterProps) {
  const { t } = i18n;
  return (
    <footer className="border-t border-line">
      <div
        className={`${LANDING_WIDTH} grid gap-7 pt-10 pb-6 md:grid-cols-[1.4fr_repeat(3,minmax(0,1fr))]`}
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
          links={[{ href: LANDING_LINKS.author, label: PROPER_NAMES.author }]}
        />
      </div>
      <div className={`${LANDING_WIDTH} pb-24`}>
        <div className="flex flex-col gap-2 border-t border-line pt-5 lg:flex-row lg:items-center lg:justify-between">
          {note}
          <p className="text-caption text-muted">{t('landing.footer.madeBy')}</p>
        </div>
      </div>
    </footer>
  );
}
