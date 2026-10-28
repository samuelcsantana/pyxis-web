import { FREE_REPLY_DAYS, PAID_REPLY_BUSINESS_DAYS, type SupportPlan } from '@/domain/support';
import type { I18n } from '@/i18n/i18n';

export interface SupportRepliesProps {
  readonly plan: SupportPlan | null;
  readonly i18n: I18n;
}

export function SupportReplies({ plan, i18n }: SupportRepliesProps) {
  return (
    <>
      {plan === 'free' ? null : (
        <p className="text-sm">
          {i18n.t('support.paidReply', { days: i18n.format.count(PAID_REPLY_BUSINESS_DAYS) })}
        </p>
      )}
      {plan === 'paid' ? null : (
        <p className="text-sm">
          {i18n.t('support.freeReply', { days: i18n.format.count(FREE_REPLY_DAYS) })}
        </p>
      )}
    </>
  );
}
