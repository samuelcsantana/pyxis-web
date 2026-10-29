'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import type { ComponentProps } from 'react';
import { hrefKeepingView } from './screens';

export type ViewKeepingLinkProps = Omit<ComponentProps<typeof Link>, 'href'> & {
  readonly href: string;
};

export function ViewKeepingLink({ href, ...props }: ViewKeepingLinkProps) {
  const search = useSearchParams();
  return <Link {...props} href={hrefKeepingView(href, search)} />;
}
