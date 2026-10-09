import Link from 'next/link';
import type { AppliedVisitFilter } from '@/domain/applied-visit-filters';
import type { VisitFilters } from '@/domain/visits';
import type { I18n } from '@/i18n/i18n';
import { rich } from '@/i18n/rich';
import { CONTROL_TRANSITION, FOCUS_RING, TEXT_LINK } from '@/components/ui/control-classes';

export interface AppliedVisitFiltersProps {
  readonly applied: readonly AppliedVisitFilter[];
  readonly removeHref: (without: VisitFilters) => string;
  readonly clearHref: string;
  readonly i18n: I18n;
}

const LABEL_ID = 'applied-visit-filters';
const CHIP =
  'flex min-h-8 items-center gap-1 rounded-pill border border-line bg-card py-0.5 pr-0.5 pl-3 text-caption text-ink';
const REMOVE = `flex size-7 shrink-0 items-center justify-center rounded-pill text-muted hover:bg-soft hover:text-ink active:bg-line ${FOCUS_RING} ${CONTROL_TRANSITION}`;
const CROSS = 'M6 6l12 12M18 6L6 18';

function chipText(filter: AppliedVisitFilter, i18n: I18n) {
  if (filter.value === null) {
    return filter.label;
  }
  const value = filter.value;
  return rich(i18n.t('visits.filters.applied.item', { filter: filter.label }), {
    value: () => <span className={filter.code ? 'font-mono text-xs' : 'font-medium'}>{value}</span>,
  });
}

function removeLabel(filter: AppliedVisitFilter, i18n: I18n): string {
  return filter.value === null
    ? i18n.t('visits.filters.applied.removeFlag', { filter: filter.label })
    : i18n.t('visits.filters.applied.remove', { filter: filter.label, value: filter.value });
}

export function AppliedVisitFilters({
  applied,
  removeHref,
  clearHref,
  i18n,
}: AppliedVisitFiltersProps) {
  if (applied.length === 0) {
    return null;
  }
  return (
    <section aria-labelledby={LABEL_ID} className="flex flex-wrap items-center gap-x-3 gap-y-2">
      <p id={LABEL_ID} className="text-caption font-semibold text-muted">
        {i18n.t('visits.filters.applied.label')}
      </p>
      <ul className="flex flex-wrap items-center gap-2">
        {applied.map((filter) => (
          <li key={filter.key} className={CHIP}>
            <span className="min-w-0 wrap-anywhere">{chipText(filter, i18n)}</span>
            <Link
              href={removeHref(filter.without)}
              aria-label={removeLabel(filter, i18n)}
              className={REMOVE}
            >
              <svg width={14} height={14} viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d={CROSS}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                />
              </svg>
            </Link>
          </li>
        ))}
      </ul>
      <Link href={clearHref} className={`text-caption ${TEXT_LINK}`}>
        {i18n.t('visits.filters.applied.clearAll')}
      </Link>
    </section>
  );
}
