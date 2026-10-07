'use client';

import { useRouter } from 'next/navigation';
import { type SubmitEvent, useEffect, useMemo, useRef, useState } from 'react';
import { catchToState, withSmoothLoading, withTemporarySuccess } from 'rx-state-bridge';
import { defer, type Subscription, tap } from 'rxjs';
import { InvalidCodeError, RateLimitedError } from '@/domain/errors';
import type { IAuthService } from '@/services/auth/auth-service.interface';
import { createAuthService } from '@/services/auth/auth-service.factory';
import { BUTTON_PRIMARY, CONTROL_BUSY, FIELD, FOCUS_RING } from '@/components/ui/control-classes';

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

export function signInErrorMessage(error: unknown): string {
  if (error instanceof InvalidCodeError) {
    return 'Invalid or expired code. Check the latest email or send a new code.';
  }
  if (error instanceof RateLimitedError) {
    return 'Too many attempts from this network. Wait a few minutes and try again.';
  }
  return 'Could not reach Pyxis. Check your connection and try again.';
}

const INPUT_CLASS = `min-h-11.5 w-full rounded-input px-3.5 placeholder:text-muted ${FIELD}`;
const PRIMARY_BUTTON_CLASS = `min-h-11.5 rounded-input px-4 text-[15px] ${BUTTON_PRIMARY} ${CONTROL_BUSY}`;
const LINK_BUTTON_CLASS = `self-start text-sm text-sky-ink underline underline-offset-2 hover:text-ink ${FOCUS_RING}`;

interface DemoHintProps {
  readonly code: string;
  readonly children: string;
}

function DemoHint({ code, children }: DemoHintProps) {
  return (
    <p className="rounded-input bg-soft px-3 py-2.5 text-[13px] text-muted">
      {children} <code className="font-mono font-semibold text-ink">{code}</code>.
    </p>
  );
}

export function SignInForm({
  authService,
  sessionExpired = false,
  demoCode,
  returnPath = HOME_PATH,
}: SignInFormProps) {
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
    request.current = defer(() => service.requestCode(email.trim()))
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

  const errorText = error === null ? null : signInErrorMessage(error);

  return (
    <section className="flex w-full max-w-[420px] flex-col gap-5 rounded-panel border border-line bg-card p-8 text-ink">
      {step === 'email' ? (
        <form onSubmit={submitEmail} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <h1 className="text-[22px] font-semibold">Sign in to Pyxis</h1>
            <p className="text-sm leading-5 text-muted">
              We will email you a 6-digit code. There is no password to remember.
            </p>
          </div>
          {sessionExpired ? (
            <p role="status" className="rounded-input bg-warn-soft px-3 py-2.5 text-sm text-warn">
              Your session ended. Sign in again to continue.
            </p>
          ) : null}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="sign-in-email" className="text-[13px] font-medium">
              Email
            </label>
            <input
              ref={emailInput}
              id="sign-in-email"
              type="email"
              autoComplete="email"
              required
              maxLength={MAX_EMAIL_LENGTH}
              placeholder="you@company.com"
              value={email}
              aria-invalid={errorText !== null}
              aria-describedby={errorText === null ? undefined : EMAIL_ERROR_ID}
              onChange={(event) => {
                setEmail(event.target.value);
              }}
              className={`${INPUT_CLASS} text-base sm:text-[15px]`}
            />
          </div>
          {errorText === null ? null : (
            <p
              id={EMAIL_ERROR_ID}
              role="alert"
              className="rounded-input bg-bad-soft px-3 py-2.5 text-[13px] font-medium text-bad"
            >
              {errorText}
            </p>
          )}
          {demoCode === undefined ? null : (
            <DemoHint code={demoCode}>
              Demo mode: no email is sent. Any email works, then use the code
            </DemoHint>
          )}
          <button type="submit" disabled={busy} aria-busy={busy} className={PRIMARY_BUTTON_CLASS}>
            {busy ? 'Sending…' : 'Send code'}
          </button>
        </form>
      ) : (
        <form onSubmit={submitCode} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <h1 className="text-[22px] font-semibold">Check your email</h1>
            <p className="text-sm leading-5 text-muted">
              If <strong className="font-semibold text-ink">{email.trim()}</strong> can sign in to
              Pyxis, a code is on its way. It expires in 10 minutes.
            </p>
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="sign-in-code" className="text-[13px] font-medium">
              6-digit code
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
              className={`${INPUT_CLASS} font-mono text-[22px] tracking-[0.5em]`}
            />
          </div>
          <p role="status" className="min-h-5 text-[13px] text-ok">
            {codeSent && errorText === null ? 'Code sent.' : ''}
          </p>
          {errorText === null ? null : (
            <p
              id="sign-in-error"
              role="alert"
              className="rounded-input bg-bad-soft px-3 py-2.5 text-[13px] font-medium text-bad"
            >
              {errorText}
            </p>
          )}
          {demoCode === undefined ? null : (
            <DemoHint code={demoCode}>Demo mode: no email is sent. Use the code</DemoHint>
          )}
          <button type="submit" disabled={busy} aria-busy={busy} className={PRIMARY_BUTTON_CLASS}>
            {busy ? 'Verifying…' : 'Verify and continue'}
          </button>
          <div className="flex flex-wrap justify-between gap-2">
            <button type="button" onClick={sendCode} disabled={busy} className={LINK_BUTTON_CLASS}>
              Send a new code
            </button>
            <button type="button" onClick={useAnotherEmail} className={LINK_BUTTON_CLASS}>
              Use a different email
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
