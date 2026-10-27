'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { type SubmitEvent, useEffect, useMemo, useRef, useState } from 'react';
import { catchToState, withSmoothLoading, withTemporarySuccess } from 'rx-state-bridge';
import { defer, finalize, type Subscription, tap } from 'rxjs';
import { BillingActions } from '@/components/account/billing-actions';
import { CodeField } from '@/components/sign-in/code-field';
import { DemoHint, FieldError } from '@/components/sign-in/form-messages';
import {
  BUTTON_PRIMARY,
  CONTROL_BUSY,
  CONTROL_DISABLED,
  FIELD,
  SEGMENTED_GROUP,
  SEGMENTED_IDLE,
  SEGMENTED_OPTION,
  SEGMENTED_SELECTED,
  TEXT_LINK,
} from '@/components/ui/control-classes';
import {
  BILLING_INTERVALS,
  type BillingInterval,
  type BillingRedirectOutcome,
} from '@/domain/accounts';
import { RateLimitedError } from '@/domain/errors';
import { countdownLabel, emailProblem } from '@/domain/sign-in';
import {
  FREE_PLAN_EVENTS_PER_MONTH,
  type FreePlanState,
  type OpenSignUp,
  type StepAfterSignUp,
  stepAfterSignUp,
  TRIAL_DAYS,
  type VerifySignUpOutcome,
} from '@/domain/sign-up';
import { displayTag } from '@/i18n/display-tag';
import { useLocale, useT } from '@/i18n/messages-provider';
import { rich } from '@/i18n/rich';
import type { ISignUpService } from '@/services/sign-up/sign-up-service.interface';
import { createSignUpService } from '@/services/sign-up/sign-up-service.factory';
import { FreePlaceWait } from './free-place-wait';

export type OpenCheckoutFor = (
  accountId: string,
  interval: BillingInterval,
) => Promise<BillingRedirectOutcome>;

export interface SignUpFormProps {
  readonly terms: OpenSignUp | null;
  readonly unfinishedAccountId?: string;
  readonly unfinishedWaitsForAFreePlace?: boolean;
  readonly openCheckout: OpenCheckoutFor;
  readonly signUpService?: ISignUpService;
  readonly demoCode?: string;
  readonly initialInterval?: BillingInterval;
}

type Step = 'details' | 'code' | 'checkout' | 'opening' | 'waiting';
type Failure =
  | 'emailMissing'
  | 'emailMalformed'
  | 'termsMissing'
  | 'invalidCode'
  | 'termsOutdated'
  | 'closed'
  | 'rateLimited'
  | 'unreachable'
  | 'checkoutFailed';

export const SIGN_UP_CODE_LENGTH = 6;
export const SIGN_UP_BUSY_MS = 400;
export const SIGN_UP_RESEND_WAIT_MS = 30_000;
export const SIGN_UP_RESENT_NOTICE_MS = 8_000;
export const ACCOUNT_PAGE_PATH = '/account';
export const SIGN_IN_PATH = '/sign-in';
export const DASHBOARD_PATH = '/';

export function welcomePathOf(accountId: string): string {
  return `/welcome?account=${encodeURIComponent(accountId)}`;
}

const MAX_EMAIL_LENGTH = 254;
const NOT_A_DIGIT = /[^0-9]/g;
const ONE_SECOND_MS = 1_000;
const EMAIL_ID = 'sign-up-email';
const TERMS_ID = 'sign-up-terms';
const CODE_ID = 'sign-up-code';
const ERROR_ID = 'sign-up-error';
const CARD_CLASS =
  'flex w-full max-w-[440px] flex-col gap-4 rounded-panel border border-line bg-card p-8 text-ink';
const INPUT_CLASS = `min-h-11.5 w-full rounded-input px-3.5 text-base placeholder:text-muted sm:text-callout ${FIELD}`;
const PRIMARY_BUTTON_CLASS = `min-h-11.5 rounded-input px-4 text-callout ${BUTTON_PRIMARY} ${CONTROL_BUSY}`;
const LINK_BUTTON_CLASS = `self-start text-sm ${TEXT_LINK} ${CONTROL_DISABLED}`;
const INTERVAL_LABELS = { month: 'signUp.monthly', year: 'signUp.yearly' } as const;
const TITLES = {
  closed: 'signUp.title',
  open: 'signUp.freeTitle',
  full: 'signUp.fullTitle',
} as const satisfies Record<FreePlanState, string>;
const FAILURE_TEXT = {
  emailMissing: 'signIn.validation.emailMissing',
  emailMalformed: 'signIn.validation.emailMalformed',
  termsMissing: 'signUp.termsMissing',
  invalidCode: 'signUp.invalidCode',
  termsOutdated: 'signUp.termsOutdated',
  closed: 'signUp.closed',
  rateLimited: 'signUp.rateLimited',
  unreachable: 'signUp.unreachable',
  checkoutFailed: 'signUp.checkoutFailed',
} as const satisfies Record<Failure, string>;

function digitsOf(value: string): string {
  return value.replace(NOT_A_DIGIT, '').slice(0, SIGN_UP_CODE_LENGTH);
}

function failureOf(error: unknown): Failure {
  return error instanceof RateLimitedError ? 'rateLimited' : 'unreachable';
}

export function SignUpForm({
  terms,
  unfinishedAccountId,
  unfinishedWaitsForAFreePlace = false,
  openCheckout,
  signUpService,
  demoCode,
  initialInterval = 'month',
}: SignUpFormProps) {
  const t = useT();
  const locale = useLocale();
  const router = useRouter();
  const service = useMemo(() => signUpService ?? createSignUpService(), [signUpService]);
  const [step, setStep] = useState<Step>('details');
  const [interval, chooseInterval] = useState<BillingInterval>(initialInterval);
  const [email, setEmail] = useState('');
  const [accepted, setAccepted] = useState(false);
  const [acceptedVersion, setAcceptedVersion] = useState('');
  const [freePlanAtSignUp, setFreePlanAtSignUp] = useState<FreePlanState>('closed');
  const [newAccountId, setNewAccountId] = useState('');
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState<Failure | null>(null);
  const [resent, setResent] = useState(false);
  const [resendAt, setResendAt] = useState(0);
  const [now, setNow] = useState(0);
  const request = useRef<Subscription | undefined>(undefined);
  const emailInput = useRef<HTMLInputElement>(null);
  const codeInput = useRef<HTMLInputElement>(null);
  const verifying = useRef(false);
  const checkingOut = useRef(false);

  useEffect(() => () => request.current?.unsubscribe(), []);

  useEffect(() => {
    if (resendAt <= Date.now()) {
      return;
    }
    const timer = setInterval(() => {
      const current = Date.now();
      setNow(current);
      if (current >= resendAt) {
        clearInterval(timer);
      }
    }, ONE_SECOND_MS);
    return () => {
      clearInterval(timer);
    };
  }, [resendAt]);

  useEffect(() => {
    (step === 'code' ? codeInput : emailInput).current?.focus();
  }, [step]);

  const start = () => {
    request.current?.unsubscribe();
    setFailure(null);
  };

  const sendCode = (again: boolean) => {
    start();
    request.current = defer(() => service.requestCode(email.trim(), locale))
      .pipe(
        tap(() => {
          const sentAt = Date.now();
          setStep('code');
          setCode('');
          setResendAt(sentAt + SIGN_UP_RESEND_WAIT_MS);
          setNow(sentAt);
        }),
        withTemporarySuccess(again ? setResent : () => undefined, SIGN_UP_RESENT_NOTICE_MS),
        catchToState((error) => {
          setFailure(failureOf(error));
        }),
        withSmoothLoading(setBusy, SIGN_UP_BUSY_MS),
      )
      .subscribe();
  };

  const checkOut = async (accountId: string): Promise<void> => {
    checkingOut.current = true;
    setStep('checkout');
    const checkout = await openCheckout(accountId, interval);
    if (checkout.kind === 'redirect') {
      window.location.assign(checkout.url);
      return;
    }
    setFailure('checkoutFailed');
  };

  const continueAfterSignUp = async (accountId: string, next: StepAfterSignUp): Promise<void> => {
    if (next === 'checkout') {
      await checkOut(accountId);
      return;
    }
    if (next === 'waitForAFreePlace') {
      setNewAccountId(accountId);
      setStep('waiting');
      return;
    }
    setStep('opening');
    router.replace(next === 'welcome' ? welcomePathOf(accountId) : DASHBOARD_PATH);
    router.refresh();
  };

  const afterVerify = async (outcome: VerifySignUpOutcome): Promise<void> => {
    if (outcome.kind === 'verified') {
      await continueAfterSignUp(
        outcome.accountId,
        stepAfterSignUp(outcome.accountStatus, freePlanAtSignUp),
      );
      return;
    }
    setFailure(outcome.kind);
    if (outcome.kind === 'invalidCode') {
      codeInput.current?.select();
      return;
    }
    setStep('details');
    setAccepted(false);
    router.refresh();
  };

  const verify = (value: string) => {
    start();
    verifying.current = true;
    request.current = defer(async () => {
      await afterVerify(await service.verify(email.trim(), value, acceptedVersion));
    })
      .pipe(
        finalize(() => {
          verifying.current = false;
        }),
        catchToState((error) => {
          setFailure(checkingOut.current ? 'checkoutFailed' : failureOf(error));
        }),
        withSmoothLoading(setBusy, SIGN_UP_BUSY_MS),
      )
      .subscribe();
  };

  const submitDetails = (event: SubmitEvent<HTMLFormElement>, openTerms: OpenSignUp) => {
    event.preventDefault();
    const problem = emailProblem(email);
    if (problem === 'emailMissing' || problem === 'emailMalformed') {
      setFailure(problem);
      emailInput.current?.focus();
      return;
    }
    if (!accepted) {
      setFailure('termsMissing');
      return;
    }
    setAcceptedVersion(openTerms.termsVersion);
    setFreePlanAtSignUp(openTerms.freePlan);
    sendCode(false);
  };

  const changeCode = (value: string) => {
    const digits = digitsOf(value);
    setCode(digits);
    setFailure(null);
    if (digits.length === SIGN_UP_CODE_LENGTH && !verifying.current) {
      verify(digits);
    }
  };

  const submitCode = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (code.length === SIGN_UP_CODE_LENGTH) {
      verify(code);
    } else {
      codeInput.current?.focus();
    }
  };

  const errorText = failure === null ? null : t(FAILURE_TEXT[failure]);
  const freePlanEvents = new Intl.NumberFormat(displayTag(locale)).format(
    FREE_PLAN_EVENTS_PER_MONTH,
  );
  const digits = String(SIGN_UP_CODE_LENGTH);
  const waitLeft = Math.max(0, resendAt - now);
  const fieldFailure = failure === 'emailMissing' || failure === 'emailMalformed';

  if (step === 'waiting') {
    return <FreePlaceWait subscribe={(chosen) => openCheckout(newAccountId, chosen)} />;
  }

  if (unfinishedAccountId !== undefined && step === 'details') {
    if (unfinishedWaitsForAFreePlace) {
      return <FreePlaceWait subscribe={(chosen) => openCheckout(unfinishedAccountId, chosen)} />;
    }
    return (
      <section className={CARD_CLASS}>
        <h1 className="text-title font-semibold">{t('signUp.finishTitle')}</h1>
        <p className="text-sm text-muted">{t('signUp.finishBody')}</p>
        <BillingActions
          kind="checkout"
          open={(chosen) => openCheckout(unfinishedAccountId, chosen)}
        />
      </section>
    );
  }

  if (terms === null) {
    return null;
  }

  if (step === 'opening') {
    return (
      <section className={CARD_CLASS}>
        <p role="status" className="text-sm font-semibold">
          {t('signUp.opening')}
        </p>
      </section>
    );
  }

  if (step === 'checkout') {
    return (
      <section className={CARD_CLASS}>
        {failure === 'checkoutFailed' ? (
          <>
            <FieldError id={ERROR_ID} text={t('signUp.checkoutFailed')} />
            <Link href={ACCOUNT_PAGE_PATH} className={`self-start text-sm ${TEXT_LINK}`}>
              {t('signUp.openAccount')}
            </Link>
          </>
        ) : (
          <p role="status" className="text-sm font-semibold">
            {t('signUp.preparing')}
          </p>
        )}
      </section>
    );
  }

  return (
    <section className="flex w-full max-w-[440px] flex-col gap-5 rounded-panel border border-line bg-card p-8 text-ink">
      {step === 'details' ? (
        <form
          noValidate
          onSubmit={(event) => {
            submitDetails(event, terms);
          }}
          className="flex flex-col gap-5"
        >
          <div className="flex flex-col gap-1.5">
            <h1 className="text-title font-semibold">{t(TITLES[terms.freePlan])}</h1>
            {terms.freePlan === 'closed' ? (
              <>
                <p className="text-sm leading-5 text-muted">
                  {t('signUp.intro', { days: String(TRIAL_DAYS) })}
                </p>
                <p className="text-sm leading-5 text-muted">{t('signUp.oneTrial')}</p>
              </>
            ) : (
              <p className="text-sm leading-5 text-muted">
                {terms.freePlan === 'open'
                  ? t('signUp.freeIntro', { events: freePlanEvents })
                  : t('signUp.fullIntro')}
              </p>
            )}
          </div>
          {terms.freePlan === 'closed' ? (
            <div className="flex flex-col gap-1.5">
              <span id="sign-up-plan" className="text-caption font-medium">
                {t('signUp.plan')}
              </span>
              <div
                role="group"
                aria-labelledby="sign-up-plan"
                className={`self-start ${SEGMENTED_GROUP}`}
              >
                {BILLING_INTERVALS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={interval === option}
                    onClick={() => {
                      chooseInterval(option);
                    }}
                    className={`min-h-9 px-3 ${SEGMENTED_OPTION} ${interval === option ? SEGMENTED_SELECTED : SEGMENTED_IDLE}`}
                  >
                    {t(INTERVAL_LABELS[option])}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
          <div className="flex flex-col gap-1.5">
            <label htmlFor={EMAIL_ID} className="text-caption font-medium">
              {t('signUp.email')}
            </label>
            <input
              ref={emailInput}
              id={EMAIL_ID}
              type="email"
              autoComplete="email"
              maxLength={MAX_EMAIL_LENGTH}
              placeholder={t('signUp.emailPlaceholder')}
              value={email}
              aria-invalid={fieldFailure}
              aria-describedby={fieldFailure ? ERROR_ID : undefined}
              onChange={(event) => {
                setEmail(event.target.value);
                setFailure(null);
              }}
              className={INPUT_CLASS}
            />
          </div>
          <div className="flex items-start gap-2.5">
            <input
              id={TERMS_ID}
              type="checkbox"
              checked={accepted}
              aria-invalid={failure === 'termsMissing'}
              aria-describedby={failure === 'termsMissing' ? ERROR_ID : undefined}
              onChange={(event) => {
                setAccepted(event.target.checked);
                setFailure(null);
              }}
              className="mt-0.5 size-4.5 shrink-0 accent-accent"
            />
            <label htmlFor={TERMS_ID} className="text-sm leading-5">
              {rich(t('signUp.terms', { version: terms.termsVersion }), {
                link: (text) => (
                  <a href={terms.termsUrl} target="_blank" rel="noreferrer" className={TEXT_LINK}>
                    {text}
                  </a>
                ),
              })}
            </label>
          </div>
          {errorText === null ? null : <FieldError id={ERROR_ID} text={errorText} />}
          <button type="submit" disabled={busy} aria-busy={busy} className={PRIMARY_BUTTON_CLASS}>
            {busy ? t('signUp.sending') : t('signUp.sendCode')}
          </button>
          <p className="text-sm text-muted">
            {t('signUp.haveAccount')}{' '}
            <Link href={SIGN_IN_PATH} className={TEXT_LINK}>
              {t('signUp.signIn')}
            </Link>
          </p>
        </form>
      ) : (
        <form noValidate onSubmit={submitCode} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <h1 className="text-title font-semibold">{t('signUp.checkTitle')}</h1>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="min-w-0 font-semibold wrap-anywhere">{email.trim()}</span>
              <button
                type="button"
                onClick={() => {
                  start();
                  setStep('details');
                  setCode('');
                }}
                aria-label={t('signUp.changeEmail')}
                className={`text-sm ${TEXT_LINK}`}
              >
                {t('signUp.change')}
              </button>
            </div>
            <p className="text-sm leading-5 text-muted">{t('signUp.checkBody', { digits })}</p>
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor={CODE_ID} className="text-caption font-medium">
              {t('signUp.code', { digits })}
            </label>
            <CodeField
              inputRef={codeInput}
              id={CODE_ID}
              length={SIGN_UP_CODE_LENGTH}
              value={code}
              invalid={errorText !== null}
              describedBy={errorText === null ? undefined : ERROR_ID}
              onChange={changeCode}
            />
            {errorText === null ? null : <FieldError id={ERROR_ID} text={errorText} />}
          </div>
          {demoCode === undefined ? null : (
            <DemoHint
              code={demoCode}
              message={t('signUp.demoCode')}
              action={
                <button
                  type="button"
                  onClick={() => {
                    changeCode(demoCode);
                  }}
                  className={LINK_BUTTON_CLASS}
                >
                  {t('signUp.demoFill', { code: demoCode })}
                </button>
              }
            />
          )}
          <button type="submit" disabled={busy} aria-busy={busy} className={PRIMARY_BUTTON_CLASS}>
            {busy ? t('signUp.verifying') : t('signUp.verify')}
          </button>
          <div className="flex flex-col items-start gap-1">
            <button
              type="button"
              onClick={() => {
                sendCode(true);
              }}
              disabled={busy || waitLeft > 0}
              className={LINK_BUTTON_CLASS}
            >
              {waitLeft > 0
                ? t('signUp.resendIn', { time: countdownLabel(waitLeft) })
                : t('signUp.resend')}
            </button>
            <p role="status" className="text-caption text-ok">
              {resent ? t('signUp.resent') : ''}
            </p>
          </div>
        </form>
      )}
    </section>
  );
}
