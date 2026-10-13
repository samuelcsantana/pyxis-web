import { SEGMENTED_GROUP, SEGMENTED_IDLE, SEGMENTED_OPTION } from '@/components/ui/control-classes';
import { localeCode, localeName } from '@/i18n/locales';
import { LANDING_PAGES, type LandingPage } from '@/lib/landing-pages';
import { LANDING_EVENTS, trackAttributes } from './measurement/landing-events';

export interface LanguageLinksProps {
  readonly current: LandingPage;
  readonly label: string;
}

export const LANGUAGE_THUMB = 'landing-language-thumb';

export function LanguageLinks({ current, label }: LanguageLinksProps) {
  return (
    <nav aria-label={label}>
      <ul className={SEGMENTED_GROUP}>
        {LANDING_PAGES.map((page) => {
          const isCurrent = page.locale === current.locale;
          return (
            <li key={page.locale} className="flex">
              <a
                href={page.path}
                hrefLang={page.locale}
                lang={page.locale}
                aria-current={isCurrent ? 'page' : undefined}
                {...trackAttributes(LANDING_EVENTS.languageSwitched, { to: page.locale })}
                className={`isolate h-8 px-2.5 ${SEGMENTED_OPTION} ${isCurrent ? 'text-card' : SEGMENTED_IDLE}`}
              >
                {isCurrent ? (
                  <span
                    aria-hidden="true"
                    data-testid="language-thumb"
                    className={`absolute inset-0 -z-10 rounded-control bg-ink ${LANGUAGE_THUMB}`}
                  />
                ) : null}
                <span className="sr-only sm:not-sr-only">{localeName(page.locale)}</span>
                <span aria-hidden="true" className="sm:hidden">
                  {localeCode(page.locale)}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
