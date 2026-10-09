'use client';

import { useCallback, useState } from 'react';

export interface IndicatorFrame {
  readonly left: number;
  readonly top: number;
  readonly width: number;
  readonly height: number;
}

const CHOICE_ATTRIBUTE = 'data-choice';

export function choiceMark(key: string) {
  return { [CHOICE_ATTRIBUTE]: key };
}

function isNotDrawn(element: HTMLElement): boolean {
  return element.offsetWidth === 0 && element.offsetHeight === 0;
}

function frameOf(container: HTMLElement, choice: string): IndicatorFrame | null {
  const chosen = container.querySelector<HTMLElement>(`[${CHOICE_ATTRIBUTE}="${choice}"]`);
  if (chosen === null || isNotDrawn(chosen)) {
    return null;
  }
  return {
    left: chosen.offsetLeft,
    top: chosen.offsetTop,
    width: chosen.offsetWidth,
    height: chosen.offsetHeight,
  };
}

export function useSlidingIndicator(choice: string) {
  const [frame, setFrame] = useState<IndicatorFrame | null>(null);
  const attach = useCallback(
    (container: HTMLElement | null) => {
      if (container === null) {
        return undefined;
      }
      const measure = () => {
        setFrame(frameOf(container, choice));
      };
      measure();
      const observer = new ResizeObserver(measure);
      observer.observe(container);
      return () => {
        observer.disconnect();
      };
    },
    [choice],
  );
  return { attach, frame, sliding: frame === null ? undefined : '' } as const;
}
