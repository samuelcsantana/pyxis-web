'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { catchToState, withSmoothLoading } from 'rx-state-bridge';
import { defer, type Subscription, tap } from 'rxjs';
import { BUTTON_SECONDARY, CONTROL_BUSY } from '@/components/ui/control-classes';
import { useT } from '@/i18n/messages-provider';

export type EndSession = (sessionId: string) => Promise<void>;

export interface EndSessionButtonProps {
  readonly sessionId: string;
  readonly end: EndSession;
}

export const END_SESSION_MIN_BUSY_MS = 400;

export function EndSessionButton({ sessionId, end }: EndSessionButtonProps) {
  const t = useT();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [ended, setEnded] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const request = useRef<Subscription | undefined>(undefined);

  useEffect(() => () => request.current?.unsubscribe(), []);

  const endThis = () => {
    request.current?.unsubscribe();
    setError(null);
    request.current = defer(() => end(sessionId))
      .pipe(
        tap(() => {
          setEnded(true);
          router.refresh();
        }),
        catchToState(setError),
        withSmoothLoading(setBusy, END_SESSION_MIN_BUSY_MS),
      )
      .subscribe();
  };

  if (ended) {
    return (
      <p role="status" className="text-xs font-medium text-ok">
        {t('sessions.ended')}
      </p>
    );
  }
  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={endThis}
        disabled={busy}
        aria-busy={busy}
        className={`flex min-h-9 items-center rounded-input px-3 text-sm ${BUTTON_SECONDARY} ${CONTROL_BUSY}`}
      >
        {busy ? t('sessions.ending') : t('sessions.end')}
      </button>
      {error === null ? null : (
        <p role="alert" className="text-xs text-bad">
          {t('sessions.failed')}
        </p>
      )}
    </div>
  );
}
