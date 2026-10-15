'use client';

import { useId, useRef } from 'react';
import { BUTTON_SECONDARY } from '@/components/ui/control-classes';
import { useT } from '@/i18n/messages-provider';
import { CODE_BOX, useCopy } from './new-access-token-reveal';

export interface CopyableCodeProps {
  readonly text: string;
  readonly what: string;
}

export function CopyableCode({ text, what }: CopyableCodeProps) {
  const t = useT();
  const codeId = useId();
  const codeBox = useRef<HTMLElement>(null);
  const { state, copy } = useCopy(text, () => codeBox.current, what);

  const label = {
    idle: t('connections.copy'),
    copied: t('connections.copied'),
    selected: t('connections.selected'),
  }[state];

  return (
    <div className="flex flex-wrap items-center gap-2">
      <code id={codeId} ref={codeBox} className={CODE_BOX}>
        {text}
      </code>
      <button
        type="button"
        aria-describedby={codeId}
        onClick={() => {
          void copy();
        }}
        className={`flex min-h-9 items-center rounded-input px-3 text-sm ${BUTTON_SECONDARY}`}
      >
        <span aria-live="polite">{label}</span>
      </button>
    </div>
  );
}
