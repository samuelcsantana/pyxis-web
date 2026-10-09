'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { catchToState, withSmoothLoading, withTemporarySuccess } from 'rx-state-bridge';
import { defer, type Subscription, tap } from 'rxjs';
import { CONTROL_BUSY, CONTROL_TRANSITION, FOCUS_RING } from '@/components/ui/control-classes';
import type { EmailPreferences } from '@/domain/email-preferences';
import { useT } from '@/i18n/messages-provider';

export type ChooseEmailPreferences = (preferences: EmailPreferences) => Promise<EmailPreferences>;

export interface WeeklyDigestSwitchProps {
  readonly initial: EmailPreferences;
  readonly timezone: string;
  readonly choose: ChooseEmailPreferences;
}

export const SAVING_MIN_BUSY_MS = 400;
export const SAVED_NOTICE_MS = 2500;

const TRACK = `relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-pill ${FOCUS_RING} ${CONTROL_TRANSITION} ${CONTROL_BUSY}`;
const TRACK_ON = 'bg-ink';
const TRACK_OFF = 'bg-field';
const THUMB = `inline-block size-4.5 rounded-pill bg-card shadow-sm transition-transform duration-150 motion-reduce:transition-none`;
const THUMB_ON = 'translate-x-[23px]';
const THUMB_OFF = 'translate-x-[3px]';

export function WeeklyDigestSwitch({ initial, timezone, choose }: WeeklyDigestSwitchProps) {
  const t = useT();
  const labelId = useId();
  const noteId = useId();
  const [on, setOn] = useState(initial.weeklyDigest);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const request = useRef<Subscription | undefined>(undefined);
  const notice = useRef<AbortController | undefined>(undefined);

  useEffect(
    () => () => {
      request.current?.unsubscribe();
      notice.current?.abort();
    },
    [],
  );

  const toggle = () => {
    const wanted = !on;
    request.current?.unsubscribe();
    notice.current?.abort();
    notice.current = new AbortController();
    setError(null);
    setSaved(false);
    setOn(wanted);
    request.current = defer(() => choose({ weeklyDigest: wanted }))
      .pipe(
        tap((chosen) => {
          setOn(chosen.weeklyDigest);
        }),
        withTemporarySuccess(setSaved, SAVED_NOTICE_MS, { signal: notice.current.signal }),
        catchToState((failure: unknown) => {
          setOn(!wanted);
          setError(failure);
        }),
        withSmoothLoading(setBusy, SAVING_MIN_BUSY_MS),
      )
      .subscribe();
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 flex-col gap-0.5">
          <span id={labelId} className="text-sm font-semibold text-ink">
            {t('emailPreferences.weeklyDigest')}
          </span>
          <span id={noteId} className="text-xs leading-[18px] text-muted">
            {t('emailPreferences.weeklyDigestNote', { timezone })}
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-2 pt-0.5">
          <span aria-hidden="true" className="text-xs font-medium text-muted">
            {on ? t('emailPreferences.on') : t('emailPreferences.off')}
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={on}
            aria-labelledby={labelId}
            aria-describedby={noteId}
            aria-busy={busy}
            onClick={toggle}
            className={`${TRACK} ${on ? TRACK_ON : TRACK_OFF}`}
          >
            <span aria-hidden="true" className={`${THUMB} ${on ? THUMB_ON : THUMB_OFF}`} />
          </button>
        </div>
      </div>
      <p aria-live="polite" className="min-h-[18px] text-xs leading-[18px] text-muted">
        {busy ? t('emailPreferences.saving') : saved ? t('emailPreferences.saved') : null}
      </p>
      {error === null ? null : (
        <p role="alert" className="text-xs leading-[18px] text-bad">
          {t('emailPreferences.failed')}
        </p>
      )}
    </div>
  );
}
