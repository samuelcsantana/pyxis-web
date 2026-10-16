'use client';

import { useEffect } from 'react';

export const SECTIONS = 'main section[id]';
export const READING_LINE = 0.35;

export function currentSectionId(sections: readonly Element[], viewportHeight: number): string {
  const line = viewportHeight * READING_LINE;
  const reached = sections.filter((section) => section.getBoundingClientRect().top <= line);
  return reached.at(-1)?.id ?? '';
}

function addressWith(hash: string): string {
  const { pathname, search } = window.location;
  return `${pathname}${search}${hash === '' ? '' : `#${hash}`}`;
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
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
