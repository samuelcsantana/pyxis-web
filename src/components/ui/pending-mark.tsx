'use client';

import { useLinkStatus } from 'next/link';
import { useHoldNavigationWhile } from '@/components/shell/navigation-pending';

const BAR =
  'pointer-events-none absolute inset-x-2 bottom-1 h-0.5 rounded-full bg-current opacity-0 transition-opacity duration-150 motion-reduce:transition-none data-pending:opacity-100 data-pending:motion-safe:animate-pulse';

export interface PendingBarProps {
  readonly pending: boolean;
}

export function PendingBar({ pending }: PendingBarProps) {
  return <span aria-hidden="true" data-pending={pending ? '' : undefined} className={BAR} />;
}

export function PendingMark() {
  const { pending } = useLinkStatus();
  useHoldNavigationWhile(pending);
  return <PendingBar pending={pending} />;
}
