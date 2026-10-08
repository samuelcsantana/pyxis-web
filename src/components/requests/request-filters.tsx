import Link from 'next/link';
import { FAILED_READS, type RequestKind } from '@/domain/requests';
import type { I18n } from '@/i18n/i18n';
import { rich } from '@/i18n/rich';
import {
  PENDING_HOST,
  SEGMENTED_GROUP,
  SEGMENTED_IDLE,
  SEGMENTED_OPTION,
  SEGMENTED_SELECTED,
  TEXT_LINK,
} from '@/components/ui/control-classes';
import { PendingMark } from '@/components/ui/pending-mark';

export interface RequestFiltersProps {
  readonly kind: RequestKind;
  readonly allHref: string;
  readonly failingHref: string;
  readonly failingOnly: boolean;
  readonly screen: string | null;
  readonly clearScreenHref: string;
  readonly i18n: I18n;
}

const OPTION_CLASS = `min-h-9 px-3.5 ${PENDING_HOST} ${SEGMENTED_OPTION}`;

export function RequestFilters({
  kind,
  allHref,
  failingHref,
  failingOnly,
  screen,
  clearScreenHref,
  i18n,
}: RequestFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {kind === FAILED_READS ? null : (
        <nav aria-label={i18n.t('requests.filters.label')} className={SEGMENTED_GROUP}>
          <Link
            href={allHref}
            aria-current={failingOnly ? undefined : 'page'}
            className={`${OPTION_CLASS} ${failingOnly ? SEGMENTED_IDLE : SEGMENTED_SELECTED}`}
          >
            {i18n.t('requests.filters.all')}
            <PendingMark />
          </Link>
          <Link
            href={failingHref}
            aria-current={failingOnly ? 'page' : undefined}
            className={`${OPTION_CLASS} ${failingOnly ? SEGMENTED_SELECTED : SEGMENTED_IDLE}`}
          >
            {i18n.t('requests.filters.failingOnly')}
            <PendingMark />
          </Link>
        </nav>
      )}
      {screen === null ? null : (
        <p className="flex items-center gap-2 rounded-pill border border-line bg-card py-1 pr-1 pl-3 text-caption">
          <span>
            {rich(i18n.t('requests.filters.fromScreen'), {
              screen: () => <span className="font-mono text-xs">{screen}</span>,
            })}
          </span>
          <Link
            href={clearScreenHref}
            aria-label={i18n.t('requests.filters.clearScreen')}
            className={`rounded-pill px-2.5 py-1 ${TEXT_LINK}`}
          >
            {i18n.t('requests.filters.clear')}
          </Link>
        </p>
      )}
      <span className="text-caption text-muted">{i18n.t('requests.filters.hint')}</span>
    </div>
  );
}
