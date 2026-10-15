'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { catchToState, withSmoothLoading } from 'rx-state-bridge';
import { defer, type Subscription, tap } from 'rxjs';
import { BUTTON_SECONDARY, CONTROL_BUSY } from '@/components/ui/control-classes';
import {
  type CreateProjectKeyOutcome,
  MAX_LIVE_KEYS_PER_KIND,
  type ProjectKeyKind,
} from '@/domain/project-management';
import { useT } from '@/i18n/messages-provider';
import { NewSecretKeyReveal } from './new-secret-key-reveal';

export type CreateProjectKey = (kind: ProjectKeyKind) => Promise<CreateProjectKeyOutcome>;

export interface CreateProjectKeyButtonProps {
  readonly kind: ProjectKeyKind;
  readonly create: CreateProjectKey;
}

type Result = 'publicCreated' | 'tooMany' | 'subscriptionRequired' | 'failed';

export const CREATE_PROJECT_KEY_MIN_BUSY_MS = 400;

const LABELS = { public: 'projectKeys.newPublic', secret: 'projectKeys.newSecret' } as const;

export function CreateProjectKeyButton({ kind, create }: CreateProjectKeyButtonProps) {
  const t = useT();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const request = useRef<Subscription | undefined>(undefined);

  useEffect(() => () => request.current?.unsubscribe(), []);

  if (secret !== null) {
    return (
      <NewSecretKeyReveal
        secretKey={secret}
        onDone={() => {
          setSecret(null);
        }}
      />
    );
  }

  const createOne = () => {
    request.current?.unsubscribe();
    setResult(null);
    request.current = defer(() => create(kind))
      .pipe(
        tap((outcome) => {
          if (outcome.kind !== 'created') {
            setResult(outcome.kind);
            return;
          }
          if (outcome.key.kind === 'secret') {
            setSecret(outcome.key.key);
          } else {
            setResult('publicCreated');
          }
          router.refresh();
        }),
        catchToState(() => {
          setResult('failed');
        }),
        withSmoothLoading(setBusy, CREATE_PROJECT_KEY_MIN_BUSY_MS),
      )
      .subscribe();
  };

  const message = {
    publicCreated: (
      <p role="status" className="text-xs font-medium text-ok">
        {t('projectKeys.publicCreated')}
      </p>
    ),
    tooMany: (
      <p role="alert" className="text-xs text-bad">
        {t('projectKeys.tooMany', { max: String(MAX_LIVE_KEYS_PER_KIND) })}
      </p>
    ),
    subscriptionRequired: (
      <p role="alert" className="text-xs text-bad">
        {t('projectKeys.subscriptionRequired')}
      </p>
    ),
    failed: (
      <p role="alert" className="text-xs text-bad">
        {t('projectKeys.failed')}
      </p>
    ),
  };

  return (
    <div className="flex flex-col items-start gap-1.5">
      <button
        type="button"
        onClick={createOne}
        disabled={busy}
        aria-busy={busy}
        className={`flex min-h-9 items-center rounded-input px-3 text-sm ${BUTTON_SECONDARY} ${CONTROL_BUSY}`}
      >
        {busy ? t('projectKeys.creating') : t(LABELS[kind])}
      </button>
      {result === null ? null : message[result]}
    </div>
  );
}
