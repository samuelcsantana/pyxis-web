'use client';

import { BillingActions, type OpenCheckout } from '@/components/account/billing-actions';
import { FREE_PLACE_WAIT_DAYS } from '@/domain/sign-up';
import { useT } from '@/i18n/messages-provider';

export interface FreePlaceWaitProps {
  readonly subscribe: OpenCheckout;
}

export function FreePlaceWait({ subscribe }: FreePlaceWaitProps) {
  const t = useT();
  return (
    <section className="flex w-full max-w-[440px] flex-col gap-4 rounded-panel border border-line bg-card p-8 text-ink">
      <h1 className="text-title font-semibold">{t('signUp.waitTitle')}</h1>
      <p className="text-sm text-muted">
        {t('signUp.waitBody', { days: String(FREE_PLACE_WAIT_DAYS) })}
      </p>
      <BillingActions kind="subscribe" open={subscribe} />
    </section>
  );
}
