'use client';

import { useEffect, useRef } from 'react';
import { CONTENT_ID } from '@/components/shell/content-id';
import type { Locale } from '@/i18n/locales';

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';
const REVEAL_MS = 180;
const REVEAL_FRAMES: Keyframe[] = [
  { opacity: 0, translate: '0 0.25rem' },
  { opacity: 1, translate: '0 0' },
];

function revealContent(): void {
  const content = document.getElementById(CONTENT_ID);
  if (content === null || content.getAnimations().length > 0) {
    return;
  }
  if (window.matchMedia(REDUCED_MOTION).matches) {
    return;
  }
  content.animate(REVEAL_FRAMES, { duration: REVEAL_MS, easing: 'ease-out' });
}

export function useRevealWhenTheLanguageArrives(locale: Locale): void {
  const shownLocale = useRef(locale);
  useEffect(() => {
    if (shownLocale.current === locale) {
      return;
    }
    shownLocale.current = locale;
    revealContent();
  }, [locale]);
}
