'use client';

import { type SubmitEvent, useEffect, useId, useRef, useState } from 'react';
import { BUTTON_PRIMARY, CONTROL_BUSY, FIELD } from '@/components/ui/control-classes';
import { useT } from '@/i18n/messages-provider';
import { keepUnlock, minutesUntilRetry, unlockOf } from './share-unlock';

export interface SharedPasswordFormProps {
  readonly token: string;
  readonly apiBase: string;
  readonly demoPassword: string | null;
  readonly onUnlocked: () => void;
  readonly onClosed: () => void;
}

type Problem =
  | { readonly kind: 'wrong' }
  | { readonly kind: 'tooMany'; readonly minutes: number }
  | { readonly kind: 'failed' };

const STATUS = {
  badRequest: 400,
  unauthorized: 401,
  notFound: 404,
  conflict: 409,
  tooManyRequests: 429,
} as const;

const INPUT = `min-h-11 w-full rounded-input px-3 text-base sm:text-sm ${FIELD}`;

async function unlock(apiBase: string, token: string, password: string): Promise<Response> {
  return fetch(`${apiBase}/v1/shared/${encodeURIComponent(token)}/unlock`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ password }),
    credentials: 'omit',
    cache: 'no-store',
  });
}

export function SharedPasswordForm({
  token,
  apiBase,
  demoPassword,
  onUnlocked,
  onClosed,
}: SharedPasswordFormProps) {
  const t = useT();
  const headingId = useId();
  const fieldId = useId();
  const errorId = useId();
  const field = useRef<HTMLInputElement>(null);
  const live = useRef(true);
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState<Problem | null>(null);

  useEffect(() => {
    live.current = true;
    field.current?.focus();
    return () => {
      live.current = false;
    };
  }, []);

  const settle = (response: Response | null, body: unknown) => {
    if (response === null) {
      setProblem({ kind: 'failed' });
      return;
    }
    const unlocked = response.ok ? unlockOf(body) : null;
    if (unlocked !== null) {
      keepUnlock(token, unlocked);
      onUnlocked();
      return;
    }
    switch (response.status) {
      case STATUS.notFound:
        onClosed();
        return;
      case STATUS.conflict:
        onUnlocked();
        return;
      case STATUS.unauthorized:
      case STATUS.badRequest:
        setProblem({ kind: 'wrong' });
        break;
      case STATUS.tooManyRequests:
        setProblem({
          kind: 'tooMany',
          minutes: minutesUntilRetry(response.headers.get('retry-after')),
        });
        break;
      default:
        setProblem({ kind: 'failed' });
    }
    field.current?.focus();
  };

  const submit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setProblem(null);
    unlock(apiBase, token, password)
      .then(async (response) => {
        const body: unknown = response.ok ? await response.json() : null;
        return { response, body };
      })
      .then(
        ({ response, body }) => {
          if (live.current) {
            setBusy(false);
            settle(response, body);
          }
        },
        () => {
          if (live.current) {
            setBusy(false);
            settle(null, null);
          }
        },
      );
  };

  const problemText = (shown: Problem): string => {
    switch (shown.kind) {
      case 'wrong':
        return t('share.wrongPassword');
      case 'tooMany':
        return t('share.tooManyAttempts', { count: shown.minutes });
      case 'failed':
        return t('share.failed');
    }
  };

  return (
    <section
      aria-labelledby={headingId}
      className="mx-auto flex w-full max-w-md flex-col gap-4 p-4 pt-10 sm:px-8"
    >
      <div className="flex flex-col gap-1.5">
        <h1 id={headingId} className="text-xl font-semibold">
          {t('share.passwordTitle')}
        </h1>
        <p className="text-sm text-muted">{t('share.passwordBody')}</p>
      </div>
      <form noValidate onSubmit={submit} className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor={fieldId} className="text-caption font-medium">
            {t('share.passwordLabel')}
          </label>
          <input
            ref={field}
            id={fieldId}
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
            }}
            aria-invalid={problem?.kind === 'wrong'}
            aria-describedby={problem === null ? undefined : errorId}
            className={INPUT}
          />
        </div>
        {problem === null ? null : (
          <p id={errorId} role="alert" className="text-caption font-medium text-bad">
            {problemText(problem)}
          </p>
        )}
        <button
          type="submit"
          disabled={busy}
          aria-busy={busy}
          className={`min-h-11 self-start rounded-input px-4 text-sm ${BUTTON_PRIMARY} ${CONTROL_BUSY}`}
        >
          {busy ? t('share.opening') : t('share.open')}
        </button>
      </form>
      {demoPassword === null ? null : (
        <p className="text-xs leading-[18px] text-muted">
          {t('share.demoPassword', { password: demoPassword })}
        </p>
      )}
    </section>
  );
}
