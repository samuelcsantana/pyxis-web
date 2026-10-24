import type { ReactNode } from 'react';
import { LogoMark } from '@/components/brand/logo-mark';
import { FOCUS_RING } from '@/components/ui/control-classes';
import type { I18n } from '@/i18n/i18n';
import { APP_NAME } from '@/lib/site';
import { LANDING_WIDTH, LINK_QUIET, LINK_SMALL } from './landing-classes';
import { ASK_CLAUDE_ID, LANDING_LINKS, PRICING_ID } from './landing-links';
import { LANDING_EVENTS, trackAttributes } from './measurement/landing-events';
import { NEVER_STORED_ID } from './never-stored-section';

export interface SiteHeaderProps {
  readonly i18n: I18n;
  readonly homeHref: string;
  readonly language: ReactNode;
  readonly theme: ReactNode;
  readonly withSignIn: boolean;
}

export function SiteHeader({ i18n, homeHref, language, theme, withSignIn }: SiteHeaderProps) {
  const { t } = i18n;
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-bg/85 backdrop-blur-md">
      <div
        className={`${LANDING_WIDTH} flex min-h-16 flex-wrap items-center gap-x-3 gap-y-2 py-2.5 sm:gap-x-5`}
      >
        <a
          href={homeHref}
          className={`flex items-center gap-2.5 rounded-control text-lg font-bold tracking-tight ${FOCUS_RING}`}
        >
          <LogoMark size={28} />
          {APP_NAME}
        </a>
        <nav
          aria-label={t('landing.nav.label')}
          className="ml-3 hidden items-center gap-5 text-sm md:flex"
        >
          <a
            href={LANDING_LINKS.demo}
            className={LINK_QUIET}
            {...trackAttributes(LANDING_EVENTS.demoOpened, { from: 'header' })}
          >
            {t('landing.nav.demo')}
          </a>
          <a href={`${homeHref}#${NEVER_STORED_ID}`} className={LINK_QUIET}>
            {t('landing.nav.privacy')}
          </a>
          <a
            href={`${homeHref}#${ASK_CLAUDE_ID}`}
            className={LINK_QUIET}
            {...trackAttributes(LANDING_EVENTS.askClaudeOpened, { from: 'header' })}
          >
            {t('landing.nav.claude')}
          </a>
          <a
            href={`${homeHref}#${PRICING_ID}`}
            className={LINK_QUIET}
            {...trackAttributes(LANDING_EVENTS.pricingOpened, { from: 'header' })}
          >
            {t('landing.nav.pricing')}
          </a>
        </nav>
        <div className="ml-auto flex flex-wrap items-center justify-end gap-2">
          {language}
          {theme}
          {withSignIn ? (
            <a href={LANDING_LINKS.signIn} className={LINK_SMALL}>
              {t('landing.nav.signIn')}
            </a>
          ) : null}
        </div>
      </div>
    </header>
  );
}
