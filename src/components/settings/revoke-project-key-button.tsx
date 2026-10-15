'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { catchToState, withSmoothLoading } from 'rx-state-bridge';
import { defer, type Subscription, tap } from 'rxjs';
import { BUTTON_SECONDARY, CONTROL_BUSY } from '@/components/ui/control-classes';
import type { RevokeProjectKeyOutcome } from '@/domain/project-management';
import { useT } from '@/i18n/messages-provider';

export type RevokeProjectKey = (keyId: string) => Promise<RevokeProjectKeyOutcome>;

export interface RevokeProjectKeyButtonProps {
  readonly keyId: string;
  readonly describedBy: string;
  readonly revoke: RevokeProjectKey;
}

type Refusal = 'lastPublicKey' | 'subscriptionRequired' | 'failed';

export const REVOKE_PROJECT_KEY_MIN_BUSY_MS = 400;

const REFUSALS = {
  lastPublicKey: 'projectKeys.lastPublicKey',
  subscriptionRequired: 'projectKeys.subscriptionRequired',
  failed: 'projectKeys.failed',
} as const satisfies Record<Refusal, string>;

export function RevokeProjectKeyButton({
  keyId,
  describedBy,
  revoke,
}: RevokeProjectKeyButtonProps) {
  const t = useT();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [revoked, setRevoked] = useState(false);
  const [refusal, setRefusal] = useState<Refusal | null>(null);
  const request = useRef<Subscription | undefined>(undefined);

  useEffect(() => () => request.current?.unsubscribe(), []);

  const revokeThis = () => {
    request.current?.unsubscribe();
    setRefusal(null);
    request.current = defer(() => revoke(keyId))
      .pipe(
        tap((outcome) => {
          if (outcome.kind !== 'revoked') {
            setRefusal(outcome.kind);
            return;
          }
          setRevoked(true);
          router.refresh();
        }),
        catchToState(() => {
          setRefusal('failed');
        }),
        withSmoothLoading(setBusy, REVOKE_PROJECT_KEY_MIN_BUSY_MS),
      )
      .subscribe();
  };

  if (revoked) {
    return (
      <p role="status" className="text-xs font-medium text-ok">
        {t('projectKeys.revoked')}
      </p>
    );
  }
  return (
    <div className="flex max-w-72 flex-col items-end gap-1">
      <button
        type="button"
        onClick={revokeThis}
        disabled={busy}
        aria-busy={busy}
        aria-describedby={describedBy}
        className={`flex min-h-9 items-center rounded-input px-3 text-sm ${BUTTON_SECONDARY} ${CONTROL_BUSY}`}
      >
        {busy ? t('projectKeys.revoking') : t('projectKeys.revoke')}
      </button>
      {refusal === null ? null : (
        <p role="alert" className="text-right text-xs text-bad">
          {t(REFUSALS[refusal])}
        </p>
      )}
    </div>
  );
}
