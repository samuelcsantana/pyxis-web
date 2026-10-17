'use client';

import { useEffect } from 'react';
import { closeLanguageSelect } from '@/components/language/close-language-select';
import { parseLocale } from '@/i18n/locales';
import {
  bestEffortMarkLanguageSwitch,
  bestEffortRememberLanguageChoice,
} from '@/lib/language-choice';

export const LANGUAGE_CHOICES = 'a[data-language-choice]';

function keepTheChoice(event: MouseEvent): void {
  if (!(event.target instanceof Element)) {
    return;
  }
  const link = event.target.closest<HTMLAnchorElement>(LANGUAGE_CHOICES);
  if (link === null) {
    return;
  }
  const locale = parseLocale(link.dataset.languageChoice);
  if (locale !== undefined) {
    bestEffortRememberLanguageChoice(locale);
  }
  closeLanguageSelect(link);
  if (link.getAttribute('aria-current') === 'page') {
    event.preventDefault();
    return;
  }
  bestEffortMarkLanguageSwitch();
}

export function LanguageChoiceKeeper() {
  useEffect(() => {
    document.addEventListener('click', keepTheChoice);
    return () => {
      document.removeEventListener('click', keepTheChoice);
    };
  }, []);

  return null;
}
