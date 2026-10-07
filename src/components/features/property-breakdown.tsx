import type { PropertyKeyView, PropertyValueRow } from '@/domain/property-breakdown';
import { BAR_FILL, BAR_TRACK } from '@/components/ui/panel-classes';

export type PropertyBreakdownState =
  | { readonly status: 'loading' }
  | { readonly status: 'error' }
  | { readonly status: 'ready'; readonly keys: readonly PropertyKeyView[] };

export interface PropertyBreakdownProps {
  readonly eventLabel: string;
  readonly state: PropertyBreakdownState;
  readonly onRetry: () => void;
}

const CELL = 'border-b border-line px-2 py-1.5';
const HEADER = `${CELL} font-medium text-muted`;

function ValueRow({ row, other }: { readonly row: PropertyValueRow; readonly other: boolean }) {
  return (
    <tr className={other ? 'text-muted' : undefined}>
      <th
        scope="row"
        className={`${CELL} pl-0 text-left font-normal wrap-anywhere ${other ? 'italic' : 'font-mono text-xs'}`}
      >
        {row.value}
      </th>
      <td className={CELL}>
        <span className="flex items-center gap-2">
          <span aria-hidden="true" className={`${BAR_TRACK} hidden w-24 sm:block`}>
            <span className={`${BAR_FILL} bg-violet`} style={{ width: row.barWidth }} />
          </span>
          <span className="w-11 text-xs">{row.share}</span>
        </span>
      </td>
      <td className={`${CELL} text-right`}>{row.count}</td>
      <td className={`${CELL} hidden pr-0 text-right text-muted sm:table-cell`}>{row.visits}</td>
    </tr>
  );
}

function PropertyKeyTable({ view }: { readonly view: PropertyKeyView }) {
  return (
    <table className="w-full min-w-0 border-collapse text-[13px] tabular-nums">
      <caption className="pb-1.5 text-left">
        <span className="font-mono text-xs font-semibold">{view.key}</span>{' '}
        <span className="text-xs text-muted">· carried by {view.carriedBy}</span>
      </caption>
      <thead>
        <tr>
          <th scope="col" className={`${HEADER} pl-0 text-left`}>
            Value
          </th>
          <th scope="col" className={`${HEADER} text-left`}>
            Share
          </th>
          <th scope="col" className={`${HEADER} text-right`}>
            Count
          </th>
          <th scope="col" className={`${HEADER} hidden pr-0 text-right sm:table-cell`}>
            Visits
          </th>
        </tr>
      </thead>
      <tbody>
        {view.rows.map((row) => (
          <ValueRow key={row.value} row={row} other={false} />
        ))}
        {view.other === null ? null : <ValueRow row={view.other} other />}
      </tbody>
    </table>
  );
}

export function PropertyBreakdown({ eventLabel, state, onRetry }: PropertyBreakdownProps) {
  if (state.status === 'loading') {
    return (
      <p role="status" className="py-2 text-[13px] text-muted">
        Loading the properties of {eventLabel}…
      </p>
    );
  }
  if (state.status === 'error') {
    return (
      <div role="alert" className="flex flex-wrap items-center gap-3 py-2 text-[13px] text-bad">
        <span>Could not load the properties of {eventLabel}.</span>
        <button
          type="button"
          onClick={onRetry}
          className="min-h-9 rounded-input border border-line bg-card px-3 text-ink hover:bg-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        >
          Try again
        </button>
      </div>
    );
  }
  return state.keys.length === 0 ? (
    <p className="py-2 text-[13px] text-muted">
      {eventLabel} carried no properties in this period.
    </p>
  ) : (
    <div className="grid items-start gap-5 py-1 lg:grid-cols-2">
      {state.keys.map((view) => (
        <PropertyKeyTable key={view.key} view={view} />
      ))}
    </div>
  );
}
