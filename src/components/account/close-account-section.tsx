'use client';

import { useState } from 'react';
import { useLocale, useT } from '@/i18n/messages-provider';
import { type AccountClosed, type CloseAccount, CloseAccountForm } from './close-account-form';

export interface CloseAccountSectionProps {
  readonly open: boolean;
  readonly close: CloseAccount;
}

const CENTAVOS_PER_REAL = 100;
const CURRENCY = 'BRL';
const SECTION = 'flex flex-col gap-2 border-t border-line pt-3';
const NOTE = 'text-xs leading-[18px] text-muted';

function ClosedStatus({ closed }: { readonly closed: AccountClosed }) {
  const t = useT();
  const locale = useLocale();
  const day = new Intl.DateTimeFormat(locale, { dateStyle: 'long', timeZone: 'UTC' });
  const money = new Intl.NumberFormat(locale, { style: 'currency', currency: CURRENCY });
  return (
    <div role="status" className="flex flex-col gap-1 text-sm font-medium">
      <p>{t('closeAccount.closed', { date: day.format(new Date(closed.deletionOn)) })}</p>
      {closed.refundedAmount > 0 ? (
        <p>
          {t('closeAccount.refunded', {
            amount: money.format(closed.refundedAmount / CENTAVOS_PER_REAL),
          })}
        </p>
      ) : null}
    </div>
  );
}

export function CloseAccountSection({ open, close }: CloseAccountSectionProps) {
  const t = useT();
  const [closed, setClosed] = useState<AccountClosed | null>(null);
  if (closed === null && !open) {
    return null;
  }
  return (
    <div className={SECTION}>
      <h3 className="text-sm font-semibold">{t('closeAccount.heading')}</h3>
      {closed === null ? (
        <>
          <p className="text-sm">{t('closeAccount.note')}</p>
          <p className={NOTE}>{t('closeAccount.refundNote')}</p>
          <CloseAccountForm close={close} onClosed={setClosed} />
        </>
      ) : (
        <ClosedStatus closed={closed} />
      )}
    </div>
  );
}
