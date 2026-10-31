'use client';

import type { DetailsHTMLAttributes, FocusEvent, KeyboardEvent, SyntheticEvent } from 'react';

export interface DismissableDetailsProps extends Omit<
  DetailsHTMLAttributes<HTMLDetailsElement>,
  'open' | 'onKeyDown' | 'onBlur' | 'onToggle'
> {
  readonly defaultOpen?: boolean;
  readonly revealWhenOpened?: boolean;
}

function closeOnPointerOutside(details: HTMLDetailsElement) {
  const page = details.ownerDocument;
  const close = (event: PointerEvent) => {
    if (details.open && event.target instanceof Node && !details.contains(event.target)) {
      details.open = false;
    }
  };
  page.addEventListener('pointerdown', close);
  return () => {
    page.removeEventListener('pointerdown', close);
  };
}

function closeOnEscape(event: KeyboardEvent<HTMLDetailsElement>) {
  const details = event.currentTarget;
  if (event.key !== 'Escape' || !details.open) {
    return;
  }
  event.preventDefault();
  details.open = false;
  details.querySelector<HTMLElement>(':scope > summary')?.focus();
}

function closeWhenFocusLeaves(event: FocusEvent<HTMLDetailsElement>) {
  const next = event.relatedTarget;
  if (next instanceof Node && !event.currentTarget.contains(next)) {
    event.currentTarget.open = false;
  }
}

function closeWhatItHolds(details: HTMLDetailsElement) {
  for (const inner of details.querySelectorAll<HTMLDetailsElement>('details[open]')) {
    inner.open = false;
  }
}

function followTheToggle(revealWhenOpened: boolean) {
  return (event: SyntheticEvent<HTMLDetailsElement>) => {
    const details = event.currentTarget;
    if (!details.open) {
      closeWhatItHolds(details);
      return;
    }
    if (revealWhenOpened) {
      details.scrollIntoView({ block: 'nearest' });
    }
  };
}

export function DismissableDetails({
  defaultOpen = false,
  revealWhenOpened = false,
  children,
  ...attributes
}: DismissableDetailsProps) {
  return (
    <details
      {...attributes}
      ref={closeOnPointerOutside}
      open={defaultOpen}
      onKeyDown={closeOnEscape}
      onBlur={closeWhenFocusLeaves}
      onToggle={followTheToggle(revealWhenOpened)}
    >
      {children}
    </details>
  );
}
