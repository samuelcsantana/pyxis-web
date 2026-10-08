'use client';

import { useEffect, useRef, useState } from 'react';
import { catchToState, withSmoothLoading } from 'rx-state-bridge';
import { defer, type Subscription, tap } from 'rxjs';
import type { OlderVisitsText, VisitView } from '@/domain/timeline';
import { BUTTON_SECONDARY, CONTROL_BUSY } from '@/components/ui/control-classes';
import { VisitCard } from './visit-card';

const SMOOTH_LOADING_MS = 400;

export interface OlderVisitsPage {
  readonly visits: readonly VisitView[];
  readonly nextBefore: string | null;
}

export interface OlderVisitsProps {
  readonly initialBefore: string;
  readonly loadOlder: (before: string) => Promise<OlderVisitsPage>;
  readonly text: OlderVisitsText;
}

export function OlderVisits({ initialBefore, loadOlder, text }: OlderVisitsProps) {
  const [pages, setPages] = useState<readonly (readonly VisitView[])[]>([]);
  const [before, setBefore] = useState<string | null>(initialBefore);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const request = useRef<Subscription | undefined>(undefined);
  const loaded = useRef(0);
  const pageToFocus = useRef<number | null>(null);
  const container = useRef<HTMLDivElement>(null as unknown as HTMLDivElement);

  useEffect(
    () => () => {
      request.current?.unsubscribe();
    },
    [],
  );

  useEffect(() => {
    const page = pageToFocus.current;
    pageToFocus.current = null;
    if (page === null) {
      return;
    }
    [...container.current.querySelectorAll<HTMLElement>(`[data-page="${String(page)}"] h3`)]
      .slice(0, 1)
      .forEach((heading) => {
        heading.focus();
      });
  });

  const load = (cursor: string) => {
    request.current?.unsubscribe();
    setError(null);
    request.current = defer(() => loadOlder(cursor))
      .pipe(
        tap((page) => {
          pageToFocus.current = loaded.current;
          loaded.current += 1;
          setPages((shown) => [...shown, page.visits]);
          setBefore(page.nextBefore);
        }),
        catchToState(setError),
        withSmoothLoading(setBusy, SMOOTH_LOADING_MS),
      )
      .subscribe();
  };

  return (
    <div ref={container} className="flex flex-col gap-3.5 sm:gap-5">
      {pages.map((visits, page) => (
        <div key={page} data-page={page} className="flex flex-col gap-3.5 sm:gap-5">
          {visits.map((visit) => (
            <VisitCard key={visit.key} visit={visit} emptyText={text.nothingOfThisKind} focusable />
          ))}
        </div>
      ))}
      {before === null ? (
        <p className="text-caption text-muted">{text.everyVisit}</p>
      ) : (
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            disabled={busy}
            aria-busy={busy}
            onClick={() => {
              load(before);
            }}
            className={`min-h-11 rounded-input px-4 text-sm font-medium ${BUTTON_SECONDARY} ${CONTROL_BUSY}`}
          >
            {busy ? text.loading : text.load}
          </button>
          {error === null ? null : (
            <p role="alert" className="text-caption text-bad">
              {text.failed}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
