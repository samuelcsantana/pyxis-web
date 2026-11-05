'use client';

import { useEffect, useId, useRef } from 'react';
import { BUTTON_PRIMARY } from '@/components/ui/control-classes';
import { shareLinkUrl } from '@/domain/share-links';
import { useT } from '@/i18n/messages-provider';
import { CopyableCode } from './copyable-code';

export interface NewShareLinkRevealProps {
  readonly token: string;
  readonly onDone: () => void;
}

export function NewShareLinkReveal({ token, onDone }: NewShareLinkRevealProps) {
  const t = useT();
  const headingId = useId();
  const heading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    heading.current?.focus();
  }, []);

  return (
    <div
      role="group"
      aria-labelledby={headingId}
      className="flex flex-col gap-3 rounded-input border border-line bg-soft p-3.5"
    >
      <h3 id={headingId} ref={heading} tabIndex={-1} className="text-sm font-semibold outline-none">
        {t('shareLinks.revealHeading')}
      </h3>
      <p className="text-xs leading-[18px] text-muted">{t('shareLinks.revealNote')}</p>
      <CopyableCode text={shareLinkUrl(window.location.origin, token)} what="share link" />
      <button
        type="button"
        onClick={onDone}
        className={`flex min-h-9 items-center self-start rounded-input px-4 text-sm ${BUTTON_PRIMARY}`}
      >
        {t('shareLinks.done')}
      </button>
    </div>
  );
}
