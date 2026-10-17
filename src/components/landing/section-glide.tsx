'use client';

import { useEffect } from 'react';

export const GLIDING_ATTRIBUTE = 'data-gliding';
const SAME_PAGE_LINK = 'a[href^="#"]';

export function SectionGlide() {
  useEffect(() => {
    const root = document.documentElement;
    const land = () => {
      root.removeAttribute(GLIDING_ATTRIBUTE);
    };
    const glide = (event: MouseEvent) => {
      if (event.target instanceof Element && event.target.closest(SAME_PAGE_LINK) !== null) {
        root.setAttribute(GLIDING_ATTRIBUTE, '');
      }
    };
    document.addEventListener('click', glide);
    window.addEventListener('scrollend', land);
    return () => {
      document.removeEventListener('click', glide);
      window.removeEventListener('scrollend', land);
      land();
    };
  }, []);

  return null;
}
