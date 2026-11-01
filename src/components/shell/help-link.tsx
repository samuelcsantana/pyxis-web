'use client';

import { usePathname } from 'next/navigation';
import { PendingMark } from '@/components/ui/pending-mark';
import { useT } from '@/i18n/messages-provider';
import { NavItemIcon, navItemClasses } from './nav-item';
import { HELP_ITEM, helpHref, navigationItemOf } from './screens';
import { ViewKeepingLink } from './view-keeping-link';

export interface HelpLinkProps {
  readonly projectId: string;
}

const HELP_ICON =
  'M12 3a9 9 0 1 1 0 18a9 9 0 1 1 0-18 M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6v.4 M12 16.8v.2';

export function HelpLink({ projectId }: HelpLinkProps) {
  const t = useT();
  const current = navigationItemOf(usePathname()) === HELP_ITEM;
  return (
    <ViewKeepingLink
      href={helpHref(projectId)}
      aria-current={current ? 'page' : undefined}
      className={navItemClasses(current)}
    >
      <NavItemIcon path={HELP_ICON} current={current} />
      <span>{t('nav.help')}</span>
      <PendingMark />
    </ViewKeepingLink>
  );
}
