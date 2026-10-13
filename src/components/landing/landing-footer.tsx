import { LogoMark } from '@/components/brand/logo-mark';
import type { I18n } from '@/i18n/i18n';
import { APP_NAME } from '@/lib/site';
import { LANDING_WIDTH, LINK_LIST } from './landing-classes';
import { LANDING_LINKS, PROPER_NAMES } from './landing-links';

export interface LandingFooterProps {
  readonly i18n: I18n;
}

interface FooterLink {
  readonly href: string;
  readonly label: string;
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
            <a href={link.href} className={LINK_LIST}>
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function LandingFooter({ i18n }: LandingFooterProps) {
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
            { href: LANDING_LINKS.demo, label: t('landing.footer.demo') },
            { href: LANDING_LINKS.storybook, label: PROPER_NAMES.storybook },
            { href: LANDING_LINKS.apiReference, label: t('landing.footer.apiReference') },
            { href: LANDING_LINKS.playground, label: t('landing.footer.playground') },
          ]}
        />
        <FooterColumn
          title={t('landing.footer.code')}
          links={[
            { href: LANDING_LINKS.api, label: PROPER_NAMES.api },
            { href: LANDING_LINKS.sdk, label: PROPER_NAMES.sdk },
            { href: LANDING_LINKS.web, label: PROPER_NAMES.web },
            { href: LANDING_LINKS.npm, label: PROPER_NAMES.npm },
          ]}
        />
        <FooterColumn
          title={t('landing.footer.author')}
          links={[{ href: LANDING_LINKS.author, label: PROPER_NAMES.author }]}
        />
      </div>
      <div className={`${LANDING_WIDTH} pb-10`}>
        <p className="border-t border-line pt-5 text-caption text-muted">
          {t('landing.footer.madeBy')}
        </p>
      </div>
    </footer>
  );
}
