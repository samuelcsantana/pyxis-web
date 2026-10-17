'use client';

import {
  closeLanguageSelect,
  LANGUAGE_OPTION,
  LanguageOptionLabel,
  LanguageSelect,
} from '@/components/language/language-select';
import { bestEffortMarkLanguageSwitch, bestEffortRememberLanguageChoice } from '@/lib/landing-boot';
import { LANDING_PAGES, type LandingPage } from '@/lib/landing-pages';
import { LANDING_EVENTS, trackAttributes } from './measurement/landing-events';

export interface LandingLanguageSelectProps {
  readonly current: LandingPage;
  readonly label: string;
}

export function LandingLanguageSelect({ current, label }: LandingLanguageSelectProps) {
  return (
    <LanguageSelect locale={current.locale} label={label}>
      {LANDING_PAGES.map((page) => {
        const isCurrent = page.locale === current.locale;
        return (
          <li key={page.locale}>
            <a
              href={page.path}
              hrefLang={page.locale}
              lang={page.locale}
              {...(isCurrent
                ? { 'aria-current': 'page' as const }
                : {
                    'data-keeps-section': '',
                    ...trackAttributes(LANDING_EVENTS.languageSwitched, { to: page.locale }),
                  })}
              onClick={(event) => {
                bestEffortRememberLanguageChoice(page.locale);
                closeLanguageSelect(event.currentTarget);
                if (isCurrent) {
                  event.preventDefault();
                  return;
                }
                bestEffortMarkLanguageSwitch();
              }}
              className={LANGUAGE_OPTION}
            >
              <LanguageOptionLabel locale={page.locale} current={isCurrent} />
            </a>
          </li>
        );
      })}
    </LanguageSelect>
  );
}
