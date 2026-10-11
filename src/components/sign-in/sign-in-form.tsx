'use client';

import { useRouter } from 'next/navigation';
import { type SubmitEvent, useEffect, useMemo, useRef, useState } from 'react';
import { catchToState, withSmoothLoading, withTemporarySuccess } from 'rx-state-bridge';
import { defer, finalize, type Subscription, tap } from 'rxjs';
import { InvalidCodeError, RateLimitedError } from '@/domain/errors';
import { codeProblem, emailProblem, type SignInFieldProblem } from '@/domain/sign-in';
import type { ClientSourceMessages } from '@/i18n/messages';
import { useLocale, useT } from '@/i18n/messages-provider';
import { rich } from '@/i18n/rich';
import type { Translator } from '@/i18n/translate';
import type { IAuthService } from '@/services/auth/auth-service.interface';
import { createAuthService } from '@/services/auth/auth-service.factory';
import { CodeField } from './code-field';
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
const CODE_ERROR_ID = 'sign-in-error';
const ALERT_ICON = 'M12 3a9 9 0 1 1 0 18a9 9 0 1 1 0-18 M12 7.5v5.5 M12 16.5h.01';
const HOME_PATH = '/';

type Step = 'email' | 'code';

export interface SignInFormProps {
  readonly authService?: IAuthService;
  readonly sessionExpired?: boolean;
  readonly demoCode?: string;
  readonly returnPath?: string;
}

const PROBLEM_MESSAGES: Readonly<
  Record<SignInFieldProblem, (t: Translator<ClientSourceMessages>) => string>
> = {
  emailMissing: (t) => t('signIn.validation.emailMissing'),
  emailMalformed: (t) => t('signIn.validation.emailMalformed'),
  codeIncomplete: (t) =>
    t('signIn.validation.codeIncomplete', { digits: String(SIGN_IN_CODE_LENGTH) }),
};

export function signInProblemMessage(
  problem: SignInFieldProblem,
  t: Translator<ClientSourceMessages>,
): string {
  return PROBLEM_MESSAGES[problem](t);
}

function digitsOfCode(value: string): string {
  return value.replace(NOT_A_DIGIT, '').slice(0, SIGN_IN_CODE_LENGTH);
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

interface FieldErrorProps {
  readonly id: string;
  readonly text: string;
}

function FieldError({ id, text }: FieldErrorProps) {
  return (
    <p id={id} role="alert" className="flex items-start gap-1.5 text-caption font-medium text-bad">
      <svg width={16} height={16} viewBox="0 0 24 24" aria-hidden="true" className="mt-px shrink-0">
        <path
          d={ALERT_ICON}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span>{text}</span>
    </p>
  );
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
  const [problem, setProblem] = useState<SignInFieldProblem | null>(null);
  const request = useRef<Subscription | undefined>(undefined);
  const notice = useRef<AbortController | undefined>(undefined);
  const codeInput = useRef<HTMLInputElement>(null);
  const emailInput = useRef<HTMLInputElement>(null);
  const shownStep = useRef<Step>(step);
  const verifiedOnItsOwn = useRef('');
  const verifying = useRef(false);

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

  const forgetErrors = () => {
    setError(null);
    setProblem(null);
  };

  const start = () => {
    request.current?.unsubscribe();
    forgetErrors();
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

  const selectCodeForRetyping = () => {
    verifiedOnItsOwn.current = '';
    codeInput.current?.focus();
    codeInput.current?.select();
  };

  const verifyCode = (value: string) => {
    start();
    verifying.current = true;
    request.current = defer(() => service.verifyCode(email.trim(), value))
      .pipe(
        finalize(() => {
          verifying.current = false;
        }),
        tap({
          next: () => {
            router.replace(returnPath);
            router.refresh();
          },
          error: selectCodeForRetyping,
        }),
        catchToState(setError),
        withSmoothLoading(setBusy, SMOOTH_LOADING_MS),
      )
      .subscribe();
  };

  const submitEmail = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const found = emailProblem(email);
    if (found !== null) {
      setProblem(found);
      emailInput.current?.focus();
      return;
    }
    sendCode();
  };

  const submitCode = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const found = codeProblem(code, SIGN_IN_CODE_LENGTH);
    if (found !== null) {
      setProblem(found);
      codeInput.current?.focus();
      return;
    }
    verifyCode(code);
  };

  const changeCode = (value: string) => {
    const digits = digitsOfCode(value);
    setCode(digits);
    forgetErrors();
    if (digits.length < SIGN_IN_CODE_LENGTH) {
      verifiedOnItsOwn.current = '';
      return;
    }
    if (verifying.current || digits === verifiedOnItsOwn.current) {
      return;
    }
    verifiedOnItsOwn.current = digits;
    verifyCode(digits);
  };

  const useAnotherEmail = () => {
    start();
    setStep('email');
    setCode('');
  };

  const errorText =
    problem !== null
      ? signInProblemMessage(problem, t)
      : error === null
        ? null
        : signInErrorMessage(error, t);
  const digits = String(SIGN_IN_CODE_LENGTH);

  return (
    <section className="flex w-full max-w-[420px] flex-col gap-5 rounded-panel border border-line bg-card p-8 text-ink">
      {step === 'email' ? (
        <form noValidate onSubmit={submitEmail} className="flex flex-col gap-5">
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
                forgetErrors();
              }}
              className={`${INPUT_CLASS} text-base sm:text-callout`}
            />
            {errorText === null ? null : <FieldError id={EMAIL_ERROR_ID} text={errorText} />}
          </div>
          {demoCode === undefined ? null : (
            <DemoHint code={demoCode} message={t('signIn.demoEmail')} />
          )}
          <button type="submit" disabled={busy} aria-busy={busy} className={PRIMARY_BUTTON_CLASS}>
            {busy ? t('signIn.sending') : t('signIn.sendCode')}
          </button>
        </form>
      ) : (
        <form noValidate onSubmit={submitCode} className="flex flex-col gap-5">
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
            <CodeField
              inputRef={codeInput}
              id="sign-in-code"
              length={SIGN_IN_CODE_LENGTH}
              value={code}
              invalid={errorText !== null}
              describedBy={errorText === null ? undefined : CODE_ERROR_ID}
              onChange={changeCode}
            />
            {errorText === null ? (
              <p role="status" className="min-h-5 text-caption text-ok">
                {codeSent ? t('signIn.codeSent') : ''}
              </p>
            ) : (
              <FieldError id={CODE_ERROR_ID} text={errorText} />
            )}
          </div>
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
