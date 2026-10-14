'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { catchToState, withSmoothLoading } from 'rx-state-bridge';
import { defer, type Subscription, tap } from 'rxjs';
import { BUTTON_SECONDARY, CONTROL_BUSY } from '@/components/ui/control-classes';
import { useT } from '@/i18n/messages-provider';

export type RevokeAccessToken = (tokenId: string) => Promise<void>;

export interface RevokeAccessTokenButtonProps {
  readonly tokenId: string;
  readonly describedBy: string;
  readonly revoke: RevokeAccessToken;
}

export const REVOKE_ACCESS_TOKEN_MIN_BUSY_MS = 400;

export function RevokeAccessTokenButton({
  tokenId,
  describedBy,
  revoke,
}: RevokeAccessTokenButtonProps) {
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
    request.current = defer(() => revoke(tokenId))
      .pipe(
        tap(() => {
          setRevoked(true);
          router.refresh();
        }),
        catchToState(setError),
        withSmoothLoading(setBusy, REVOKE_ACCESS_TOKEN_MIN_BUSY_MS),
      )
      .subscribe();
  };

  if (revoked) {
    return (
      <p role="status" className="text-xs font-medium text-ok">
        {t('accessTokens.revoked')}
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
        {busy ? t('accessTokens.revoking') : t('accessTokens.revoke')}
      </button>
      {error === null ? null : (
        <p role="alert" className="text-xs text-bad">
          {t('accessTokens.revokeFailed')}
        </p>
      )}
    </div>
  );
}
