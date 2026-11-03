import type { I18n } from '@/i18n/i18n';
import { landingPageOfLocale, landingUrlOf } from '@/lib/landing-pages';
import { NavItemIcon, navItemClasses } from './nav-item';

export interface DemoExitLinkProps {
  readonly i18n: I18n;
}

const EXIT_ICON = 'M15 6l-6 6 6 6';

export function DemoExitLink({ i18n }: DemoExitLinkProps) {
  return (
    <a href={landingUrlOf(landingPageOfLocale(i18n.locale))} className={navItemClasses(false)}>
      <NavItemIcon path={EXIT_ICON} current={false} />
      <span>{i18n.t('demo.exit')}</span>
    </a>
  );
}
