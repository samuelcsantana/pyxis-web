'use client';

import { useRouter } from 'next/navigation';
import { type SubmitEvent, useEffect, useId, useRef, useState } from 'react';
import { catchToState, withSmoothLoading } from 'rx-state-bridge';
import { defer, type Subscription, tap } from 'rxjs';
import {
  BUTTON_DANGER,
  BUTTON_PRIMARY,
  BUTTON_SECONDARY,
  CONTROL_BUSY,
} from '@/components/ui/control-classes';
import {
  type SetShareLinkPasswordOutcome,
  type ShareLink,
  type SharePasswordProblem,
  sharePasswordProblem,
} from '@/domain/share-links';
import { useT } from '@/i18n/messages-provider';
import { SharePasswordField } from './share-password-field';

export type SetShareLinkPassword = (
  linkId: string,
  password: string | null,
) => Promise<SetShareLinkPasswordOutcome>;

export interface ShareLinkPasswordControlProps {
  readonly link: ShareLink;
  readonly describedBy: string;
  readonly setPassword: SetShareLinkPassword;
  readonly onChanged: (link: ShareLink) => void;
}

export const SET_SHARE_PASSWORD_MIN_BUSY_MS = 400;

type Step = 'idle' | 'editing' | 'removing';
type Notice = 'saved' | 'removed' | null;
type Failure = 'planRequired' | 'gone' | 'failed';

const SMALL_BUTTON = 'flex min-h-9 items-center rounded-input px-3 text-sm';
const ACTION_BUTTON = 'min-h-11 rounded-input px-4 text-sm';
const FAILURE_KEYS = {
  planRequired: 'shareLinks.planRequired',
  gone: 'shareLinks.linkGone',
  failed: 'shareLinks.passwordFailed',
} as const satisfies Record<Failure, string>;

export function ShareLinkPasswordControl({
  link,
  describedBy,
  setPassword,
  onChanged,
}: ShareLinkPasswordControlProps) {
  const t = useT();
  const router = useRouter();
  const fieldId = useId();
  const questionId = useId();
  const [step, setStep] = useState<Step>('idle');
  const [password, setPasswordText] = useState('');
  const [problem, setProblem] = useState<SharePasswordProblem | null>(null);
  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState<Failure | null>(null);
  const [notice, setNotice] = useState<Notice>(null);
  const request = useRef<Subscription | undefined>(undefined);
  const field = useRef<HTMLInputElement>(null);
  const confirmButton = useRef<HTMLButtonElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  const cancelled = useRef(false);

  useEffect(() => () => request.current?.unsubscribe(), []);

  useEffect(() => {
    if (step === 'editing') {
      field.current?.focus();
    }
    if (step === 'removing') {
      confirmButton.current?.focus();
    }
    if (step === 'idle' && cancelled.current) {
      cancelled.current = false;
      opener.current?.focus();
    }
  }, [step]);

  const cancel = () => {
    cancelled.current = true;
    open('idle');
  };

  const open = (next: Step) => {
    setStep(next);
    setPasswordText('');
    setProblem(null);
    setFailure(null);
    setNotice(null);
  };

  const send = (chosen: string | null) => {
    request.current?.unsubscribe();
    setFailure(null);
    request.current = defer(() => setPassword(link.id, chosen))
      .pipe(
        tap((outcome) => {
          if (outcome.kind !== 'changed') {
            setFailure(outcome.kind);
            return;
          }
          setStep('idle');
          setPasswordText('');
          setNotice(chosen === null ? 'removed' : 'saved');
          onChanged(outcome.link);
          router.refresh();
        }),
        catchToState(() => {
          setFailure('failed');
        }),
        withSmoothLoading(setBusy, SET_SHARE_PASSWORD_MIN_BUSY_MS),
      )
      .subscribe();
  };

  const save = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const found = sharePasswordProblem(password);
    setProblem(found);
    if (found !== null) {
      field.current?.focus();
      return;
    }
    send(password);
  };

  const failureText =
    failure === null ? null : (
      <p role="alert" className="text-sm text-bad">
        {t(FAILURE_KEYS[failure])}
      </p>
    );

  if (step === 'editing') {
    return (
      <form
        noValidate
        onSubmit={save}
        className="flex w-full flex-col gap-2.5 rounded-card border border-line bg-soft p-3.5"
      >
        <SharePasswordField
          id={fieldId}
          label={t('shareLinks.newPassword')}
          value={password}
          problem={problem}
          onChange={setPasswordText}
          fieldRef={field}
        />
        {link.passwordProtected ? (
          <p className="text-xs leading-[18px] text-muted">{t('shareLinks.changeNote')}</p>
        ) : null}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={busy}
            aria-busy={busy}
            className={`${ACTION_BUTTON} ${BUTTON_PRIMARY} ${CONTROL_BUSY}`}
          >
            {busy ? t('shareLinks.savingPassword') : t('shareLinks.savePassword')}
          </button>
          <button type="button" onClick={cancel} className={`${ACTION_BUTTON} ${BUTTON_SECONDARY}`}>
            {t('shareLinks.cancel')}
          </button>
          {failureText}
        </div>
      </form>
    );
  }

  if (step === 'removing') {
    return (
      <div
        role="group"
        aria-labelledby={questionId}
        className="flex w-full flex-col gap-2.5 rounded-card border border-bad bg-bad-soft p-3.5"
      >
        <p id={questionId} className="text-sm text-ink">
          {t('shareLinks.confirmRemovePassword', { name: link.name })}
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <button
            ref={confirmButton}
            type="button"
            onClick={() => {
              send(null);
            }}
            disabled={busy}
            aria-busy={busy}
            className={`${ACTION_BUTTON} ${BUTTON_DANGER} ${CONTROL_BUSY}`}
          >
            {busy ? t('shareLinks.removingPassword') : t('shareLinks.removePassword')}
          </button>
          <button type="button" onClick={cancel} className={`${ACTION_BUTTON} ${BUTTON_SECONDARY}`}>
            {t('shareLinks.cancel')}
          </button>
          {failureText}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {notice === null ? null : (
        <p role="status" className="text-xs font-medium text-ok">
          {notice === 'saved' ? t('shareLinks.passwordSaved') : t('shareLinks.passwordRemoved')}
        </p>
      )}
      <button
        ref={opener}
        type="button"
        onClick={() => {
          open('editing');
        }}
        aria-describedby={describedBy}
        className={`${SMALL_BUTTON} ${BUTTON_SECONDARY}`}
      >
        {link.passwordProtected ? t('shareLinks.changePassword') : t('shareLinks.setPassword')}
      </button>
      {link.passwordProtected ? (
        <button
          type="button"
          onClick={() => {
            open('removing');
          }}
          aria-describedby={describedBy}
          className={`${SMALL_BUTTON} ${BUTTON_SECONDARY}`}
        >
          {t('shareLinks.removePassword')}
        </button>
      ) : null}
    </div>
  );
}
