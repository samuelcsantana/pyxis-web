import { FOCUS_RING } from '@/components/ui/control-classes';
export interface ErrorPanelProps {
  readonly detail?: string;
  readonly onRetry?: () => void;
  readonly headingLevel?: 'h1' | 'h2';
}

const WARNING_ICON = 'M12 3l9 16H3l9-16z M12 10v4 M12 17h.01';
const RETRY_ICON = 'M20 11a8 8 0 1 0-2.3 5.7 M20 4v7h-7';

export function ErrorPanel({ detail, onRetry, headingLevel: Heading = 'h2' }: ErrorPanelProps) {
  return (
    <section
      role="alert"
      className="flex flex-col items-start gap-3.5 rounded-card border border-line bg-card p-6 text-ink"
    >
      <span className="flex size-11 items-center justify-center rounded-card bg-bad-soft text-bad">
        <svg width={22} height={22} viewBox="0 0 24 24" aria-hidden="true">
          <path
            d={WARNING_ICON}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.9}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <Heading className="text-lg font-semibold">Could not load this data</Heading>
      <p className="text-sm leading-5 text-muted">
        The dashboard could not read this data. Try again in a moment.
      </p>
      {detail === undefined ? null : (
        <p className="rounded-control bg-soft px-2.5 py-2 font-mono text-xs text-muted">{detail}</p>
      )}
      {onRetry === undefined ? null : (
        <button
          type="button"
          onClick={onRetry}
          className={`flex min-h-11 items-center gap-2 rounded-input bg-accent px-4 text-sm font-semibold text-accent-ink ${FOCUS_RING}`}
        >
          <svg width={16} height={16} viewBox="0 0 24 24" aria-hidden="true">
            <path
              d={RETRY_ICON}
              fill="none"
              stroke="currentColor"
              strokeWidth={1.9}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Try again
        </button>
      )}
    </section>
  );
}
