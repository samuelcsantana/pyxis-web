'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { catchToState, withSmoothLoading } from 'rx-state-bridge';
import { defer, type Subscription, tap } from 'rxjs';
import { BUTTON_DANGER, BUTTON_SECONDARY, CONTROL_BUSY } from '@/components/ui/control-classes';
import type { WithdrawOutcome } from '@/domain/accounts';
import { useLocale, useT } from '@/i18n/messages-provider';
import { refundAmount } from './refund-amount';

export type Withdraw = () => Promise<WithdrawOutcome>;
export type Withdrawn = Extract<WithdrawOutcome, { readonly kind: 'withdrawn' }>;

export interface WithdrawSectionProps {
  readonly open: boolean;
  readonly withdraw: Withdraw;
}

type Refusal = Exclude<WithdrawOutcome['kind'], 'withdrawn'> | 'failed';

export const WITHDRAW_MIN_BUSY_MS = 400;

const SECTION = 'flex flex-col gap-2 border-t border-line pt-3';
const BUTTON = 'min-h-11 self-start rounded-input px-4 text-sm';
const REFUSALS = {
  freePlanClosed: 'withdrawal.freePlanClosed',
  noPaidSubscription: 'withdrawal.noPaidSubscription',
  windowClosed: 'withdrawal.windowClosed',
  unavailable: 'withdrawal.unavailable',
  failed: 'withdrawal.failed',
} as const satisfies Record<Refusal, string>;

function WithdrawnStatus({ withdrawn }: { readonly withdrawn: Withdrawn }) {
  const t = useT();
  const locale = useLocale();
  const day = new Intl.DateTimeFormat(locale, { dateStyle: 'long', timeZone: 'UTC' });
  return (
    <div role="status" className="flex flex-col gap-1 text-sm font-medium">
      <p>{t('withdrawal.done')}</p>
      <p>
        {withdrawn.refundedAmount > 0
          ? t('withdrawal.refunded', { amount: refundAmount(locale, withdrawn.refundedAmount) })
          : t('withdrawal.refundByHand')}
      </p>
      {withdrawn.fitBy === null ? null : (
        <p>{t('withdrawal.fitBy', { date: day.format(new Date(withdrawn.fitBy)) })}</p>
      )}
    </div>
  );
}

export function WithdrawSection({ open, withdraw }: WithdrawSectionProps) {
  const t = useT();
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [refusal, setRefusal] = useState<Refusal | null>(null);
  const [withdrawn, setWithdrawn] = useState<Withdrawn | null>(null);
  const request = useRef<Subscription | undefined>(undefined);
  const question = useRef<HTMLParagraphElement>(null);
  const start = useRef<HTMLButtonElement>(null);
  const backToStart = useRef(false);

  useEffect(() => () => request.current?.unsubscribe(), []);

  useEffect(() => {
    if (confirming) {
      question.current?.focus();
      return;
    }
    if (backToStart.current) {
      backToStart.current = false;
      start.current?.focus();
    }
  }, [confirming]);

  if (withdrawn === null && !open) {
    return null;
  }

  const confirm = () => {
    request.current?.unsubscribe();
    setRefusal(null);
    request.current = defer(withdraw)
      .pipe(
        tap((outcome) => {
          if (outcome.kind !== 'withdrawn') {
            setRefusal(outcome.kind);
            return;
          }
          setWithdrawn(outcome);
          router.refresh();
        }),
        catchToState(() => {
          setRefusal('failed');
        }),
        withSmoothLoading(setBusy, WITHDRAW_MIN_BUSY_MS),
      )
      .subscribe();
  };

  const keep = () => {
    backToStart.current = true;
    setRefusal(null);
    setConfirming(false);
  };

  return (
    <div className={SECTION}>
      <h3 className="text-sm font-semibold">{t('withdrawal.heading')}</h3>
      {withdrawn === null ? (
        <>
          <p className="text-sm">{t('withdrawal.note')}</p>
          {confirming ? (
            <div className="flex flex-col gap-3">
              <p ref={question} tabIndex={-1} className="text-sm font-medium outline-none">
                {t('withdrawal.question')}
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={confirm}
                  disabled={busy}
                  aria-busy={busy}
                  className={`${BUTTON} ${BUTTON_DANGER} ${CONTROL_BUSY}`}
                >
                  {busy ? t('withdrawal.withdrawing') : t('withdrawal.confirm')}
                </button>
                <button
                  type="button"
                  onClick={keep}
                  disabled={busy}
                  className={`${BUTTON} ${BUTTON_SECONDARY}`}
                >
                  {t('withdrawal.keep')}
                </button>
              </div>
            </div>
          ) : (
            <button
              ref={start}
              type="button"
              onClick={() => {
                setConfirming(true);
              }}
              className={`${BUTTON} ${BUTTON_SECONDARY}`}
            >
              {t('withdrawal.start')}
            </button>
          )}
          {refusal === null ? null : (
            <p role="alert" className="text-caption font-medium text-bad">
              {t(REFUSALS[refusal])}
            </p>
          )}
        </>
      ) : (
        <WithdrawnStatus withdrawn={withdrawn} />
      )}
    </div>
  );
}
