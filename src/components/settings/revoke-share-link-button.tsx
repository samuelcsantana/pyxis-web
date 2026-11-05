'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useId, useRef, useState } from 'react';
import { catchToState, withSmoothLoading } from 'rx-state-bridge';
import { defer, type Subscription, tap } from 'rxjs';
import { BUTTON_DANGER, BUTTON_SECONDARY, CONTROL_BUSY } from '@/components/ui/control-classes';
import { useT } from '@/i18n/messages-provider';

export type RevokeShareLink = (linkId: string) => Promise<void>;

export interface RevokeShareLinkButtonProps {
  readonly linkId: string;
  readonly name: string;
  readonly describedBy: string;
  readonly revoke: RevokeShareLink;
}

export const REVOKE_SHARE_LINK_MIN_BUSY_MS = 400;

type Step = 'idle' | 'confirming' | 'revoked';

export function RevokeShareLinkButton({
  linkId,
  name,
  describedBy,
  revoke,
}: RevokeShareLinkButtonProps) {
  const t = useT();
  const router = useRouter();
  const questionId = useId();
  const [step, setStep] = useState<Step>('idle');
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const request = useRef<Subscription | undefined>(undefined);
  const revokeButton = useRef<HTMLButtonElement>(null);
  const confirmButton = useRef<HTMLButtonElement>(null);
  const cancelled = useRef(false);

  useEffect(() => () => request.current?.unsubscribe(), []);

  useEffect(() => {
    if (step === 'confirming') {
      confirmButton.current?.focus();
      return;
    }
    if (cancelled.current) {
      cancelled.current = false;
      revokeButton.current?.focus();
    }
  }, [step]);

  const confirm = () => {
    request.current?.unsubscribe();
    setFailed(false);
    request.current = defer(() => revoke(linkId))
      .pipe(
        tap(() => {
          setStep('revoked');
          router.refresh();
        }),
        catchToState(() => {
          setFailed(true);
        }),
        withSmoothLoading(setBusy, REVOKE_SHARE_LINK_MIN_BUSY_MS),
      )
      .subscribe();
  };

  const cancel = () => {
    cancelled.current = true;
    setStep('idle');
    setFailed(false);
  };

  if (step === 'revoked') {
    return (
      <p role="status" className="text-xs font-medium text-ok">
        {t('shareLinks.revoked')}
      </p>
    );
  }
  if (step === 'confirming') {
    return (
      <div
        role="group"
        aria-labelledby={questionId}
        className="flex w-full flex-col gap-2.5 rounded-card border border-bad bg-bad-soft p-3.5"
      >
        <p id={questionId} className="text-sm text-ink">
          {t('shareLinks.confirmRevoke', { name })}
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <button
            ref={confirmButton}
            type="button"
            onClick={confirm}
            disabled={busy}
            aria-busy={busy}
            className={`min-h-11 rounded-input px-4 text-sm ${BUTTON_DANGER} ${CONTROL_BUSY}`}
          >
            {busy ? t('shareLinks.revoking') : t('shareLinks.confirm')}
          </button>
          <button
            type="button"
            onClick={cancel}
            className={`min-h-11 rounded-input px-4 text-sm ${BUTTON_SECONDARY}`}
          >
            {t('shareLinks.cancel')}
          </button>
          {failed ? (
            <p role="alert" className="text-sm text-bad">
              {t('shareLinks.revokeFailed')}
            </p>
          ) : null}
        </div>
      </div>
    );
  }
  return (
    <button
      ref={revokeButton}
      type="button"
      onClick={() => {
        setStep('confirming');
      }}
      aria-describedby={describedBy}
      className={`flex min-h-9 items-center rounded-input px-3 text-sm ${BUTTON_SECONDARY}`}
    >
      {t('shareLinks.revoke')}
    </button>
  );
}
