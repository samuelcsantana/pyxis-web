'use client';

import { useEffect } from 'react';
import { bestEffortCarrySection } from '@/lib/carried-section';

export const SECTIONS = 'main section[id]';
export const SECTION_KEEPING_LINKS = 'a[data-keeps-section]';
export const READING_LINE = 0.35;
const PREFETCH_RULES = 'speculationrules';

export function currentSectionId(sections: readonly Element[], viewportHeight: number): string {
  const line = viewportHeight * READING_LINE;
  const reached = sections.filter((section) => section.getBoundingClientRect().top <= line);
  return reached.at(-1)?.id ?? '';
}

function addressWith(hash: string): string {
  const { pathname, search } = window.location;
  return `${pathname}${search}${hash === '' ? '' : `#${hash}`}`;
}

function carrySectionThrough(event: MouseEvent): void {
  if (!(event.target instanceof Element)) {
    return;
  }
  const link = event.target.closest<HTMLAnchorElement>(SECTION_KEEPING_LINKS);
  if (link === null) {
    return;
  }
  if (HTMLScriptElement.supports(PREFETCH_RULES)) {
    bestEffortCarrySection(`${link.pathname}${window.location.hash}`);
  } else {
    link.hash = window.location.hash;
  }
}

export function SectionHashSync() {
  useEffect(() => {
    let frame = 0;
    const sync = () => {
      frame = 0;
      const id = currentSectionId([...document.querySelectorAll(SECTIONS)], window.innerHeight);
      if (window.location.hash.slice(1) !== id) {
        window.history.replaceState(window.history.state, '', addressWith(id));
      }
    };
    const onScroll = () => {
      if (frame === 0) {
        frame = window.requestAnimationFrame(sync);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('click', carrySectionThrough);
    return () => {
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('click', carrySectionThrough);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
