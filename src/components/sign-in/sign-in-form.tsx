'use client';

import { useRouter } from 'next/navigation';
import { type SubmitEvent, useEffect, useMemo, useRef, useState } from 'react';
import { catchToState, withSmoothLoading, withTemporarySuccess } from 'rx-state-bridge';
import { defer, type Subscription, tap } from 'rxjs';
import { InvalidCodeError, RateLimitedError } from '@/domain/errors';
import type { ClientSourceMessages } from '@/i18n/messages';
import { useLocale, useT } from '@/i18n/messages-provider';
import { rich } from '@/i18n/rich';
import type { Translator } from '@/i18n/translate';
import type { IAuthService } from '@/services/auth/auth-service.interface';
import { createAuthService } from '@/services/auth/auth-service.factory';
import {
  BUTTON_PRIMARY,
  CONTROL_BUSY,
  CONTROL_DISABLED,
  FIELD,
  TEXT_LINK,
} from '@/components/ui/control-classes';

export const SMOOTH_LOADING_MS = 400;
export const CODE_SENT_NOTICE_MS = 4_000;
export const SIGN_IN_CODE_LENGTH = 6;
const MAX_EMAIL_LENGTH = 254;
const NOT_A_DIGIT = /[^0-9]/g;
const EMAIL_ERROR_ID = 'sign-in-email-error';
const HOME_PATH = '/';

type Step = 'email' | 'code';

export interface SignInFormProps {
  readonly authService?: IAuthService;
  readonly sessionExpired?: boolean;
  readonly demoCode?: string;
  readonly returnPath?: string;
}

export function signInErrorMessage(error: unknown, t: Translator<ClientSourceMessages>): string {
  if (error instanceof InvalidCodeError) {
    return t('signIn.errors.invalidCode');
  }
  if (error instanceof RateLimitedError) {
    return t('signIn.errors.rateLimited');
  }
  return t('signIn.errors.unreachable');
}

const INPUT_CLASS = `min-h-11.5 w-full rounded-input px-3.5 placeholder:text-muted ${FIELD}`;
const PRIMARY_BUTTON_CLASS = `min-h-11.5 rounded-input px-4 text-callout ${BUTTON_PRIMARY} ${CONTROL_BUSY}`;
const LINK_BUTTON_CLASS = `self-start text-sm ${TEXT_LINK} ${CONTROL_DISABLED}`;

interface DemoHintProps {
  readonly code: string;
  readonly message: string;
}

function DemoHint({ code, message }: DemoHintProps) {
  return (
    <p className="rounded-input bg-soft px-3 py-2.5 text-caption text-muted">
      {rich(message, {
        code: () => <code className="font-mono font-semibold text-ink">{code}</code>,
      })}
    </p>
  );
}

export function SignInForm({
  authService,
  sessionExpired = false,
  demoCode,
  returnPath = HOME_PATH,
}: SignInFormProps) {
  const t = useT();
  const locale = useLocale();
  const router = useRouter();
  const service = useMemo(() => authService ?? createAuthService(), [authService]);
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const request = useRef<Subscription | undefined>(undefined);
  const notice = useRef<AbortController | undefined>(undefined);
  const codeInput = useRef<HTMLInputElement>(null);
  const emailInput = useRef<HTMLInputElement>(null);
  const shownStep = useRef<Step>(step);

  useEffect(
    () => () => {
      request.current?.unsubscribe();
      notice.current?.abort();
    },
    [],
  );

  useEffect(() => {
    if (step === shownStep.current) {
      return;
    }
    shownStep.current = step;
    (step === 'code' ? codeInput : emailInput).current?.focus();
  }, [step]);

  const start = () => {
    request.current?.unsubscribe();
    setError(null);
  };

  const sendCode = () => {
    start();
    notice.current?.abort();
    notice.current = new AbortController();
    request.current = defer(() => service.requestCode(email.trim(), locale))
      .pipe(
        tap(() => {
          setStep('code');
          setCode('');
        }),
        withTemporarySuccess(setCodeSent, CODE_SENT_NOTICE_MS, { signal: notice.current.signal }),
        catchToState(setError),
        withSmoothLoading(setBusy, SMOOTH_LOADING_MS),
      )
      .subscribe();
  };

  const verifyCode = () => {
    start();
    request.current = defer(() => service.verifyCode(email.trim(), code))
      .pipe(
        tap(() => {
          router.replace(returnPath);
          router.refresh();
        }),
        catchToState(setError),
        withSmoothLoading(setBusy, SMOOTH_LOADING_MS),
      )
      .subscribe();
  };

  const submitEmail = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendCode();
  };

  const submitCode = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    verifyCode();
  };

  const useAnotherEmail = () => {
    start();
    setStep('email');
    setCode('');
  };

  const errorText = error === null ? null : signInErrorMessage(error, t);
  const digits = String(SIGN_IN_CODE_LENGTH);

  return (
    <section className="flex w-full max-w-[420px] flex-col gap-5 rounded-panel border border-line bg-card p-8 text-ink">
      {step === 'email' ? (
        <form onSubmit={submitEmail} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <h1 className="text-title font-semibold">{t('signIn.title')}</h1>
            <p className="text-sm leading-5 text-muted">{t('signIn.intro', { digits })}</p>
          </div>
          {sessionExpired ? (
            <p role="status" className="rounded-input bg-warn-soft px-3 py-2.5 text-sm text-warn">
              {t('signIn.sessionEnded')}
            </p>
          ) : null}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="sign-in-email" className="text-caption font-medium">
              {t('signIn.email')}
            </label>
            <input
              ref={emailInput}
              id="sign-in-email"
              type="email"
              autoComplete="email"
              required
              maxLength={MAX_EMAIL_LENGTH}
              placeholder={t('signIn.emailPlaceholder')}
              value={email}
              aria-invalid={errorText !== null}
              aria-describedby={errorText === null ? undefined : EMAIL_ERROR_ID}
              onChange={(event) => {
                setEmail(event.target.value);
              }}
              className={`${INPUT_CLASS} text-base sm:text-callout`}
            />
          </div>
          {errorText === null ? null : (
            <p
              id={EMAIL_ERROR_ID}
              role="alert"
              className="rounded-input bg-bad-soft px-3 py-2.5 text-caption font-medium text-bad"
            >
              {errorText}
            </p>
          )}
          {demoCode === undefined ? null : (
            <DemoHint code={demoCode} message={t('signIn.demoEmail')} />
          )}
          <button type="submit" disabled={busy} aria-busy={busy} className={PRIMARY_BUTTON_CLASS}>
            {busy ? t('signIn.sending') : t('signIn.sendCode')}
          </button>
        </form>
      ) : (
        <form onSubmit={submitCode} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <h1 className="text-title font-semibold">{t('signIn.checkTitle')}</h1>
            <p className="text-sm leading-5 text-muted">
              {rich(t('signIn.checkBody'), {
                email: () => <strong className="font-semibold text-ink">{email.trim()}</strong>,
              })}
            </p>
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="sign-in-code" className="text-caption font-medium">
              {t('signIn.code', { digits })}
            </label>
            <input
              ref={codeInput}
              id="sign-in-code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              required
              pattern={`[0-9]{${String(SIGN_IN_CODE_LENGTH)}}`}
              maxLength={SIGN_IN_CODE_LENGTH}
              value={code}
              aria-invalid={errorText !== null}
              aria-describedby={errorText === null ? undefined : 'sign-in-error'}
              onChange={(event) => {
                setCode(event.target.value.replace(NOT_A_DIGIT, ''));
              }}
              className={`${INPUT_CLASS} font-mono text-title tracking-[0.5em]`}
            />
          </div>
          <p role="status" className="min-h-5 text-caption text-ok">
            {codeSent && errorText === null ? t('signIn.codeSent') : ''}
          </p>
          {errorText === null ? null : (
            <p
              id="sign-in-error"
              role="alert"
              className="rounded-input bg-bad-soft px-3 py-2.5 text-caption font-medium text-bad"
            >
              {errorText}
            </p>
          )}
          {demoCode === undefined ? null : (
            <DemoHint code={demoCode} message={t('signIn.demoCode')} />
          )}
          <button type="submit" disabled={busy} aria-busy={busy} className={PRIMARY_BUTTON_CLASS}>
            {busy ? t('signIn.verifying') : t('signIn.verify')}
          </button>
          <div className="flex flex-wrap justify-between gap-2">
            <button type="button" onClick={sendCode} disabled={busy} className={LINK_BUTTON_CLASS}>
              {t('signIn.resend')}
            </button>
            <button type="button" onClick={useAnotherEmail} className={LINK_BUTTON_CLASS}>
              {t('signIn.otherEmail')}
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
