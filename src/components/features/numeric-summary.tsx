'use client';

import { useEffect, useId, useState } from 'react';
import type { PropertySummaryView } from '@/domain/property-summary';
import { BUTTON_SECONDARY, FIELD } from '@/components/ui/control-classes';
import { SelectField } from '@/components/ui/select-field';
import { useT } from '@/i18n/messages-provider';

export type LoadSummary = (key: string, by: string | null) => Promise<PropertySummaryView>;

export type NumericSummaryState =
  | { readonly status: 'loading' }
  | { readonly status: 'error' }
  | { readonly status: 'ready'; readonly view: PropertySummaryView };

export interface NumericSummaryProps {
  readonly propertyKey: string;
  readonly otherKeys: readonly string[];
  readonly loadSummary: LoadSummary;
}

const CELL = 'border-b border-line px-2 py-1.5';
const HEADER = `${CELL} font-medium text-muted`;
const NO_SPLIT = '';

interface SummaryResult {
  readonly request: string;
  readonly state: NumericSummaryState;
}

const LOADING: NumericSummaryState = { status: 'loading' };

function useSummary(propertyKey: string, by: string | null, loadSummary: LoadSummary) {
  const [attempt, setAttempt] = useState(0);
  const request = `${propertyKey} ${by ?? ''} ${String(attempt)}`;
  const [result, setResult] = useState<SummaryResult | null>(null);
  useEffect(() => {
    let current = true;
    loadSummary(propertyKey, by).then(
      (view) => {
        if (current) {
          setResult({ request, state: { status: 'ready', view } });
        }
      },
      () => {
        if (current) {
          setResult({ request, state: { status: 'error' } });
        }
      },
    );
    return () => {
      current = false;
    };
  }, [propertyKey, by, loadSummary, request]);
  return {
    state: result?.request === request ? result.state : LOADING,
    retry: () => {
      setAttempt((count) => count + 1);
    },
  };
}

export function NumericSummaryTable({
  view,
  by,
}: {
  readonly view: PropertySummaryView;
  readonly by: string;
}) {
  const t = useT();
  return (
    <table className="w-full min-w-0 border-collapse text-caption tabular-nums">
      <caption className="sr-only">
        {t('propertySummary.splitBy')} {by}
      </caption>
      <thead>
        <tr>
          <th scope="col" className={`${HEADER} pl-0 text-left`}>
            {t('propertySummary.columns.value')}
          </th>
          <th scope="col" className={`${HEADER} text-right`}>
            {t('propertySummary.columns.median')}
          </th>
          <th scope="col" className={`${HEADER} hidden text-right sm:table-cell`}>
            {t('propertySummary.columns.middleHalf')}
          </th>
          <th scope="col" className={`${HEADER} pr-0 text-right`}>
            {t('propertySummary.columns.events')}
          </th>
        </tr>
      </thead>
      <tbody>
        {view.groups.map((group) => (
          <tr key={group.value}>
            <th
              scope="row"
              className={`${CELL} pl-0 text-left font-mono text-xs font-normal wrap-anywhere`}
            >
              {group.value}
            </th>
            <td className={`${CELL} text-right font-semibold`}>{group.median}</td>
            <td className={`${CELL} hidden text-right text-muted sm:table-cell`}>
              {group.middleHalf}
            </td>
            <td className={`${CELL} pr-0 text-right text-muted`}>{group.events}</td>
          </tr>
        ))}
        {view.other === null ? null : (
          <tr className="text-muted">
            <th scope="row" className={`${CELL} pl-0 text-left font-normal italic`}>
              {t('propertySummary.otherValues')}
            </th>
            <td className={CELL} />
            <td className={`${CELL} hidden sm:table-cell`} />
            <td className={`${CELL} pr-0 text-right`}>{view.other}</td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

export function NumericSummary({ propertyKey, otherKeys, loadSummary }: NumericSummaryProps) {
  const t = useT();
  const selectId = useId();
  const [by, setBy] = useState<string | null>(null);
  const { state, retry } = useSummary(propertyKey, by, loadSummary);
  return (
    <div className="flex flex-col gap-2 rounded-input bg-soft px-3 py-2 text-caption">
      {state.status === 'loading' ? (
        <p role="status" className="text-muted">
          {t('propertySummary.loading', { key: propertyKey })}
        </p>
      ) : null}
      {state.status === 'error' ? (
        <div role="alert" className="flex flex-wrap items-center gap-3 text-bad">
          <span>{t('propertySummary.failed', { key: propertyKey })}</span>
          <button
            type="button"
            onClick={retry}
            className={`min-h-9 rounded-input px-3 ${BUTTON_SECONDARY}`}
          >
            {t('propertyBreakdown.retry')}
          </button>
        </div>
      ) : null}
      {state.status === 'ready' && state.view.overall !== null ? (
        <dl className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <div className="flex items-baseline gap-1.5">
            <dt className="text-muted">{t('propertySummary.median')}</dt>
            <dd className="text-base font-semibold tabular-nums">{state.view.overall.median}</dd>
          </div>
          <div className="flex items-baseline gap-1.5">
            <dt className="text-muted">{t('propertySummary.middleHalf')}</dt>
            <dd className="tabular-nums">{state.view.overall.middleHalf}</dd>
          </div>
          <div className="flex items-baseline">
            <dt className="sr-only">{t('propertySummary.columns.events')}</dt>
            <dd className="text-muted tabular-nums">{state.view.overall.events}</dd>
          </div>
        </dl>
      ) : null}
      {otherKeys.length === 0 ? null : (
        <label htmlFor={selectId} className="flex flex-wrap items-center gap-2 text-muted">
          {t('propertySummary.splitBy')}
          <SelectField
            id={selectId}
            value={by ?? NO_SPLIT}
            onChange={(event) => {
              setBy(event.target.value === NO_SPLIT ? null : event.target.value);
            }}
            className={`min-h-9 rounded-input px-2 text-ink ${FIELD}`}
          >
            <option value={NO_SPLIT}>{t('propertySummary.noSplit')}</option>
            {otherKeys.map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </SelectField>
        </label>
      )}
      {state.status === 'ready' && by !== null && state.view.groups.length > 0 ? (
        <NumericSummaryTable view={state.view} by={by} />
      ) : null}
    </div>
  );
}
