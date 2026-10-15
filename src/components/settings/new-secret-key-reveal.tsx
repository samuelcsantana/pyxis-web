'use client';

import { useEffect, useId, useRef } from 'react';
import { BUTTON_PRIMARY, BUTTON_SECONDARY } from '@/components/ui/control-classes';
import { useT } from '@/i18n/messages-provider';
import { CODE_BOX, useCopy } from './new-access-token-reveal';

export interface NewSecretKeyRevealProps {
  readonly secretKey: string;
  readonly onDone: () => void;
}

const NOTE = 'text-xs leading-[18px] text-muted';

export function NewSecretKeyReveal({ secretKey, onDone }: NewSecretKeyRevealProps) {
  const t = useT();
  const headingId = useId();
  const heading = useRef<HTMLHeadingElement>(null);
  const keyBox = useRef<HTMLElement>(null);
  const { state, copy } = useCopy(secretKey, () => keyBox.current, 'secret key');

  useEffect(() => {
    heading.current?.focus();
  }, []);

  const copyLabel = {
    idle: t('projectKeys.copy'),
    copied: t('projectKeys.copied'),
    selected: t('projectKeys.selected'),
  }[state];

  return (
    <div
      role="group"
      aria-labelledby={headingId}
      className="flex flex-col gap-3 rounded-input border border-line bg-soft p-3.5"
    >
      <h4 id={headingId} ref={heading} tabIndex={-1} className="text-sm font-semibold outline-none">
        {t('projectKeys.revealHeading')}
      </h4>
      <p className={NOTE}>{t('projectKeys.revealNote')}</p>
      <div className="flex flex-wrap items-center gap-2">
        <code ref={keyBox} className={CODE_BOX}>
          {secretKey}
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
      <button
        type="button"
        onClick={onDone}
        className={`flex min-h-9 items-center self-start rounded-input px-4 text-sm ${BUTTON_PRIMARY}`}
      >
        {t('projectKeys.done')}
      </button>
    </div>
  );
}
