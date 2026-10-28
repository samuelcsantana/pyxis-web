import { SupportAddress } from '@/components/support/support-address';
import { SupportReplies } from '@/components/support/support-replies';
import { PANEL, PANEL_TITLE } from '@/components/ui/panel-classes';
import type { SupportPlan } from '@/domain/support';
import type { I18n } from '@/i18n/i18n';

export interface AccountSupportProps {
  readonly email: string;
  readonly plan: SupportPlan | null;
  readonly i18n: I18n;
}

const HEADING_ID = 'account-support-heading';

export function AccountSupport({ email, plan, i18n }: AccountSupportProps) {
  return (
    <section aria-labelledby={HEADING_ID} className={PANEL}>
      <h2 id={HEADING_ID} className={PANEL_TITLE}>
        {i18n.t('support.accountHeading')}
      </h2>
      <SupportReplies plan={plan} i18n={i18n} />
      <SupportAddress
        id="account-support-address"
        labels={{
          copy: i18n.t('support.copy'),
          copied: i18n.t('support.copied'),
          selected: i18n.t('support.selected'),
        }}
      />
      <p className="text-xs leading-[18px] text-muted">
        {i18n.t('support.fromAccount', { email })} {i18n.t('support.noPersonalData')}
      </p>
    </section>
  );
}
