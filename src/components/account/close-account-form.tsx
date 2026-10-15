'use client';

import { useRouter } from 'next/navigation';
import { type SubmitEvent, useEffect, useId, useRef, useState } from 'react';
import { catchToState, withSmoothLoading } from 'rx-state-bridge';
import { defer, type Subscription, tap } from 'rxjs';
import { BUTTON_DANGER, CONTROL_BUSY, FIELD } from '@/components/ui/control-classes';
import type { CloseAccountOutcome } from '@/domain/accounts';
import { useLocale, useT } from '@/i18n/messages-provider';

export type CloseAccount = (confirmEmail: string) => Promise<CloseAccountOutcome>;

export interface CloseAccountFormProps {
  readonly close: CloseAccount;
}

type Refusal = 'confirmationMismatch' | 'alreadyEnded' | 'unavailable' | 'failed';
type Closed = Extract<CloseAccountOutcome, { readonly kind: 'closed' }>;

export const CLOSE_ACCOUNT_MIN_BUSY_MS = 400;

const CENTAVOS_PER_REAL = 100;
const CURRENCY = 'BRL';
const INPUT = `min-h-11 w-full rounded-input px-3 text-base sm:text-sm ${FIELD}`;
const REFUSALS = {
  confirmationMismatch: 'closeAccount.confirmationMismatch',
  alreadyEnded: 'closeAccount.alreadyEnded',
  unavailable: 'closeAccount.unavailable',
  failed: 'closeAccount.failed',
} as const satisfies Record<Refusal, string>;

export function CloseAccountForm({ close }: CloseAccountFormProps) {
  const t = useT();
  const locale = useLocale();
  const router = useRouter();
  const ids = useId();
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [refusal, setRefusal] = useState<Refusal | null>(null);
  const [closed, setClosed] = useState<Closed | null>(null);
  const request = useRef<Subscription | undefined>(undefined);

  useEffect(() => () => request.current?.unsubscribe(), []);

  const fieldId = `${ids}-email`;
  const errorId = `${ids}-error`;

  if (closed !== null) {
    const day = new Intl.DateTimeFormat(locale, { dateStyle: 'long', timeZone: 'UTC' });
    const money = new Intl.NumberFormat(locale, { style: 'currency', currency: CURRENCY });
    return (
      <div role="status" className="flex flex-col gap-1 text-sm font-medium">
        <p>{t('closeAccount.closed', { date: day.format(new Date(closed.deletionOn)) })}</p>
        {closed.refundedAmount > 0 ? (
          <p>
            {t('closeAccount.refunded', {
              amount: money.format(closed.refundedAmount / CENTAVOS_PER_REAL),
            })}
          </p>
        ) : null}
      </div>
    );
  }

  const submit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    request.current?.unsubscribe();
    setRefusal(null);
    request.current = defer(() => close(email.trim()))
      .pipe(
        tap((outcome) => {
          if (outcome.kind !== 'closed') {
            setRefusal(outcome.kind);
            return;
          }
          setClosed(outcome);
          router.refresh();
        }),
        catchToState(() => {
          setRefusal('failed');
        }),
        withSmoothLoading(setBusy, CLOSE_ACCOUNT_MIN_BUSY_MS),
      )
      .subscribe();
  };

  return (
    <form noValidate onSubmit={submit} className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <label htmlFor={fieldId} className="text-caption font-medium">
          {t('closeAccount.confirm')}
        </label>
        <input
          id={fieldId}
          type="email"
          autoComplete="off"
          spellCheck={false}
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            setRefusal(null);
          }}
          aria-invalid={refusal === 'confirmationMismatch'}
          aria-describedby={refusal === null ? undefined : errorId}
          className={INPUT}
        />
      </div>
      <button
        type="submit"
        disabled={busy}
        aria-busy={busy}
        className={`min-h-11 self-start rounded-input px-4 text-sm ${BUTTON_DANGER} ${CONTROL_BUSY}`}
      >
        {busy ? t('closeAccount.closing') : t('closeAccount.close')}
      </button>
      {refusal === null ? null : (
        <p id={errorId} role="alert" className="text-caption font-medium text-bad">
          {t(REFUSALS[refusal])}
        </p>
      )}
    </form>
  );
}
