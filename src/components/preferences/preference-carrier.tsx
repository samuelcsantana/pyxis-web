'use client';

import { useEffect } from 'react';
import type { Locale } from '@/i18n/locales';
import { carriedHref } from '@/lib/link-preferences';
import { parseTheme } from '@/lib/theme';

export interface PreferenceCarrierProps {
  readonly locale: Locale;
}

const LINKS = 'a[href^="https://"]';

function carryToEveryLink(locale: Locale): void {
  const preferences = {
    locale,
    theme: parseTheme(document.documentElement.dataset.theme),
    currentHost: window.location.hostname,
  };
  for (const link of document.querySelectorAll<HTMLAnchorElement>(LINKS)) {
    const carried = carriedHref(link.href, preferences);
    if (carried !== undefined) {
      link.href = carried;
    }
  }
}

export function PreferenceCarrier({ locale }: PreferenceCarrierProps) {
  useEffect(() => {
    carryToEveryLink(locale);
    const observer = new MutationObserver(() => {
      carryToEveryLink(locale);
    });
    observer.observe(document.documentElement, { attributeFilter: ['data-theme'] });
    return () => {
      observer.disconnect();
    };
  }, [locale]);

  return null;
}
