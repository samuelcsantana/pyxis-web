'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { catchToState, withSmoothLoading } from 'rx-state-bridge';
import { defer, type Subscription, tap } from 'rxjs';
import type { FeatureRow } from '@/domain/features';
import type { PropertyKeyView } from '@/domain/property-breakdown';
import { BUTTON_ICON } from '@/components/ui/control-classes';
import { FEATURE_COLUMNS, FeatureRowCells } from './feature-row-cells';
import { PropertyBreakdown, type PropertyBreakdownState } from './property-breakdown';

const SMOOTH_LOADING_MS = 400;

export type LoadProperties = (name: string) => Promise<readonly PropertyKeyView[]>;

export interface ExpandableFeatureRowProps {
  readonly row: FeatureRow;
  readonly loadProperties: LoadProperties;
}

function breakdownState(
  error: unknown,
  keys: readonly PropertyKeyView[] | null,
): PropertyBreakdownState {
  if (error !== null) {
    return { status: 'error' };
  }
  return keys === null ? { status: 'loading' } : { status: 'ready', keys };
}

export function ExpandableFeatureRow({ row, loadProperties }: ExpandableFeatureRowProps) {
  const [open, setOpen] = useState(false);
  const [keys, setKeys] = useState<readonly PropertyKeyView[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const request = useRef<Subscription | undefined>(undefined);
  const panelId = useId();

  useEffect(
    () => () => {
      request.current?.unsubscribe();
    },
    [],
  );

  const load = () => {
    request.current?.unsubscribe();
    setError(null);
    request.current = defer(() => loadProperties(row.name))
      .pipe(tap(setKeys), catchToState(setError), withSmoothLoading(setBusy, SMOOTH_LOADING_MS))
      .subscribe();
  };

  const toggle = () => {
    setOpen(!open);
    if (!open && (error !== null || (keys === null && !busy))) {
      load();
    }
  };

  return (
    <>
      <tr>
        <FeatureRowCells
          kind="events"
          row={row}
          disclosure={
            <button
              type="button"
              aria-expanded={open}
              aria-controls={panelId}
              aria-label={`Properties of ${row.label}`}
              onClick={toggle}
              className={`size-7 shrink-0 rounded-input ${BUTTON_ICON}`}
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 16 16"
                className={`size-3.5 transition-transform motion-reduce:transition-none ${open ? 'rotate-90' : ''}`}
              >
                <path
                  d="M6 3.5 10.5 8 6 12.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          }
        />
      </tr>
      <tr id={panelId} hidden={!open}>
        <td colSpan={FEATURE_COLUMNS} className="border-b border-line bg-soft/40 px-2.5 py-3">
          <PropertyBreakdown
            eventLabel={row.label}
            state={breakdownState(error, keys)}
            onRetry={load}
          />
        </td>
      </tr>
    </>
  );
}
