'use client';

import { useMemo, useSyncExternalStore } from 'react';
import { displayTag } from '@/i18n/display-tag';
import { useLocale, useT } from '@/i18n/messages-provider';
import { activeVisits, noActiveVisits, subscribeToActiveVisits } from './arrival-news';

const PILL =
  'inline-flex items-center gap-2 rounded-pill border border-line bg-card px-2.5 text-caption leading-6 font-medium text-muted tabular-nums';

export function ActiveVisits() {
  const t = useT();
  const locale = useLocale();
  const numbers = useMemo(() => new Intl.NumberFormat(displayTag(locale)), [locale]);
  const count = useSyncExternalStore(subscribeToActiveVisits, activeVisits, noActiveVisits);
  if (count === undefined) {
    return null;
  }
  const someone = count > 0;
  return (
    <span className={PILL}>
      <span aria-hidden="true" className="relative flex size-2">
        {someone ? (
          <span className="absolute inset-0 rounded-full bg-ok opacity-60 motion-safe:animate-ping" />
        ) : null}
        <span className={`relative size-2 rounded-full ${someone ? 'bg-ok' : 'bg-muted'}`} />
      </span>
      {t('nav.arrivals.onTheSiteNow', { count: numbers.format(count) })}
    </span>
  );
}
