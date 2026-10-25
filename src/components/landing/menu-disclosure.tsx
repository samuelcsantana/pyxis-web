'use client';

import type { MouseEvent, ReactNode } from 'react';
import { DismissableDetails } from '@/components/ui/dismissable-details';

export interface MenuDisclosureProps {
  readonly className: string;
  readonly children: ReactNode;
}

function closeOnceALinkIsChosen(event: MouseEvent<HTMLDetailsElement>): void {
  if (event.target instanceof HTMLAnchorElement) {
    event.currentTarget.open = false;
  }
}

export function MenuDisclosure({ className, children }: MenuDisclosureProps) {
  return (
    <DismissableDetails className={className} onClick={closeOnceALinkIsChosen}>
      {children}
    </DismissableDetails>
  );
}
