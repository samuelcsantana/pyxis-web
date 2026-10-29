'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { catchToState, withSmoothLoading, withTemporarySuccess } from 'rx-state-bridge';
import { defer, type Subscription, tap } from 'rxjs';
import {
  BUTTON_PRIMARY,
  BUTTON_SECONDARY,
  CONTROL_BUSY,
  CONTROL_TRANSITION,
  FOCUS_RING,
} from '@/components/ui/control-classes';
import type { SetCityOutcome } from '@/domain/project-management';
import { useT } from '@/i18n/messages-provider';

export type SetCity = (cityEnabled: boolean) => Promise<SetCityOutcome>;

export interface CitySwitchProps {
  readonly initial: boolean;
  readonly setCity: SetCity;
}

export const CITY_SAVING_MIN_BUSY_MS = 400;
export const CITY_SAVED_NOTICE_MS = 2500;

type Refusal = 'subscriptionRequired' | 'failed';

const REFUSALS = {
  subscriptionRequired: 'cityOption.subscriptionRequired',
  failed: 'cityOption.failed',
} as const satisfies Record<Refusal, string>;

class CityRefusedError extends Error {
  constructor() {
    super('The API kept the city as it was: the subscription is required.');
    this.name = 'CityRefusedError';
  }
}

const TRACK = `relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-pill ${FOCUS_RING} ${CONTROL_TRANSITION} ${CONTROL_BUSY}`;
const TRACK_ON = 'bg-ink';
const TRACK_OFF = 'bg-field';
const THUMB = `inline-block size-4.5 rounded-pill bg-card shadow-sm transition-transform duration-150 motion-reduce:transition-none`;
const THUMB_ON = 'translate-x-[23px]';
const THUMB_OFF = 'translate-x-[3px]';
const DIALOG_BUTTON = `flex min-h-9 items-center rounded-input px-3 text-sm ${CONTROL_BUSY}`;

export function CitySwitch({ initial, setCity }: CitySwitchProps) {
  const t = useT();
  const labelId = useId();
  const noteId = useId();
  const confirmId = useId();
  const [on, setOn] = useState(initial);
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [refusal, setRefusal] = useState<Refusal | null>(null);
  const request = useRef<Subscription | undefined>(undefined);
  const notice = useRef<AbortController | undefined>(undefined);

  useEffect(
    () => () => {
      request.current?.unsubscribe();
      notice.current?.abort();
    },
    [],
  );

  const save = (wanted: boolean) => {
    request.current?.unsubscribe();
    notice.current?.abort();
    notice.current = new AbortController();
    setConfirming(false);
    setRefusal(null);
    setSaved(false);
    setOn(wanted);
    request.current = defer(() => setCity(wanted))
      .pipe(
        tap((outcome) => {
          if (outcome.kind === 'subscriptionRequired') {
            throw new CityRefusedError();
          }
          setOn(outcome.cityEnabled);
        }),
        withTemporarySuccess(setSaved, CITY_SAVED_NOTICE_MS, { signal: notice.current.signal }),
        catchToState((failure: unknown) => {
          setOn(!wanted);
          setRefusal(failure instanceof CityRefusedError ? 'subscriptionRequired' : 'failed');
        }),
        withSmoothLoading(setBusy, CITY_SAVING_MIN_BUSY_MS),
      )
      .subscribe();
  };

  const toggle = () => {
    if (on) {
      setRefusal(null);
      setConfirming(true);
      return;
    }
    save(true);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 flex-col gap-0.5">
          <span id={labelId} className="text-sm font-semibold text-ink">
            {t('cityOption.label')}
          </span>
          <span id={noteId} className="text-xs leading-[18px] text-muted">
            {t('cityOption.note')}
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-2 pt-0.5">
          <span aria-hidden="true" className="text-xs font-medium text-muted">
            {on ? t('cityOption.on') : t('cityOption.off')}
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={on}
            aria-labelledby={labelId}
            aria-describedby={noteId}
            aria-busy={busy}
            aria-expanded={confirming}
            aria-controls={confirming ? confirmId : undefined}
            onClick={toggle}
            className={`${TRACK} ${on ? TRACK_ON : TRACK_OFF}`}
          >
            <span aria-hidden="true" className={`${THUMB} ${on ? THUMB_ON : THUMB_OFF}`} />
          </button>
        </div>
      </div>
      {confirming ? (
        <div
          id={confirmId}
          role="group"
          aria-labelledby={`${confirmId}-title`}
          className="flex flex-col gap-2 rounded-input border border-line bg-soft p-3"
        >
          <p id={`${confirmId}-title`} className="text-sm font-semibold text-ink">
            {t('cityOption.confirmTitle')}
          </p>
          <p className="text-xs leading-[18px] text-ink">{t('cityOption.confirmBody')}</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                save(false);
              }}
              className={`${DIALOG_BUTTON} ${BUTTON_PRIMARY}`}
            >
              {t('cityOption.confirm')}
            </button>
            <button
              type="button"
              onClick={() => {
                setConfirming(false);
              }}
              className={`${DIALOG_BUTTON} ${BUTTON_SECONDARY}`}
            >
              {t('cityOption.keep')}
            </button>
          </div>
        </div>
      ) : null}
      <p aria-live="polite" className="min-h-[18px] text-xs leading-[18px] text-muted">
        {busy ? t('cityOption.saving') : saved ? t('cityOption.saved') : null}
      </p>
      {refusal === null ? null : (
        <p role="alert" className="text-xs leading-[18px] text-bad">
          {t(REFUSALS[refusal])}
        </p>
      )}
    </div>
  );
}
