'use client';

import { useEffect, useState } from 'react';
import { CONTROL_TRANSITION, FOCUS_RING, NAV_FOCUS_RING } from '@/components/ui/control-classes';

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
  readonly placement?: CopyButtonPlacement;
  readonly appearance?: CopyButtonAppearance;
}

export type CopyButtonPlacement = 'corner' | 'inline';

export type CopyButtonAppearance = 'quiet' | 'prominent';

const PLACEMENT_CLASS: Readonly<Record<CopyButtonPlacement, string>> = {
  corner: 'absolute top-2.5 right-2.5',
  inline: 'shrink-0',
};

const APPEARANCE_CLASS: Readonly<Record<CopyButtonAppearance, string>> = {
  quiet: `h-8 rounded-control border border-nav-border bg-nav-raised px-2.5 text-caption font-semibold text-nav-strong hover:bg-nav-hover active:bg-nav-active ${NAV_FOCUS_RING} ${CONTROL_TRANSITION}`,
  prominent: `landing-copy-prominent ${FOCUS_RING}`,
};

const COPY_ICON =
  'M9 11a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-7a2 2 0 0 1-2-2z M5 15V5a2 2 0 0 1 2-2h10';

export const CODE_COPIED_EVENT = 'pyxis:code-copied';

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

export function CopyCodeButton({
  code,
  targetId,
  labels,
  track = {},
  placement = 'corner',
  appearance = 'quiet',
}: CopyCodeButtonProps) {
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
      window.dispatchEvent(new CustomEvent(CODE_COPIED_EVENT, { detail: targetId }));
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
      className={`${PLACEMENT_CLASS[placement]} ${APPEARANCE_CLASS[appearance]}`}
    >
      {appearance === 'prominent' ? (
        <svg width={17} height={17} viewBox="0 0 24 24" aria-hidden="true">
          <path
            d={COPY_ICON}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : null}
      <span aria-live="polite">{labelOf(state, labels)}</span>
    </button>
  );
}
