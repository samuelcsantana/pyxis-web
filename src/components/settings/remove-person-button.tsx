'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { catchToState, withSmoothLoading } from 'rx-state-bridge';
import { defer, type Subscription, tap } from 'rxjs';
import { BUTTON_SECONDARY, CONTROL_BUSY } from '@/components/ui/control-classes';
import type { RemovePersonOutcome } from '@/domain/project-people';
import { useT } from '@/i18n/messages-provider';

export type RemovePerson = (adminUserId: string) => Promise<RemovePersonOutcome>;

export interface RemovePersonButtonProps {
  readonly adminUserId: string;
  readonly describedBy: string;
  readonly remove: RemovePerson;
}

type Refusal = 'ownerStays' | 'failed';

export const REMOVE_PERSON_MIN_BUSY_MS = 400;

const REFUSALS = {
  ownerStays: 'people.ownerStays',
  failed: 'people.removeFailed',
} as const satisfies Record<Refusal, string>;

export function RemovePersonButton({ adminUserId, describedBy, remove }: RemovePersonButtonProps) {
  const t = useT();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [removed, setRemoved] = useState(false);
  const [refusal, setRefusal] = useState<Refusal | null>(null);
  const request = useRef<Subscription | undefined>(undefined);

  useEffect(() => () => request.current?.unsubscribe(), []);

  const removeThis = () => {
    request.current?.unsubscribe();
    setRefusal(null);
    request.current = defer(() => remove(adminUserId))
      .pipe(
        tap((outcome) => {
          if (outcome.kind === 'ownerStays') {
            setRefusal('ownerStays');
            return;
          }
          setRemoved(true);
          router.refresh();
        }),
        catchToState(() => {
          setRefusal('failed');
        }),
        withSmoothLoading(setBusy, REMOVE_PERSON_MIN_BUSY_MS),
      )
      .subscribe();
  };

  if (removed) {
    return (
      <p role="status" className="text-xs font-medium text-ok">
        {t('people.removed')}
      </p>
    );
  }
  return (
    <div className="flex max-w-72 flex-col items-end gap-1">
      <button
        type="button"
        onClick={removeThis}
        disabled={busy}
        aria-busy={busy}
        aria-describedby={describedBy}
        className={`flex min-h-9 items-center rounded-input px-3 text-sm ${BUTTON_SECONDARY} ${CONTROL_BUSY}`}
      >
        {busy ? t('people.removing') : t('people.remove')}
      </button>
      {refusal === null ? null : (
        <p role="alert" className="text-right text-xs text-bad">
          {t(REFUSALS[refusal])}
        </p>
      )}
    </div>
  );
}
