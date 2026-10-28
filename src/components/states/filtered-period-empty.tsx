import Link from 'next/link';
import type { I18n } from '@/i18n/i18n';
import { BUTTON_SECONDARY } from '@/components/ui/control-classes';
import { EmptyState } from './empty-state';

export interface FilteredPeriodEmptyProps {
  readonly periodLabel: string;
  readonly removeFiltersHref: string;
  readonly i18n: I18n;
}

export function FilteredPeriodEmpty({
  periodLabel,
  removeFiltersHref,
  i18n,
}: FilteredPeriodEmptyProps) {
  return (
    <EmptyState title={i18n.t('dashboardFilters.empty.title')}>
      <p>{i18n.t('dashboardFilters.empty.body', { period: periodLabel })}</p>
      <p>
        <Link
          href={removeFiltersHref}
          className={`inline-flex min-h-11 items-center rounded-input px-4 text-sm ${BUTTON_SECONDARY}`}
        >
          {i18n.t('dashboardFilters.removeAll')}
        </Link>
      </p>
    </EmptyState>
  );
}
