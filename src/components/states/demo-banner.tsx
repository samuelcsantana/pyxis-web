import type { I18n } from '@/i18n/i18n';
import { landingPageOfLocale, landingUrlOf } from '@/lib/landing-pages';

export interface DemoBannerProps {
  readonly i18n: I18n;
}

export function DemoBanner({ i18n }: DemoBannerProps) {
  return (
    <aside aria-label={i18n.t('demo.label')}>
      <p
        role="note"
        className="bg-accent px-4 py-1.5 text-center text-xs font-medium text-accent-ink sm:py-2 sm:text-sm"
      >
        {i18n.t('demo.notice')}{' '}
        <a
          href={landingUrlOf(landingPageOfLocale(i18n.locale))}
          className="font-semibold underline underline-offset-2 hover:decoration-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-ink"
        >
          {i18n.t('demo.homePage')}
        </a>
      </p>
    </aside>
  );
}
