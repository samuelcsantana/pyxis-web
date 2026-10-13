'use client';

import { useEffect, useState } from 'react';
import { CONTROL_TRANSITION, NAV_FOCUS_RING } from '@/components/ui/control-classes';

export interface CopyCodeLabels {
  readonly copy: string;
  readonly copied: string;
  readonly selected: string;
}

export interface CopyCodeButtonProps {
  readonly code: string;
  readonly targetId: string;
  readonly labels: CopyCodeLabels;
  readonly track?: Readonly<Record<string, string>>;
}

type CopyState = 'idle' | 'copied' | 'selected';

export const COPY_STATE_MS = 1_600;

function selectContents(targetId: string): void {
  const target = document.getElementById(targetId);
  const selection = window.getSelection();
  if (target === null || selection === null) {
    return;
  }
  const range = document.createRange();
  range.selectNodeContents(target);
  selection.removeAllRanges();
  selection.addRange(range);
}

function labelOf(state: CopyState, labels: CopyCodeLabels): string {
  return state === 'idle' ? labels.copy : labels[state];
}

export function CopyCodeButton({ code, targetId, labels, track = {} }: CopyCodeButtonProps) {
  const [state, setState] = useState<CopyState>('idle');

  useEffect(() => {
    if (state === 'idle') {
      return;
    }
    const timer = setTimeout(() => {
      setState('idle');
    }, COPY_STATE_MS);
    return () => {
      clearTimeout(timer);
    };
  }, [state]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setState('copied');
    } catch (error) {
      console.warn('install: could not copy the code, selecting it instead', error);
      selectContents(targetId);
      setState('selected');
    }
  };

  return (
    <button
      type="button"
      {...track}
      onClick={() => {
        void copy();
      }}
      className={`absolute top-2.5 right-2.5 h-8 rounded-control border border-nav-border bg-nav-raised px-2.5 text-caption font-semibold text-nav-strong hover:bg-nav-hover active:bg-nav-active ${NAV_FOCUS_RING} ${CONTROL_TRANSITION}`}
    >
      <span aria-live="polite">{labelOf(state, labels)}</span>
    </button>
  );
}
