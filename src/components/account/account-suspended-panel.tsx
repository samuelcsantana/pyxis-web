import { EmptyState } from '@/components/states/empty-state';
import { TEXT_LINK } from '@/components/ui/control-classes';
import type { I18n } from '@/i18n/i18n';
import { ACCOUNT_PAGE } from './account-notice-banner';

export interface AccountSuspendedPanelProps {
  readonly i18n: I18n;
}

export function AccountSuspendedPanel({ i18n }: AccountSuspendedPanelProps) {
  return (
    <EmptyState headingLevel="h1" title={i18n.t('accountSuspended.title')}>
      <p>{i18n.t('accountSuspended.explanation')}</p>
      <p>{i18n.t('accountSuspended.owner')}</p>
      <a href={ACCOUNT_PAGE} className={`self-start ${TEXT_LINK}`}>
        {i18n.t('accountSuspended.open')}
      </a>
    </EmptyState>
  );
}
