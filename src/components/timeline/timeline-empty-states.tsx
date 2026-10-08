import Link from 'next/link';
import { EmptyState } from '@/components/states/empty-state';
import { TEXT_LINK } from '@/components/ui/control-classes';
import type { I18n } from '@/i18n/i18n';

export interface DemoPersonLink {
  readonly userId: string;
  readonly href: string;
}

export interface LookUpPromptProps {
  readonly demoPerson: DemoPersonLink | null;
  readonly i18n: I18n;
}

export function LookUpPrompt({ demoPerson, i18n }: LookUpPromptProps) {
  return (
    <EmptyState title={i18n.t('timeline.lookUp.title')}>
      <p>{i18n.t('timeline.lookUp.body')}</p>
      {demoPerson === null ? null : (
        <p>
          <Link href={demoPerson.href} className={TEXT_LINK}>
            {i18n.t('timeline.lookUp.demoPerson', { user: demoPerson.userId })}
          </Link>
        </p>
      )}
    </EmptyState>
  );
}

export interface NoVisitsFoundProps {
  readonly lookupTitle: string;
  readonly i18n: I18n;
}

export function NoVisitsFound({ lookupTitle, i18n }: NoVisitsFoundProps) {
  return (
    <EmptyState title={i18n.t('timeline.notFound.title', { lookup: lookupTitle })}>
      <p>{i18n.t('timeline.notFound.body')}</p>
    </EmptyState>
  );
}
