import type { RouteDaysText, RouteDaysView } from '@/domain/route-days';
import { BUTTON_SECONDARY } from '@/components/ui/control-classes';
import { BODY_CELL, HEADER_CELL, TABLE_SCROLL } from '@/components/ui/panel-classes';
import { SECTION_TITLE } from './route-details';

export const ROUTE_DAYS_HEADING_ID = 'route-days-heading';
const NOTE = 'text-caption text-muted';

export type RouteDaysState =
  | { readonly status: 'loading' }
  | { readonly status: 'error' }
  | { readonly status: 'unavailable' }
  | { readonly status: 'ready'; readonly view: RouteDaysView };

export interface RouteDaysProps {
  readonly state: RouteDaysState;
  readonly text: RouteDaysText;
  readonly onRetry: () => void;
}

function DaysTable({ view, text }: { readonly view: RouteDaysView; readonly text: RouteDaysText }) {
  const { columns } = text;
  return (
    <>
      <div className={TABLE_SCROLL}>
        <table
          aria-labelledby={ROUTE_DAYS_HEADING_ID}
          className="w-full border-collapse text-caption tabular-nums"
        >
          <thead>
            <tr>
              <th scope="col" className={`${HEADER_CELL} pl-0 text-left`}>
                {columns.day}
              </th>
              {columns.total === null ? null : (
                <th scope="col" className={`${HEADER_CELL} text-right`}>
                  {columns.total}
                </th>
              )}
              <th scope="col" className={`${HEADER_CELL} text-right`}>
                {columns.failed}
              </th>
              <th scope="col" className={`${HEADER_CELL} text-right`}>
                {columns.median}
              </th>
              <th scope="col" className={`${HEADER_CELL} pr-0 text-right`}>
                {columns.p95}
              </th>
            </tr>
          </thead>
          <tbody>
            {view.rows.map((row) => (
              <tr key={row.date}>
                <th scope="row" className={`${BODY_CELL} pl-0 text-left font-medium`}>
                  {row.day}
                </th>
                {columns.total === null ? null : (
                  <td className={`${BODY_CELL} text-right`}>{row.total}</td>
                )}
                <td
                  className={`${BODY_CELL} text-right ${row.hasFailures ? 'font-semibold text-bad' : 'text-muted'}`}
                >
                  {row.failed}
                </td>
                <td className={`${BODY_CELL} text-right`}>{row.median}</td>
                <td className={`${BODY_CELL} pr-0 text-right`}>{row.p95}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {view.note === null ? null : <p className={NOTE}>{view.note}</p>}
    </>
  );
}

function RouteDaysBody({ state, text, onRetry }: RouteDaysProps) {
  switch (state.status) {
    case 'loading':
      return (
        <p role="status" className={NOTE}>
          {text.loading}
        </p>
      );
    case 'error':
      return (
        <div role="alert" className="flex flex-wrap items-center gap-3 text-caption text-bad">
          <span>{text.failed}</span>
          <button
            type="button"
            onClick={onRetry}
            className={`min-h-9 rounded-input px-3 ${BUTTON_SECONDARY}`}
          >
            {text.retry}
          </button>
        </div>
      );
    case 'unavailable':
      return <p className={NOTE}>{text.unavailable}</p>;
    case 'ready':
      return state.view.rows.length === 0 ? (
        <p className={NOTE}>{text.none}</p>
      ) : (
        <DaysTable view={state.view} text={text} />
      );
  }
}

export function RouteDays(props: RouteDaysProps) {
  return (
    <section aria-labelledby={ROUTE_DAYS_HEADING_ID} className="flex flex-col gap-2.5">
      <h3 id={ROUTE_DAYS_HEADING_ID} className={SECTION_TITLE}>
        {props.text.heading}
      </h3>
      <RouteDaysBody {...props} />
    </section>
  );
}
