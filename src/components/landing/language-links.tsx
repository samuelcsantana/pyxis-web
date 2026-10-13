import {
  SEGMENTED_GROUP,
  SEGMENTED_IDLE,
  SEGMENTED_OPTION,
  SEGMENTED_SELECTED,
} from '@/components/ui/control-classes';
import { type Locale, localeName } from '@/i18n/locales';
import { LANDING_PAGES, type LandingPage } from '@/lib/landing-pages';

export interface LanguageLinksProps {
  readonly current: LandingPage;
  readonly label: string;
}

const SHORT_NAME_LENGTH = 2;

function shortName(locale: Locale): string {
  return locale.slice(0, SHORT_NAME_LENGTH).toUpperCase();
}

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
                className={`h-8 px-2.5 ${SEGMENTED_OPTION} ${isCurrent ? SEGMENTED_SELECTED : SEGMENTED_IDLE}`}
              >
                <span className="sr-only sm:not-sr-only">{localeName(page.locale)}</span>
                <span aria-hidden="true" className="sm:hidden">
                  {shortName(page.locale)}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
