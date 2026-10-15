'use client';

import { useRouter } from 'next/navigation';
import { type SubmitEvent, useEffect, useId, useRef, useState } from 'react';
import { catchToState, withSmoothLoading } from 'rx-state-bridge';
import { defer, type Subscription, tap } from 'rxjs';
import { BUTTON_DANGER, CONTROL_BUSY, FIELD } from '@/components/ui/control-classes';
import type { CloseAccountOutcome } from '@/domain/accounts';
import { useT } from '@/i18n/messages-provider';

export type CloseAccount = (confirmEmail: string) => Promise<CloseAccountOutcome>;
export type AccountClosed = Extract<CloseAccountOutcome, { readonly kind: 'closed' }>;

export interface CloseAccountFormProps {
  readonly close: CloseAccount;
  readonly onClosed: (closed: AccountClosed) => void;
}

type Refusal = 'confirmationMismatch' | 'alreadyEnded' | 'unavailable' | 'failed';

export const CLOSE_ACCOUNT_MIN_BUSY_MS = 400;

const INPUT = `min-h-11 w-full rounded-input px-3 text-base sm:text-sm ${FIELD}`;
const REFUSALS = {
  confirmationMismatch: 'closeAccount.confirmationMismatch',
  alreadyEnded: 'closeAccount.alreadyEnded',
  unavailable: 'closeAccount.unavailable',
  failed: 'closeAccount.failed',
} as const satisfies Record<Refusal, string>;

export function CloseAccountForm({ close, onClosed }: CloseAccountFormProps) {
  const t = useT();
  const router = useRouter();
  const ids = useId();
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [refusal, setRefusal] = useState<Refusal | null>(null);
  const request = useRef<Subscription | undefined>(undefined);

  useEffect(() => () => request.current?.unsubscribe(), []);

  const fieldId = `${ids}-email`;
  const errorId = `${ids}-error`;

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
          onClosed(outcome);
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
