'use client';

import { useEffect } from 'react';
import { countFrame, easeOut } from '@/domain/count-up';

export interface PreviewCountUpProps {
  readonly targetId: string;
  readonly locale: string;
}

export const COUNT_UP_MS = 900;
const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';
const COUNTED = '[data-count]';

function stillRising(target: HTMLElement): boolean {
  return target.getAnimations().some((animation) => animation.playState === 'running');
}

export function PreviewCountUp({ targetId, locale }: PreviewCountUpProps) {
  useEffect(() => {
    const target = document.getElementById(targetId);
    if (target === null || window.matchMedia(REDUCED_MOTION).matches || !stillRising(target)) {
      return;
    }
    const counted = [...target.querySelectorAll<HTMLElement>(COUNTED)].map((element) => ({
      element,
      final: element.textContent,
    }));
    const started = performance.now();
    let frame = 0;
    const draw = (now: number) => {
      const progress = Math.min(1, (now - started) / COUNT_UP_MS);
      for (const { element, final } of counted) {
        element.textContent = countFrame(final, easeOut(progress), locale);
      }
      if (progress < 1) {
        frame = requestAnimationFrame(draw);
      }
    };
    frame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frame);
      for (const { element, final } of counted) {
        element.textContent = final;
      }
    };
  }, [targetId, locale]);

  return null;
}
