import Link from 'next/link';
import type { RouteRow } from '@/domain/requests';
import { FOCUS_RING } from '@/components/ui/control-classes';
import { MethodChip, TONE_CLASSES } from './status-styles';

const CLOSE_ICON = 'M6 6l12 12 M18 6L6 18';
const SECTION_TITLE = 'text-sm font-semibold';
const CHIP = 'rounded-pill px-2 py-0.5 text-xs font-semibold tabular-nums';
export const ROUTE_HEADING_ID = 'route-details-heading';

export interface RouteDetailsProps {
  readonly row: RouteRow;
  readonly screenHref: (path: string) => string;
  readonly visitHref: (sessionId: string) => string;
  readonly onClose: () => void;
}

export function RouteDetails({ row, screenHref, visitHref, onClose }: RouteDetailsProps) {
  return (
    <div className="flex min-h-full flex-col gap-5 p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-2">
          <h2
            id={ROUTE_HEADING_ID}
            className="flex items-center gap-2.5 font-mono text-base font-semibold"
          >
            <MethodChip method={row.method} /> <span className="wrap-anywhere">{row.route}</span>
          </h2>
          <p className="text-[13px] text-muted">{row.summary}</p>
        </div>
        <button
          type="button"
          autoFocus
          onClick={onClose}
          className={`flex size-10 shrink-0 items-center justify-center rounded-input border border-line bg-card text-ink hover:bg-soft ${FOCUS_RING}`}
        >
          <span className="sr-only">Close</span>
          <svg width={16} height={16} viewBox="0 0 24 24" aria-hidden="true">
            <path
              d={CLOSE_ICON}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      <section aria-labelledby="route-statuses-heading" className="flex flex-col gap-2.5">
        <h3 id="route-statuses-heading" className={SECTION_TITLE}>
          Status codes
        </h3>
        <ul className="flex flex-wrap gap-1.5">
          {row.statuses.map((status) => (
            <li key={status.label} className={`${CHIP} ${TONE_CLASSES[status.tone]}`}>
              {status.label}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="route-screens-heading" className="flex flex-col gap-2.5">
        <h3 id="route-screens-heading" className={SECTION_TITLE}>
          Where it failed
        </h3>
        {row.screens.length === 0 ? (
          <p className="text-[13px] text-muted">No failures in this period.</p>
        ) : (
          <ul className="flex flex-col">
            {row.screens.map((screen) => (
              <li
                key={screen.path}
                className="flex items-center justify-between gap-3 border-b border-line py-2 text-[13px]"
              >
                <Link
                  href={screenHref(screen.path)}
                  className={`font-mono text-xs text-sky-ink underline underline-offset-2 wrap-anywhere hover:text-ink ${FOCUS_RING}`}
                >
                  {screen.path}
                  <span className="sr-only">: show only the requests made from this screen</span>
                </Link>
                <span className="shrink-0 tabular-nums">{screen.failed}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="route-failures-heading" className="flex flex-col gap-2.5">
        <h3 id="route-failures-heading" className={SECTION_TITLE}>
          Latest failures
        </h3>
        {row.failures.length === 0 ? (
          <p className="text-[13px] text-muted">No failures in this period.</p>
        ) : (
          <ul className="flex flex-col">
            {row.failures.map((failure) => (
              <li
                key={failure.key}
                className="grid grid-cols-[5.75rem_auto_minmax(0,1fr)] items-center gap-2.5 border-b border-line py-2.5 text-xs"
              >
                <span className="text-muted tabular-nums">{failure.when}</span>
                <span className={`${CHIP} text-center ${TONE_CLASSES[failure.tone]}`}>
                  {failure.status}
                </span>
                <span className="flex min-w-0 flex-col gap-0.5">
                  <span className="font-mono wrap-anywhere">
                    {failure.errorCode ?? 'No error code'}
                  </span>
                  <Link
                    href={visitHref(failure.sessionId)}
                    className={`w-fit text-sky-ink underline underline-offset-2 hover:text-ink ${FOCUS_RING}`}
                  >
                    Open visit {failure.visit}
                  </Link>
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
