import Link from 'next/link';
import { EmptyState } from '@/components/states/empty-state';
import { TEXT_LINK } from '@/components/ui/control-classes';
import type { I18n } from '@/i18n/i18n';

export interface SharedEmptyPeriodProps {
  readonly widerPeriodHref: string;
  readonly i18n: I18n;
}

export function SharedEmptyPeriod({ widerPeriodHref, i18n }: SharedEmptyPeriodProps) {
  return (
    <EmptyState title={i18n.t('states.emptyPeriod.title')}>
      <p>{i18n.t('states.emptyPeriod.body')}</p>
      <p>
        <Link href={widerPeriodHref} className={TEXT_LINK}>
          {i18n.t('states.emptyPeriod.widerPeriod')}
        </Link>
      </p>
    </EmptyState>
  );
}
