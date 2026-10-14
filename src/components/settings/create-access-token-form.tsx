'use client';

import { useRouter } from 'next/navigation';
import { type SubmitEvent, useEffect, useRef, useState } from 'react';
import { catchToState, withSmoothLoading } from 'rx-state-bridge';
import { defer, type Subscription, tap } from 'rxjs';
import { BUTTON_PRIMARY, CONTROL_BUSY, FIELD } from '@/components/ui/control-classes';
import { SelectField } from '@/components/ui/select-field';
import {
  ACCESS_TOKEN_LIFETIMES,
  type AccessTokenLifetime,
  type AccessTokenNameProblem,
  accessTokenNameProblem,
  type CreateAccessTokenOutcome,
  type CreatedAccessToken,
  DEFAULT_ACCESS_TOKEN_LIFETIME,
  isAccessTokenLifetime,
  MAX_ACCESS_TOKEN_NAME_LENGTH,
  MAX_LIVE_ACCESS_TOKENS,
  type NewAccessToken,
} from '@/domain/access-tokens';
import { useT } from '@/i18n/messages-provider';
import { NewAccessTokenReveal } from './new-access-token-reveal';

export type CreateAccessToken = (request: NewAccessToken) => Promise<CreateAccessTokenOutcome>;

export interface CreateAccessTokenFormProps {
  readonly create: CreateAccessToken;
  readonly limitReached: boolean;
}

type Failure = 'tooMany' | 'failed';

export const CREATE_ACCESS_TOKEN_MIN_BUSY_MS = 400;

const NAME_ID = 'access-token-name';
const NAME_ERROR_ID = 'access-token-name-error';
const LIFETIME_ID = 'access-token-lifetime';
const LABEL = 'text-caption font-medium';
const INPUT = `min-h-11 w-full rounded-input px-3 text-base placeholder:text-muted sm:text-sm ${FIELD}`;
const LIFETIME_LABELS = {
  30: 'accessTokens.lifetime30',
  90: 'accessTokens.lifetime90',
  365: 'accessTokens.lifetime365',
} as const satisfies Record<AccessTokenLifetime, string>;

function nameProblemText(problem: AccessTokenNameProblem, t: ReturnType<typeof useT>): string {
  return problem === 'missing'
    ? t('accessTokens.nameMissing')
    : t('accessTokens.nameTooLong', { max: String(MAX_ACCESS_TOKEN_NAME_LENGTH) });
}

export function CreateAccessTokenForm({ create, limitReached }: CreateAccessTokenFormProps) {
  const t = useT();
  const router = useRouter();
  const nameField = useRef<HTMLInputElement>(null);
  const [name, setName] = useState('');
  const [lifetime, setLifetime] = useState<AccessTokenLifetime>(DEFAULT_ACCESS_TOKEN_LIFETIME);
  const [nameProblem, setNameProblem] = useState<AccessTokenNameProblem | null>(null);
  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState<Failure | null>(null);
  const [created, setCreated] = useState<CreatedAccessToken | null>(null);
  const request = useRef<Subscription | undefined>(undefined);

  useEffect(() => () => request.current?.unsubscribe(), []);

  if (created !== null) {
    return (
      <NewAccessTokenReveal
        token={created.token}
        onDone={() => {
          setCreated(null);
        }}
      />
    );
  }

  const tooMany = (
    <p role="status" className="text-sm text-muted">
      {t('accessTokens.tooMany', { max: String(MAX_LIVE_ACCESS_TOKENS) })}
    </p>
  );
  if (limitReached) {
    return tooMany;
  }

  const submit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const problem = accessTokenNameProblem(name);
    setNameProblem(problem);
    if (problem !== null) {
      nameField.current?.focus();
      return;
    }
    request.current?.unsubscribe();
    setFailure(null);
    request.current = defer(() => create({ name: name.trim(), lifetimeDays: lifetime }))
      .pipe(
        tap((outcome) => {
          if (outcome.kind === 'tooMany') {
            setFailure('tooMany');
            return;
          }
          setName('');
          setCreated(outcome.token);
          router.refresh();
        }),
        catchToState(() => {
          setFailure('failed');
        }),
        withSmoothLoading(setBusy, CREATE_ACCESS_TOKEN_MIN_BUSY_MS),
      )
      .subscribe();
  };

  return (
    <form noValidate onSubmit={submit} className="flex flex-col gap-2">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <label htmlFor={NAME_ID} className={LABEL}>
            {t('accessTokens.name')}
          </label>
          <input
            ref={nameField}
            id={NAME_ID}
            type="text"
            autoComplete="off"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
            }}
            placeholder={t('accessTokens.namePlaceholder')}
            aria-invalid={nameProblem !== null}
            aria-describedby={nameProblem === null ? undefined : NAME_ERROR_ID}
            className={INPUT}
          />
        </div>
        <div className="flex flex-col gap-1.5 sm:w-40">
          <label htmlFor={LIFETIME_ID} className={LABEL}>
            {t('accessTokens.lifetime')}
          </label>
          <SelectField
            id={LIFETIME_ID}
            value={String(lifetime)}
            onChange={(event) => {
              const days = Number(event.target.value);
              if (isAccessTokenLifetime(days)) {
                setLifetime(days);
              }
            }}
            className={INPUT}
          >
            {ACCESS_TOKEN_LIFETIMES.map((days) => (
              <option key={days} value={days}>
                {t(LIFETIME_LABELS[days])}
              </option>
            ))}
          </SelectField>
        </div>
        <button
          type="submit"
          disabled={busy}
          aria-busy={busy}
          className={`min-h-11 shrink-0 rounded-input px-4 text-sm ${BUTTON_PRIMARY} ${CONTROL_BUSY}`}
        >
          {busy ? t('accessTokens.creating') : t('accessTokens.create')}
        </button>
      </div>
      {nameProblem === null ? null : (
        <p id={NAME_ERROR_ID} role="alert" className="text-caption font-medium text-bad">
          {nameProblemText(nameProblem, t)}
        </p>
      )}
      {failure === 'tooMany' ? tooMany : null}
      {failure === 'failed' ? (
        <p role="alert" className="text-caption font-medium text-bad">
          {t('accessTokens.failed')}
        </p>
      ) : null}
    </form>
  );
}
