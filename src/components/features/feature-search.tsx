import Link from 'next/link';
import type { KeptParameters } from '@/components/shell/period-selector';
import { BUTTON_SECONDARY, FOCUS_RING, FOCUS_WITHIN_RING } from '@/components/ui/control-classes';

export interface FeatureSearchProps {
  readonly action: string;
  readonly keep: KeptParameters;
  readonly query: string;
  readonly label: string;
  readonly clearHref: string;
}

const SEARCH_ICON = 'M11 4a7 7 0 1 1 0 14a7 7 0 1 1 0-14 M20 20l-4-4';

export function FeatureSearch({ action, keep, query, label, clearHref }: FeatureSearchProps) {
  return (
    <form
      role="search"
      action={action}
      method="get"
      className="flex w-full flex-wrap items-center gap-2 sm:w-auto"
    >
      {Object.entries(keep).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
      <label
        className={`flex min-h-11 min-w-0 grow items-center gap-2 rounded-input border border-field bg-card px-3 ${FOCUS_WITHIN_RING} sm:w-80 sm:grow-0`}
      >
        <svg width={16} height={16} viewBox="0 0 24 24" aria-hidden="true" className="text-muted">
          <path
            d={SEARCH_ICON}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
          />
        </svg>
        <span className="sr-only">{label}</span>
        <input
          type="search"
          name="q"
          defaultValue={query}
          maxLength={100}
          placeholder={label}
          className="min-w-0 grow bg-transparent text-sm text-ink outline-none placeholder:text-muted"
        />
      </label>
      <button
        type="submit"
        className={`min-h-11 rounded-input px-3.5 text-sm font-medium ${BUTTON_SECONDARY}`}
      >
        Search
      </button>
      {query === '' ? null : (
        <Link
          href={clearHref}
          className={`text-sm text-sky-ink underline underline-offset-2 hover:text-ink ${FOCUS_RING}`}
        >
          Clear
        </Link>
      )}
    </form>
  );
}
