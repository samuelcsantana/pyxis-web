'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { catchToState, withSmoothLoading } from 'rx-state-bridge';
import { defer, type Subscription, tap } from 'rxjs';
import { BUTTON_SECONDARY, CONTROL_BUSY, TEXT_LINK } from '@/components/ui/control-classes';
import { MAX_EXPORTS_PER_DAY, type RequestExportOutcome, exportHref } from '@/domain/exports';
import { useT } from '@/i18n/messages-provider';

export type RequestExport = () => Promise<RequestExportOutcome>;

export interface RequestExportButtonProps {
  readonly projectId: string;
  readonly request: RequestExport;
}

type Result =
  | { readonly kind: 'requested' | 'alreadyWaiting'; readonly exportId: string }
  | { readonly kind: 'limitReached' | 'unavailable' | 'failed' };

export const REQUEST_EXPORT_MIN_BUSY_MS = 400;

const ERROR = 'text-caption font-medium text-bad';

function resultOf(outcome: RequestExportOutcome): Result {
  if (outcome.kind !== 'requested') {
    return { kind: outcome.kind };
  }
  return {
    kind: outcome.alreadyWaiting ? 'alreadyWaiting' : 'requested',
    exportId: outcome.export.id,
  };
}

export function RequestExportButton({ projectId, request }: RequestExportButtonProps) {
  const t = useT();
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const call = useRef<Subscription | undefined>(undefined);

  useEffect(() => () => call.current?.unsubscribe(), []);

  const ask = () => {
    call.current?.unsubscribe();
    setResult(null);
    call.current = defer(() => request())
      .pipe(
        tap((outcome) => {
          setResult(resultOf(outcome));
        }),
        catchToState(() => {
          setResult({ kind: 'failed' });
        }),
        withSmoothLoading(setBusy, REQUEST_EXPORT_MIN_BUSY_MS),
      )
      .subscribe();
  };

  const message = (shown: Result) => {
    switch (shown.kind) {
      case 'requested':
      case 'alreadyWaiting':
        return (
          <p role="status" className="text-caption font-medium text-ok">
            {t(
              shown.kind === 'requested' ? 'exportEvents.requested' : 'exportEvents.alreadyWaiting',
            )}{' '}
            <Link href={exportHref(projectId, shown.exportId)} className={TEXT_LINK}>
              {t('exportEvents.open')}
            </Link>
          </p>
        );
      case 'limitReached':
        return (
          <p role="alert" className={ERROR}>
            {t('exportEvents.limitReached', { max: String(MAX_EXPORTS_PER_DAY) })}
          </p>
        );
      case 'unavailable':
      case 'failed':
        return (
          <p role="alert" className={ERROR}>
            {t(shown.kind === 'failed' ? 'exportEvents.failed' : 'exportEvents.unavailable')}
          </p>
        );
    }
  };

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        type="button"
        onClick={ask}
        disabled={busy}
        aria-busy={busy}
        className={`flex min-h-11 items-center rounded-input px-4 text-sm ${BUTTON_SECONDARY} ${CONTROL_BUSY}`}
      >
        {busy ? t('exportEvents.requesting') : t('exportEvents.request')}
      </button>
      {result === null ? null : message(result)}
    </div>
  );
}
