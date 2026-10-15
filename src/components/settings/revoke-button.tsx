'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { catchToState, withSmoothLoading } from 'rx-state-bridge';
import { defer, type Subscription, tap } from 'rxjs';
import { BUTTON_SECONDARY, CONTROL_BUSY } from '@/components/ui/control-classes';
import { useT } from '@/i18n/messages-provider';

export type Revoke = (id: string) => Promise<void>;
export type RevokeTexts = 'accessTokens' | 'connections';

export interface RevokeButtonProps {
  readonly id: string;
  readonly describedBy: string;
  readonly revoke: Revoke;
  readonly texts: RevokeTexts;
}

export const REVOKE_MIN_BUSY_MS = 400;

export function RevokeButton({ id, describedBy, revoke, texts }: RevokeButtonProps) {
  const t = useT();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [revoked, setRevoked] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const request = useRef<Subscription | undefined>(undefined);

  useEffect(() => () => request.current?.unsubscribe(), []);

  const revokeThis = () => {
    request.current?.unsubscribe();
    setError(null);
    request.current = defer(() => revoke(id))
      .pipe(
        tap(() => {
          setRevoked(true);
          router.refresh();
        }),
        catchToState(setError),
        withSmoothLoading(setBusy, REVOKE_MIN_BUSY_MS),
      )
      .subscribe();
  };

  if (revoked) {
    return (
      <p role="status" className="text-xs font-medium text-ok">
        {t(`${texts}.revoked`)}
      </p>
    );
  }
  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={revokeThis}
        disabled={busy}
        aria-busy={busy}
        aria-describedby={describedBy}
        className={`flex min-h-9 items-center rounded-input px-3 text-sm ${BUTTON_SECONDARY} ${CONTROL_BUSY}`}
      >
        {busy ? t(`${texts}.revoking`) : t(`${texts}.revoke`)}
      </button>
      {error === null ? null : (
        <p role="alert" className="text-xs text-bad">
          {t(`${texts}.revokeFailed`)}
        </p>
      )}
    </div>
  );
}
