'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { BUTTON_PRIMARY, BUTTON_SECONDARY } from '@/components/ui/control-classes';
import { useT } from '@/i18n/messages-provider';

export interface NewAccessTokenRevealProps {
  readonly token: string;
  readonly onDone: () => void;
}

export type CopyState = 'idle' | 'copied' | 'selected';

export const COPY_STATE_MS = 1_600;
export const AUTHORIZATION_EXAMPLE = 'Authorization: Bearer pyxis_at_…';

const NOTE = 'text-xs leading-[18px] text-muted';
export const CODE_BOX =
  'min-w-0 flex-[1_1_16rem] rounded-control border border-line bg-card px-3 py-2 font-mono text-sm break-all select-all';

export function selectContents(target: HTMLElement | null): void {
  const selection = window.getSelection();
  if (target === null || selection === null) {
    return;
  }
  const range = document.createRange();
  range.selectNodeContents(target);
  selection.removeAllRanges();
  selection.addRange(range);
}

export function useCopy(text: string, target: () => HTMLElement | null, what: string) {
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
      await navigator.clipboard.writeText(text);
      setState('copied');
    } catch (error) {
      console.warn(`${what}: could not copy it, selecting it instead`, error);
      selectContents(target());
      setState('selected');
    }
  };

  return { state, copy };
}

export function NewAccessTokenReveal({ token, onDone }: NewAccessTokenRevealProps) {
  const t = useT();
  const headingId = useId();
  const heading = useRef<HTMLHeadingElement>(null);
  const tokenBox = useRef<HTMLElement>(null);
  const { state, copy } = useCopy(token, () => tokenBox.current, 'access token');

  useEffect(() => {
    heading.current?.focus();
  }, []);

  const copyLabel = {
    idle: t('accessTokens.copy'),
    copied: t('accessTokens.copied'),
    selected: t('accessTokens.selected'),
  }[state];

  return (
    <div
      role="group"
      aria-labelledby={headingId}
      className="flex flex-col gap-3 rounded-input border border-line bg-soft p-3.5"
    >
      <h3 id={headingId} ref={heading} tabIndex={-1} className="text-sm font-semibold outline-none">
        {t('accessTokens.revealHeading')}
      </h3>
      <p className={NOTE}>{t('accessTokens.revealNote')}</p>
      <div className="flex flex-wrap items-center gap-2">
        <code ref={tokenBox} className={CODE_BOX}>
          {token}
        </code>
        <button
          type="button"
          onClick={() => {
            void copy();
          }}
          className={`flex min-h-9 items-center rounded-input px-3 text-sm ${BUTTON_SECONDARY}`}
        >
          <span aria-live="polite">{copyLabel}</span>
        </button>
      </div>
      <div className="flex flex-col gap-1">
        <p className={NOTE}>{t('accessTokens.usage')}</p>
        <code className="font-mono text-xs break-all text-ink">{AUTHORIZATION_EXAMPLE}</code>
      </div>
      <button
        type="button"
        onClick={onDone}
        className={`flex min-h-9 items-center self-start rounded-input px-4 text-sm ${BUTTON_PRIMARY}`}
      >
        {t('accessTokens.done')}
      </button>
    </div>
  );
}
