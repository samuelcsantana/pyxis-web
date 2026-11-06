'use client';

import { useRouter } from 'next/navigation';
import { type ReactNode, type SubmitEvent, useEffect, useId, useRef, useState } from 'react';
import { catchToState, withSmoothLoading } from 'rx-state-bridge';
import { defer, type Observable, type Subscription, tap } from 'rxjs';
import {
  BUTTON_DANGER,
  BUTTON_PRIMARY,
  BUTTON_SECONDARY,
  CONTROL_BUSY,
  FIELD,
  TEXT_LINK,
} from '@/components/ui/control-classes';
import {
  type SaveSlackWebhookOutcome,
  SLACK_WEBHOOK_DOCS_URL,
  type SlackWebhook,
  type SlackWebhookProblem,
  slackWebhookProblem,
  type TestSlackWebhookOutcome,
} from '@/domain/slack-webhook';
import { dateTimeFormat } from '@/i18n/date-time-formats';
import { displayTag } from '@/i18n/display-tag';
import { useLocale, useT } from '@/i18n/messages-provider';
import { rich } from '@/i18n/rich';

export type SaveSlackWebhook = (url: string) => Promise<SaveSlackWebhookOutcome>;
export type TestSlackWebhook = () => Promise<TestSlackWebhookOutcome>;
export type RemoveSlackWebhook = () => Promise<void>;

export interface SlackWebhookManagerProps {
  readonly initial: SlackWebhook | null;
  readonly onPro: boolean;
  readonly save: SaveSlackWebhook;
  readonly test: TestSlackWebhook;
  readonly remove: RemoveSlackWebhook;
  readonly timezone: string;
  readonly proOffer: ReactNode;
}

export const SLACK_MIN_BUSY_MS = 400;

type Busy = 'saving' | 'testing' | 'removing' | null;
type Notice =
  | { readonly kind: 'tested'; readonly result: 'sent' | 'broken' | 'failed' }
  | { readonly kind: 'refused'; readonly reason: Refusal };
type Refusal =
  'invalid' | 'planRequired' | 'unavailable' | 'tooMany' | 'missing' | 'failed' | 'removeFailed';

const SLACK_WEBHOOK_PLACEHOLDER = 'https://hooks.slack.com/services/…';
const FIELD_ID = 'slack-webhook-url';
const HINT_ID = 'slack-webhook-url-hint';
const ERROR_ID = 'slack-webhook-url-error';
const INPUT = `min-h-11 w-full rounded-input px-3 font-mono text-base placeholder:text-muted sm:text-sm ${FIELD}`;
const BUTTON = 'min-h-11 rounded-input px-4 text-sm';
const SMALL_BUTTON = 'flex min-h-9 items-center rounded-input px-3 text-sm';
const NOTE = 'text-xs leading-[18px] text-muted';
const PROBLEM_KEYS = {
  missing: 'slack.urlMissing',
  invalid: 'slack.urlInvalid',
} as const satisfies Record<SlackWebhookProblem, string>;
const REFUSAL_KEYS = {
  invalid: 'slack.urlInvalid',
  planRequired: 'slack.planRequired',
  unavailable: 'slack.unavailable',
  tooMany: 'slack.testTooMany',
  missing: 'slack.missing',
  failed: 'slack.failed',
  removeFailed: 'slack.removeFailed',
} as const satisfies Record<Refusal, string>;
const RESULT_KEYS = {
  sent: 'slack.testSent',
  broken: 'slack.testBroken',
  failed: 'slack.testFailed',
} as const;

export function SlackWebhookManager({
  initial,
  onPro,
  save,
  test,
  remove,
  timezone,
  proOffer,
}: SlackWebhookManagerProps) {
  const t = useT();
  const locale = useLocale();
  const router = useRouter();
  const questionId = useId();
  const [webhook, setWebhook] = useState(initial);
  const [editing, setEditing] = useState(initial === null);
  const [confirming, setConfirming] = useState(false);
  const [url, setUrl] = useState('');
  const [problem, setProblem] = useState<SlackWebhookProblem | null>(null);
  const [busy, setBusy] = useState<Busy>(null);
  const [notice, setNotice] = useState<Notice | null>(null);
  const request = useRef<Subscription | undefined>(undefined);
  const field = useRef<HTMLInputElement>(null);
  const confirmButton = useRef<HTMLButtonElement>(null);
  const format = dateTimeFormat(displayTag(locale), 'eventTime', timezone);

  useEffect(() => () => request.current?.unsubscribe(), []);

  useEffect(() => {
    if (confirming) {
      confirmButton.current?.focus();
    }
  }, [confirming]);

  const run = <Value,>(kind: Busy, work: () => Promise<Value>, then: (value: Value) => void) => {
    request.current?.unsubscribe();
    setNotice(null);
    const steps: Observable<Value> = defer(work).pipe(
      tap(then),
      catchToState(() => {
        setNotice({ kind: 'refused', reason: kind === 'removing' ? 'removeFailed' : 'failed' });
      }),
      withSmoothLoading((loading: boolean) => {
        setBusy(loading ? kind : null);
      }, SLACK_MIN_BUSY_MS),
    );
    request.current = steps.subscribe();
  };

  const submit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const found = slackWebhookProblem(url);
    setProblem(found);
    if (found !== null) {
      field.current?.focus();
      return;
    }
    run(
      'saving',
      () => save(url),
      (outcome) => {
        if (outcome.kind !== 'saved') {
          setNotice({ kind: 'refused', reason: outcome.kind });
          return;
        }
        setWebhook(outcome.webhook);
        setEditing(false);
        setUrl('');
        router.refresh();
      },
    );
  };

  const sendTest = () => {
    run('testing', test, (outcome) => {
      if (outcome.kind !== 'tested') {
        setNotice({ kind: 'refused', reason: outcome.kind });
        return;
      }
      setNotice(outcome);
      if (outcome.result === 'broken') {
        setWebhook(
          (current) =>
            current && { ...current, brokenAt: new Date().toISOString(), brokenReason: null },
        );
      }
    });
  };

  const confirmRemove = () => {
    run('removing', remove, () => {
      setWebhook(null);
      setConfirming(false);
      setEditing(true);
      router.refresh();
    });
  };

  const noticeText =
    notice === null ? null : notice.kind === 'tested' ? (
      <p
        role={notice.result === 'sent' ? 'status' : 'alert'}
        className={notice.result === 'sent' ? 'text-sm text-ok' : 'text-sm text-bad'}
      >
        {t(RESULT_KEYS[notice.result])}
      </p>
    ) : (
      <p role="alert" className="text-sm text-bad">
        {t(REFUSAL_KEYS[notice.reason])}
      </p>
    );

  const form = (
    <form noValidate onSubmit={submit} className="flex flex-col gap-3">
      <ol className="flex list-decimal flex-col gap-1.5 pl-5 text-sm">
        <li>
          {rich(t('slack.step1'), {
            link: (text) => (
              <a
                href={SLACK_WEBHOOK_DOCS_URL}
                className={TEXT_LINK}
                target="_blank"
                rel="noreferrer"
              >
                {text}
              </a>
            ),
          })}
        </li>
        <li>{t('slack.step2')}</li>
        <li>{t('slack.step3')}</li>
      </ol>
      <div className="flex flex-col gap-1.5">
        <label htmlFor={FIELD_ID} className="text-caption font-medium">
          {t('slack.url')}
        </label>
        <input
          ref={field}
          id={FIELD_ID}
          type="text"
          inputMode="url"
          autoComplete="off"
          spellCheck={false}
          value={url}
          onChange={(event) => {
            setUrl(event.target.value);
          }}
          placeholder={SLACK_WEBHOOK_PLACEHOLDER}
          aria-invalid={problem !== null}
          aria-describedby={problem === null ? HINT_ID : `${ERROR_ID} ${HINT_ID}`}
          className={INPUT}
        />
        <p id={HINT_ID} className={NOTE}>
          {t('slack.urlHint')}
        </p>
        {problem === null ? null : (
          <p id={ERROR_ID} role="alert" className="text-caption font-medium text-bad">
            {t(PROBLEM_KEYS[problem])}
          </p>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={busy !== null}
          aria-busy={busy === 'saving'}
          className={`${BUTTON} ${BUTTON_PRIMARY} ${CONTROL_BUSY}`}
        >
          {busy === 'saving' ? t('slack.saving') : t('slack.save')}
        </button>
        {webhook === null ? null : (
          <button
            type="button"
            onClick={() => {
              setEditing(false);
              setProblem(null);
              setUrl('');
            }}
            className={`${BUTTON} ${BUTTON_SECONDARY}`}
          >
            {t('slack.cancel')}
          </button>
        )}
      </div>
    </form>
  );

  return (
    <div className="flex flex-col gap-3">
      {webhook === null ? null : (
        <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
          <div className="flex min-w-0 flex-col gap-1">
            <span className="font-mono text-sm font-semibold text-ink wrap-anywhere">
              {webhook.maskedUrl}
            </span>
            {webhook.brokenAt === null ? (
              <p className={NOTE}>
                {t('slack.connected', { when: format(new Date(webhook.connectedAt)) })}
              </p>
            ) : (
              <p className="text-xs leading-[18px] font-medium text-bad">
                {webhook.brokenReason === null
                  ? t('slack.brokenNoReason', { when: format(new Date(webhook.brokenAt)) })
                  : t('slack.broken', {
                      when: format(new Date(webhook.brokenAt)),
                      reason: webhook.brokenReason,
                    })}
              </p>
            )}
          </div>
          {confirming ? null : (
            <div className="flex flex-wrap items-center gap-2">
              {onPro ? (
                <>
                  <button
                    type="button"
                    onClick={sendTest}
                    disabled={busy !== null}
                    aria-busy={busy === 'testing'}
                    className={`${SMALL_BUTTON} ${BUTTON_SECONDARY} ${CONTROL_BUSY}`}
                  >
                    {busy === 'testing' ? t('slack.testing') : t('slack.sendTest')}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(true);
                      setNotice(null);
                    }}
                    className={`${SMALL_BUTTON} ${BUTTON_SECONDARY}`}
                  >
                    {t('slack.replace')}
                  </button>
                </>
              ) : null}
              <button
                type="button"
                onClick={() => {
                  setConfirming(true);
                  setNotice(null);
                }}
                className={`${SMALL_BUTTON} ${BUTTON_SECONDARY}`}
              >
                {t('slack.remove')}
              </button>
            </div>
          )}
        </div>
      )}
      {confirming ? (
        <div
          role="group"
          aria-labelledby={questionId}
          className="flex w-full flex-col gap-2.5 rounded-card border border-bad bg-bad-soft p-3.5"
        >
          <p id={questionId} className="text-sm text-ink">
            {t('slack.confirmRemove')}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <button
              ref={confirmButton}
              type="button"
              onClick={confirmRemove}
              disabled={busy !== null}
              aria-busy={busy === 'removing'}
              className={`${BUTTON} ${BUTTON_DANGER} ${CONTROL_BUSY}`}
            >
              {busy === 'removing' ? t('slack.removing') : t('slack.remove')}
            </button>
            <button
              type="button"
              onClick={() => {
                setConfirming(false);
                setNotice(null);
              }}
              className={`${BUTTON} ${BUTTON_SECONDARY}`}
            >
              {t('slack.cancel')}
            </button>
          </div>
        </div>
      ) : null}
      {editing && !confirming ? (onPro ? form : proOffer) : null}
      {noticeText}
    </div>
  );
}
