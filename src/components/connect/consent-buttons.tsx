'use client';

import { useEffect, useRef, useState } from 'react';
import { catchToState, withSmoothLoading } from 'rx-state-bridge';
import { defer, type Subscription, tap } from 'rxjs';
import {
  BUTTON_PRIMARY,
  BUTTON_SECONDARY,
  CONTROL_BUSY,
  TEXT_LINK,
} from '@/components/ui/control-classes';
import {
  type AllowConnectionOutcome,
  CONNECTION_REQUEST_MINUTES,
  type DenyConnectionOutcome,
  MAX_CONNECTED_APPS,
} from '@/domain/connection-requests';
import { useT } from '@/i18n/messages-provider';
import { rich } from '@/i18n/rich';

export type AllowConnection = () => Promise<AllowConnectionOutcome>;
export type DenyConnection = () => Promise<DenyConnectionOutcome>;

export interface ConsentButtonsProps {
  readonly app: string;
  readonly allow: AllowConnection;
  readonly deny: DenyConnection;
  readonly limitReached: boolean;
  readonly settingsHref: string | null;
}

type Answer = 'allow' | 'deny';
type Problem = 'gone' | 'tooMany' | 'failed';

export const CONSENT_MIN_BUSY_MS = 400;

const BUTTON = 'flex min-h-11 items-center rounded-input px-4 text-sm';
const ALERT = 'text-sm font-medium text-bad';

export function ConsentButtons({
  app,
  allow,
  deny,
  limitReached,
  settingsHref,
}: ConsentButtonsProps) {
  const t = useT();
  const [answering, setAnswering] = useState<Answer | null>(null);
  const [busy, setBusy] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [problem, setProblem] = useState<Problem | null>(null);
  const request = useRef<Subscription | undefined>(undefined);

  useEffect(() => () => request.current?.unsubscribe(), []);

  const answer = (choice: Answer) => {
    request.current?.unsubscribe();
    setProblem(null);
    setAnswering(choice);
    request.current = defer(() => (choice === 'allow' ? allow() : deny()))
      .pipe(
        tap((outcome) => {
          if (outcome.kind === 'redirect') {
            setLeaving(true);
            window.location.assign(outcome.url);
            return;
          }
          setProblem(outcome.kind);
        }),
        catchToState(() => {
          setProblem('failed');
        }),
        withSmoothLoading(setBusy, CONSENT_MIN_BUSY_MS),
      )
      .subscribe();
  };

  const full = limitReached || problem === 'tooMany';
  const finished = leaving || problem === 'gone';
  const allowBusy = busy && answering === 'allow';
  const denyBusy = busy && answering === 'deny';

  return (
    <div className="flex flex-col gap-3">
      {full ? (
        <p role="status" className="text-sm">
          {rich(t('consent.tooMany', { max: String(MAX_CONNECTED_APPS) }), {
            settings: (text) =>
              settingsHref === null ? (
                text
              ) : (
                <a href={settingsHref} className={TEXT_LINK}>
                  {text}
                </a>
              ),
          })}
        </p>
      ) : null}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => {
            answer('allow');
          }}
          disabled={full || busy || finished}
          aria-busy={allowBusy}
          className={`${BUTTON} ${BUTTON_PRIMARY} ${CONTROL_BUSY}`}
        >
          {allowBusy ? t('consent.allowing') : t('consent.allow')}
        </button>
        <button
          type="button"
          onClick={() => {
            answer('deny');
          }}
          disabled={busy || finished}
          aria-busy={denyBusy}
          className={`${BUTTON} ${BUTTON_SECONDARY} ${CONTROL_BUSY}`}
        >
          {denyBusy ? t('consent.cancelling') : t('consent.cancel')}
        </button>
      </div>
      {leaving ? (
        <p role="status" className="text-sm font-medium">
          {t('consent.leaving', { app })}
        </p>
      ) : null}
      {problem === 'gone' ? (
        <p role="alert" className={ALERT}>
          {t('consent.gone', { minutes: String(CONNECTION_REQUEST_MINUTES) })}
        </p>
      ) : null}
      {problem === 'failed' ? (
        <p role="alert" className={ALERT}>
          {t('consent.failed')}
        </p>
      ) : null}
    </div>
  );
}
