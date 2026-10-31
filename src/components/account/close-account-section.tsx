'use client';

import { useId, useState } from 'react';
import { BUTTON_DANGER } from '@/components/ui/control-classes';
import { useLocale, useT } from '@/i18n/messages-provider';
import { type AccountClosed, type CloseAccount, CloseAccountForm } from './close-account-form';
import { refundAmount } from './refund-amount';

export interface CloseAccountSectionProps {
  readonly open: boolean;
  readonly onFreePlan?: boolean;
  readonly close: CloseAccount;
}

const SECTION = 'flex flex-col gap-3 rounded-[0.875rem] border border-bad/40 p-4';
const NOTE = 'text-xs leading-[18px] text-muted';

function ClosedStatus({ closed }: { readonly closed: AccountClosed }) {
  const t = useT();
  const locale = useLocale();
  const day = new Intl.DateTimeFormat(locale, { dateStyle: 'long', timeZone: 'UTC' });
  return (
    <div role="status" className="flex flex-col gap-1 text-sm font-medium">
      <p>{t('closeAccount.closed', { date: day.format(new Date(closed.deletionOn)) })}</p>
      {closed.refundedAmount > 0 ? (
        <p>{t('closeAccount.refunded', { amount: refundAmount(locale, closed.refundedAmount) })}</p>
      ) : null}
    </div>
  );
}

export function CloseAccountSection({ open, onFreePlan = false, close }: CloseAccountSectionProps) {
  const t = useT();
  const formId = useId();
  const [closed, setClosed] = useState<AccountClosed | null>(null);
  const [confirming, setConfirming] = useState(false);
  if (closed === null && !open) {
    return null;
  }
  return (
    <section aria-labelledby={`${formId}-heading`} className={SECTION}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <h3 id={`${formId}-heading`} className="text-base font-semibold">
            {t('closeAccount.heading')}
          </h3>
          {closed === null ? (
            <p className="text-sm">
              {onFreePlan ? t('closeAccount.freeNote') : t('closeAccount.note')}
            </p>
          ) : null}
        </div>
        {closed === null ? (
          <button
            type="button"
            aria-expanded={confirming}
            aria-controls={formId}
            onClick={() => {
              setConfirming(!confirming);
            }}
            className={`min-h-11 shrink-0 rounded-input px-4 text-sm ${BUTTON_DANGER}`}
          >
            {t('closeAccount.heading')}
          </button>
        ) : null}
      </div>
      {closed === null ? (
        <div id={formId} hidden={!confirming} className="flex flex-col gap-2">
          {onFreePlan ? null : <p className={NOTE}>{t('closeAccount.refundNote')}</p>}
          <CloseAccountForm close={close} onClosed={setClosed} />
        </div>
      ) : (
        <ClosedStatus closed={closed} />
      )}
    </section>
  );
}
