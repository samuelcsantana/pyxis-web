'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import type { MouseEvent } from 'react';
import { menuRowClasses } from './menu-row-classes';
import { HELP_ITEM, helpHref, hrefKeepingView, navigationItemOf } from './screens';
import { opensElsewhere } from './sidebar-nav';

export interface HelpMenuRowProps {
  readonly projectId: string;
  readonly label: string;
}

export function HelpMenuRow({ projectId, label }: HelpMenuRowProps) {
  const pathname = usePathname();
  const href = hrefKeepingView(helpHref(projectId), useSearchParams());
  const onItsPage = navigationItemOf(pathname) === HELP_ITEM;
  const reloadAsAPage = (event: MouseEvent<HTMLAnchorElement>) => {
    if (onItsPage && !opensElsewhere(event)) {
      event.preventDefault();
      window.location.assign(href);
    }
  };
  return (
    <Link
      href={href}
      scroll={false}
      aria-current={onItsPage ? 'page' : undefined}
      onClick={reloadAsAPage}
      className={menuRowClasses(onItsPage)}
    >
      {label}
    </Link>
  );
}
