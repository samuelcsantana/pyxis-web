import { LogoMark } from '@/components/brand/logo-mark';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import type { I18n } from '@/i18n/i18n';
import type { LandingPage } from '@/lib/landing-pages';
import { APP_NAME } from '@/lib/site';
import { FOCUS_RING } from '@/components/ui/control-classes';
import { LANDING_WIDTH, LINK_QUIET, LINK_SMALL } from './landing-classes';
import { LANDING_LINKS, PROPER_NAMES } from './landing-links';
import { LanguageLinks } from './language-links';
import { NEVER_STORED_ID } from './never-stored-section';

export interface LandingHeaderProps {
  readonly i18n: I18n;
  readonly page: LandingPage;
}

export function LandingHeader({ i18n, page }: LandingHeaderProps) {
  const { t } = i18n;
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-bg/85 backdrop-blur-md">
      <div className={`${LANDING_WIDTH} flex h-16 items-center gap-5`}>
        <a
          href={page.path}
          className={`flex items-center gap-2.5 rounded-control text-lg font-bold tracking-tight ${FOCUS_RING}`}
        >
          <LogoMark size={28} />
          {APP_NAME}
        </a>
        <nav
          aria-label={t('landing.nav.label')}
          className="ml-3 hidden items-center gap-5 text-sm md:flex"
        >
          <a href={LANDING_LINKS.demo} className={LINK_QUIET}>
            {t('landing.nav.demo')}
          </a>
          <a href={`#${NEVER_STORED_ID}`} className={LINK_QUIET}>
            {t('landing.nav.privacy')}
          </a>
          <a href={LANDING_LINKS.api} className={LINK_QUIET}>
            {PROPER_NAMES.gitHub}
          </a>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <LanguageLinks current={page} label={t('landing.nav.language')} />
          <ThemeToggle remember="device" />
          <a href={LANDING_LINKS.signIn} className={LINK_SMALL}>
            {t('landing.nav.signIn')}
          </a>
        </div>
      </div>
    </header>
  );
}
