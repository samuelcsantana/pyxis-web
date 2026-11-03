import type { I18n } from '@/i18n/i18n';
import { landingPageOfLocale, landingUrlOf } from '@/lib/landing-pages';
import { DEMO_SIGN_UP_URL } from './demo-links';

export interface DemoBannerProps {
  readonly i18n: I18n;
  readonly belowPhoneBar?: boolean;
}

const LINK_FOCUS =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-ink';
const BUTTON = `inline-flex min-h-8 items-center rounded-control px-3 text-xs font-semibold whitespace-nowrap sm:text-sm ${LINK_FOCUS}`;

export function DemoBanner({ i18n, belowPhoneBar = false }: DemoBannerProps) {
  const landing = landingUrlOf(landingPageOfLocale(i18n.locale));
  return (
    <aside
      data-demo-notice
      aria-label={i18n.t('demo.label')}
      className={`sticky z-20 shadow-sm ${belowPhoneBar ? 'top-14 lg:top-0' : 'top-0'}`}
    >
      <div
        role="note"
        className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 bg-accent px-4 py-1.5 text-center text-xs font-medium text-accent-ink sm:text-sm lg:h-(--demo-notice-height) lg:flex-nowrap lg:py-0"
      >
        <p>
          {i18n.t('demo.notice')}{' '}
          <a
            href={landing}
            className={`font-semibold underline underline-offset-2 hover:decoration-2 ${LINK_FOCUS}`}
          >
            {i18n.t('demo.homePage')}
          </a>
        </p>
        <p className="flex flex-wrap justify-center gap-2">
          <a
            href={landing}
            className={`${BUTTON} border border-accent-ink/40 hover:bg-accent-ink/10`}
          >
            {i18n.t('demo.exit')}
          </a>
          <a href={DEMO_SIGN_UP_URL} className={`${BUTTON} bg-accent-ink text-accent`}>
            {i18n.t('demo.signUp')}
          </a>
        </p>
      </div>
    </aside>
  );
}
