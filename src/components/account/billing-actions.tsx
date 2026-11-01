'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { catchToState, withSmoothLoading } from 'rx-state-bridge';
import { defer, type Subscription, tap } from 'rxjs';
import {
  BUTTON_PRIMARY,
  BUTTON_SECONDARY,
  CONTROL_BUSY,
  SEGMENTED_GROUP,
  SEGMENTED_IDLE,
  SEGMENTED_OPTION,
  SEGMENTED_SELECTED,
} from '@/components/ui/control-classes';
import {
  BILLING_INTERVALS,
  type BillingInterval,
  type BillingRedirectOutcome,
} from '@/domain/accounts';
import { useT } from '@/i18n/messages-provider';

export type OpenCheckout = (interval: BillingInterval) => Promise<BillingRedirectOutcome>;
export type OpenBillingPortal = () => Promise<BillingRedirectOutcome>;

export type BillingActionsProps =
  | { readonly kind: 'checkout' | 'subscribe' | 'resubscribe'; readonly open: OpenCheckout }
  | { readonly kind: 'portal'; readonly open: OpenBillingPortal };

type Refusal = 'noBillingYet' | 'subscriptionExists' | 'unavailable' | 'failed';

export const OPEN_BILLING_MIN_BUSY_MS = 400;

const REFUSALS = {
  noBillingYet: 'billing.noBillingYet',
  subscriptionExists: 'billing.subscriptionExists',
  unavailable: 'billing.unavailable',
  failed: 'billing.failed',
} as const satisfies Record<Refusal, string>;
const INTERVAL_LABELS = { month: 'billing.monthly', year: 'billing.yearly' } as const;
const ACTION_LABELS = {
  checkout: 'billing.finish',
  subscribe: 'billing.subscribe',
  resubscribe: 'billing.subscribeAgain',
  portal: 'billing.manage',
} as const satisfies Record<BillingActionsProps['kind'], string>;

function refusalMessage(kind: BillingActionsProps['kind'], refusal: Refusal) {
  return kind === 'resubscribe' && refusal === 'unavailable'
    ? 'billing.resubscribeUnavailable'
    : REFUSALS[refusal];
}

export function BillingActions(props: BillingActionsProps) {
  const t = useT();
  const groupId = useId();
  const [interval, chooseInterval] = useState<BillingInterval>('month');
  const [busy, setBusy] = useState(false);
  const [refusal, setRefusal] = useState<Refusal | null>(null);
  const request = useRef<Subscription | undefined>(undefined);

  useEffect(() => () => request.current?.unsubscribe(), []);

  const open = () => {
    request.current?.unsubscribe();
    setRefusal(null);
    request.current = defer(() => (props.kind === 'portal' ? props.open() : props.open(interval)))
      .pipe(
        tap((outcome) => {
          if (outcome.kind === 'redirect') {
            window.location.assign(outcome.url);
            return;
          }
          setRefusal(outcome.kind);
        }),
        catchToState(() => {
          setRefusal('failed');
        }),
        withSmoothLoading(setBusy, OPEN_BILLING_MIN_BUSY_MS),
      )
      .subscribe();
  };

  return (
    <div className="flex flex-col gap-3">
      {props.kind === 'portal' ? null : (
        <div className="flex flex-col gap-1.5">
          <span id={groupId} className="text-caption font-medium">
            {t('billing.interval')}
          </span>
          <div role="group" aria-labelledby={groupId} className={`self-start ${SEGMENTED_GROUP}`}>
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
      )}
      <button
        type="button"
        onClick={open}
        disabled={busy}
        aria-busy={busy}
        className={`min-h-11 self-start rounded-input px-4 text-sm ${props.kind === 'portal' ? BUTTON_SECONDARY : BUTTON_PRIMARY} ${CONTROL_BUSY}`}
      >
        {busy ? t('billing.opening') : t(ACTION_LABELS[props.kind])}
      </button>
      {refusal === null ? null : (
        <p role="alert" className="text-caption font-medium text-bad">
          {t(refusalMessage(props.kind, refusal))}
        </p>
      )}
    </div>
  );
}
