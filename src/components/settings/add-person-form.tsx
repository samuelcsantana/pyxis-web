'use client';

import { useRouter } from 'next/navigation';
import { type SubmitEvent, useEffect, useId, useRef, useState } from 'react';
import { catchToState, withSmoothLoading } from 'rx-state-bridge';
import { defer, type Subscription, tap } from 'rxjs';
import { BUTTON_PRIMARY, CONTROL_BUSY, FIELD } from '@/components/ui/control-classes';
import { type AddPersonOutcome, MAX_ACCOUNT_PEOPLE } from '@/domain/project-people';
import { emailProblem } from '@/domain/sign-in';
import { useT } from '@/i18n/messages-provider';

export type AddPerson = (email: string) => Promise<AddPersonOutcome>;

export interface AddPersonFormProps {
  readonly add: AddPerson;
}

type Result =
  | { readonly kind: 'invited' | 'alreadyThere'; readonly email: string }
  | { readonly kind: 'emailMissing' | 'emailInvalid' }
  | { readonly kind: 'limitReached' | 'subscriptionRequired' | 'failed' };

export const ADD_PERSON_MIN_BUSY_MS = 400;

const INPUT = `min-h-11 w-full rounded-input px-3 text-base placeholder:text-muted sm:text-sm ${FIELD}`;
const ERROR = 'text-caption font-medium text-bad';

function resultOf(outcome: AddPersonOutcome): Result {
  if (outcome.kind !== 'added') {
    return { kind: outcome.kind === 'invalidEmail' ? 'emailInvalid' : outcome.kind };
  }
  return { kind: outcome.invited ? 'invited' : 'alreadyThere', email: outcome.person.email };
}

export function AddPersonForm({ add }: AddPersonFormProps) {
  const t = useT();
  const router = useRouter();
  const ids = useId();
  const field = useRef<HTMLInputElement>(null);
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const request = useRef<Subscription | undefined>(undefined);

  useEffect(() => () => request.current?.unsubscribe(), []);

  const fieldId = `${ids}-email`;
  const errorId = `${ids}-error`;
  const fieldProblem = result?.kind === 'emailMissing' || result?.kind === 'emailInvalid';

  const submit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const problem = emailProblem(email);
    if (problem !== null) {
      setResult({ kind: problem === 'emailMissing' ? 'emailMissing' : 'emailInvalid' });
      field.current?.focus();
      return;
    }
    request.current?.unsubscribe();
    setResult(null);
    request.current = defer(() => add(email.trim()))
      .pipe(
        tap((outcome) => {
          const next = resultOf(outcome);
          setResult(next);
          if (next.kind === 'invited' || next.kind === 'alreadyThere') {
            setEmail('');
            router.refresh();
          }
        }),
        catchToState(() => {
          setResult({ kind: 'failed' });
        }),
        withSmoothLoading(setBusy, ADD_PERSON_MIN_BUSY_MS),
      )
      .subscribe();
  };

  const message = (shown: Result) => {
    switch (shown.kind) {
      case 'invited':
      case 'alreadyThere':
        return (
          <p role="status" className="text-caption font-medium text-ok">
            {t(shown.kind === 'invited' ? 'people.invited' : 'people.alreadyThere', {
              email: shown.email,
            })}
          </p>
        );
      case 'emailMissing':
      case 'emailInvalid':
        return (
          <p id={errorId} role="alert" className={ERROR}>
            {t(shown.kind === 'emailMissing' ? 'people.emailMissing' : 'people.emailInvalid')}
          </p>
        );
      case 'limitReached':
        return (
          <p role="alert" className={ERROR}>
            {t('people.limitReached', { max: String(MAX_ACCOUNT_PEOPLE) })}
          </p>
        );
      case 'subscriptionRequired':
      case 'failed':
        return (
          <p role="alert" className={ERROR}>
            {t(shown.kind === 'failed' ? 'people.failed' : 'people.subscriptionRequired')}
          </p>
        );
    }
  };

  return (
    <form noValidate onSubmit={submit} className="flex flex-col gap-2">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <label htmlFor={fieldId} className="text-caption font-medium">
            {t('people.email')}
          </label>
          <input
            ref={field}
            id={fieldId}
            type="email"
            inputMode="email"
            autoComplete="off"
            spellCheck={false}
            value={email}
            placeholder={t('people.emailPlaceholder')}
            onChange={(event) => {
              setEmail(event.target.value);
              setResult(null);
            }}
            aria-invalid={fieldProblem}
            aria-describedby={fieldProblem ? errorId : undefined}
            className={INPUT}
          />
        </div>
        <button
          type="submit"
          disabled={busy}
          aria-busy={busy}
          className={`min-h-11 shrink-0 rounded-input px-4 text-sm ${BUTTON_PRIMARY} ${CONTROL_BUSY}`}
        >
          {busy ? t('people.adding') : t('people.add')}
        </button>
      </div>
      {result === null ? null : message(result)}
    </form>
  );
}
