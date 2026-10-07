import Link from 'next/link';
import { FOCUS_RING } from '@/components/ui/control-classes';

export interface RequestFiltersProps {
  readonly allHref: string;
  readonly failingHref: string;
  readonly failingOnly: boolean;
  readonly screen: string | null;
  readonly clearScreenHref: string;
}

const OPTION_CLASS = `flex min-h-9 items-center rounded-control px-3.5 text-[13px] font-medium ${FOCUS_RING}`;
const SELECTED_CLASS = 'bg-ink text-card';
const IDLE_CLASS = 'text-muted hover:text-ink';

export function RequestFilters({
  allHref,
  failingHref,
  failingOnly,
  screen,
  clearScreenHref,
}: RequestFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <nav
        aria-label="Show"
        className="flex gap-0.5 rounded-input border border-line bg-soft p-[3px]"
      >
        <Link
          href={allHref}
          aria-current={failingOnly ? undefined : 'page'}
          className={`${OPTION_CLASS} ${failingOnly ? IDLE_CLASS : SELECTED_CLASS}`}
        >
          All routes
        </Link>
        <Link
          href={failingHref}
          aria-current={failingOnly ? 'page' : undefined}
          className={`${OPTION_CLASS} ${failingOnly ? SELECTED_CLASS : IDLE_CLASS}`}
        >
          Failing only
        </Link>
      </nav>
      {screen === null ? null : (
        <p className="flex items-center gap-2 rounded-pill border border-line bg-card py-1 pr-1 pl-3 text-[13px]">
          <span>
            From screen <span className="font-mono text-xs">{screen}</span>
          </span>
          <Link
            href={clearScreenHref}
            aria-label="Clear the screen filter"
            className={`rounded-pill px-2.5 py-1 text-sky-ink underline underline-offset-2 hover:text-ink ${FOCUS_RING}`}
          >
            Clear
          </Link>
        </p>
      )}
      <span className="text-[13px] text-muted">
        Select a route to see its status codes, the screens where it failed and its latest failures.
      </span>
    </div>
  );
}
