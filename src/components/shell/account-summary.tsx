'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { NAV_CONTROL } from '@/components/ui/control-classes';
import { ACCOUNT_MENU_ITEM, navigationItemOf } from './screens';

export interface AccountSummaryProps {
  readonly children: ReactNode;
}

const ROW = `group/account flex min-h-11 list-none items-center gap-2 rounded-input px-1 ${NAV_CONTROL} [&::-webkit-details-marker]:hidden`;
const ROW_IDLE = 'hover:bg-nav-hover active:bg-nav-active';
const ROW_CURRENT = 'bg-nav-active';

export function AccountSummary({ children }: AccountSummaryProps) {
  const current = navigationItemOf(usePathname()) === ACCOUNT_MENU_ITEM;
  return (
    <summary
      data-current={current ? '' : undefined}
      className={`${ROW} ${current ? ROW_CURRENT : ROW_IDLE}`}
    >
      {children}
    </summary>
  );
}
