import type { ReactNode } from 'react';
import { LogoMark } from '@/components/brand/logo-mark';
import { FOCUS_RING } from '@/components/ui/control-classes';
import type { I18n } from '@/i18n/i18n';
import { APP_NAME } from '@/lib/site';
import { HeaderMenu } from './header-menu';
import { LANDING_WIDTH, LINK_MENU, LINK_QUIET, LINK_SMALL } from './landing-classes';
import { ASK_CLAUDE_ID, INSTALL_ID, LANDING_LINKS, PRICING_ID } from './landing-links';
import { LANDING_EVENTS, trackAttributes } from './measurement/landing-events';
import { NEVER_STORED_ID } from './never-stored-section';

export interface SiteHeaderProps {
  readonly i18n: I18n;
  readonly homeHref: string;
  readonly onHomePage: boolean;
  readonly language: ReactNode;
  readonly theme: ReactNode;
  readonly withSignIn: boolean;
}

interface HeaderLink {
  readonly href: string;
  readonly label: string;
  readonly tracking: Readonly<Record<string, string>>;
}

const FROM_THE_HEADER = { from: 'header' } as const;
const LINKS_IN_A_ROW = 'ml-1 hidden items-center gap-4 text-sm lg:flex';
const LINKS_IN_A_MENU = 'hidden md:block lg:hidden';

export function SiteHeader({
  i18n,
  homeHref,
  onHomePage,
  language,
  theme,
  withSignIn,
}: SiteHeaderProps) {
  const { t } = i18n;
  const sectionHref = (id: string): string => `${onHomePage ? '' : homeHref}#${id}`;
  const links: readonly HeaderLink[] = [
    {
      href: LANDING_LINKS.demo,
      label: t('landing.nav.demo'),
      tracking: trackAttributes(LANDING_EVENTS.demoOpened, FROM_THE_HEADER),
    },
    { href: sectionHref(NEVER_STORED_ID), label: t('landing.nav.privacy'), tracking: {} },
    {
      href: sectionHref(ASK_CLAUDE_ID),
      label: t('landing.nav.claude'),
      tracking: trackAttributes(LANDING_EVENTS.askClaudeOpened, FROM_THE_HEADER),
    },
    {
      href: sectionHref(INSTALL_ID),
      label: t('landing.nav.install'),
      tracking: trackAttributes(LANDING_EVENTS.installOpened, FROM_THE_HEADER),
    },
    {
      href: sectionHref(PRICING_ID),
      label: t('landing.nav.pricing'),
      tracking: trackAttributes(LANDING_EVENTS.pricingOpened, FROM_THE_HEADER),
    },
  ];
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-bg/85 backdrop-blur-md">
      <div
        className={`${LANDING_WIDTH} flex min-h-16 flex-wrap items-center gap-x-3 gap-y-2 py-2.5 sm:gap-x-4`}
      >
        <a
          href={homeHref}
          className={`flex items-center gap-2.5 rounded-control text-lg font-bold tracking-tight ${FOCUS_RING}`}
        >
          <LogoMark size={28} />
          {APP_NAME}
        </a>
        <nav aria-label={t('landing.nav.label')} className={LINKS_IN_A_ROW}>
          {links.map((link) => (
            <a key={link.href} href={link.href} className={LINK_QUIET} {...link.tracking}>
              {link.label}
            </a>
          ))}
        </nav>
        <div className="ml-auto flex flex-wrap items-center justify-end gap-2">
          {language}
          {theme}
          {withSignIn ? (
            <a href={LANDING_LINKS.signIn} className={LINK_SMALL}>
              {t('landing.nav.signIn')}
            </a>
          ) : null}
          <HeaderMenu label={t('landing.nav.menu')} className={LINKS_IN_A_MENU}>
            <nav aria-label={t('landing.nav.label')}>
              <ul className="flex flex-col gap-0.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className={LINK_MENU} {...link.tracking}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </HeaderMenu>
        </div>
      </div>
    </header>
  );
}
