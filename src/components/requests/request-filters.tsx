import Link from 'next/link';
import {
  SEGMENTED_GROUP,
  SEGMENTED_IDLE,
  SEGMENTED_OPTION,
  SEGMENTED_SELECTED,
  TEXT_LINK,
} from '@/components/ui/control-classes';

export interface RequestFiltersProps {
  readonly allHref: string;
  readonly failingHref: string;
  readonly failingOnly: boolean;
  readonly screen: string | null;
  readonly clearScreenHref: string;
}

const OPTION_CLASS = `min-h-9 px-3.5 ${SEGMENTED_OPTION}`;

export function RequestFilters({
  allHref,
  failingHref,
  failingOnly,
  screen,
  clearScreenHref,
}: RequestFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <nav aria-label="Show" className={SEGMENTED_GROUP}>
        <Link
          href={allHref}
          aria-current={failingOnly ? undefined : 'page'}
          className={`${OPTION_CLASS} ${failingOnly ? SEGMENTED_IDLE : SEGMENTED_SELECTED}`}
        >
          All routes
        </Link>
        <Link
          href={failingHref}
          aria-current={failingOnly ? 'page' : undefined}
          className={`${OPTION_CLASS} ${failingOnly ? SEGMENTED_SELECTED : SEGMENTED_IDLE}`}
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
            className={`rounded-pill px-2.5 py-1 ${TEXT_LINK}`}
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
