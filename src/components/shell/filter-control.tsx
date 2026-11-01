'use client';

import { CONTROL_TRANSITION, FOCUS_RING } from '@/components/ui/control-classes';
import { DismissableDetails } from '@/components/ui/dismissable-details';
import { useT } from '@/i18n/messages-provider';
import { LazyAddFilterForm } from './lazy-add-filter-form';
import type { FilterFieldTexts } from './screen-topbar-texts';

const PLUS_ICON = 'M12 5v14M5 12h14';
const SUMMARY = `inline-flex min-h-10 list-none items-center gap-1.5 rounded-pill border border-dashed border-line-strong px-3 text-caption font-medium text-muted hover:bg-soft hover:text-ink active:bg-line group-open:bg-soft group-open:text-ink [&::-webkit-details-marker]:hidden ${FOCUS_RING} ${CONTROL_TRANSITION}`;
const PANEL =
  'absolute top-full left-0 z-20 mt-1.5 w-72 rounded-input border border-line bg-card p-4 text-ink shadow-lg';

export interface FilterControlProps {
  readonly fields: FilterFieldTexts;
}

export function FilterControl({ fields }: FilterControlProps) {
  const t = useT();
  return (
    <DismissableDetails className="group relative">
      <summary className={SUMMARY}>
        <svg width={14} height={14} viewBox="0 0 24 24" aria-hidden="true">
          <path d={PLUS_ICON} fill="none" stroke="currentColor" strokeWidth={2} />
        </svg>
        {t('nav.filter')}
      </summary>
      <div className={PANEL}>
        <h2 className="mb-3 text-sm font-semibold">{t('nav.addFilter')}</h2>
        <LazyAddFilterForm fields={fields} openAtFirst={false} />
      </div>
    </DismissableDetails>
  );
}
