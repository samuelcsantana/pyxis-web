'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  NAV_CONTROL,
  NAV_ITEM_CURRENT,
  NAV_ITEM_IDLE,
  PENDING_HOST,
} from '@/components/ui/control-classes';
import { PendingMark } from '@/components/ui/pending-mark';
import { useT } from '@/i18n/messages-provider';
import { settingsHref } from './screens';

export interface SettingsLinkProps {
  readonly projectId: string;
}

const GEAR_ICON =
  'M12 9a3 3 0 1 1 0 6a3 3 0 1 1 0-6 M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z';

export function SettingsLink({ projectId }: SettingsLinkProps) {
  const t = useT();
  const href = settingsHref(projectId);
  const current = usePathname() === href;
  const label = t('nav.projectSettings');
  return (
    <Link
      href={href}
      aria-label={label}
      title={label}
      aria-current={current ? 'page' : undefined}
      className={`flex size-11 shrink-0 items-center justify-center rounded-input ${PENDING_HOST} ${NAV_CONTROL} ${current ? NAV_ITEM_CURRENT : NAV_ITEM_IDLE}`}
    >
      <svg
        width={18}
        height={18}
        viewBox="0 0 24 24"
        aria-hidden="true"
        className={current ? 'text-accent' : 'text-nav-muted'}
      >
        <path
          d={GEAR_ICON}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.6}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <PendingMark />
    </Link>
  );
}
