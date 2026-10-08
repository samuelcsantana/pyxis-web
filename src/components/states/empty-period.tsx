import Link from 'next/link';
import type { EmptyPeriodView } from '@/domain/empty-period';
import type { I18n } from '@/i18n/i18n';
import { TEXT_LINK } from '@/components/ui/control-classes';
import { EmptyState } from './empty-state';
import { NoActivityYet } from './no-activity-yet';

export interface EmptyPeriodProps {
  readonly view: EmptyPeriodView;
  readonly widerPeriodHref: string;
  readonly endpoint: string | undefined;
  readonly i18n: I18n;
}

export function EmptyPeriod({ view, widerPeriodHref, endpoint, i18n }: EmptyPeriodProps) {
  if (view.kind === 'first-run') {
    return <NoActivityYet endpoint={endpoint} i18n={i18n} />;
  }
  return (
    <EmptyState title={i18n.t('states.emptyPeriod.title')}>
      <p>
        {view.latestEvent === null
          ? i18n.t('states.emptyPeriod.body')
          : i18n.t('states.emptyPeriod.bodyWithLatest', { date: view.latestEvent })}
      </p>
      {view.offersWiderPeriod ? (
        <p>
          <Link href={widerPeriodHref} className={TEXT_LINK}>
            {i18n.t('states.emptyPeriod.widerPeriod')}
          </Link>
        </p>
      ) : null}
    </EmptyState>
  );
}
