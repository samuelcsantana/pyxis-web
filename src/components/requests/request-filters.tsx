import Link from 'next/link';
import { FAILED_READS, type RequestKind } from '@/domain/requests';
import type { I18n } from '@/i18n/i18n';
import { rich } from '@/i18n/rich';
import { TEXT_LINK } from '@/components/ui/control-classes';
import { SegmentedLinks } from '@/components/ui/segmented-links';

export interface RequestFiltersProps {
  readonly kind: RequestKind;
  readonly allHref: string;
  readonly failingHref: string;
  readonly failingOnly: boolean;
  readonly screen: string | null;
  readonly clearScreenHref: string;
  readonly i18n: I18n;
}

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
        <SegmentedLinks
          label={i18n.t('requests.filters.label')}
          links={[
            { key: 'all', label: i18n.t('requests.filters.all'), href: allHref },
            { key: 'failing', label: i18n.t('requests.filters.failingOnly'), href: failingHref },
          ]}
          current={failingOnly ? 'failing' : 'all'}
        />
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
