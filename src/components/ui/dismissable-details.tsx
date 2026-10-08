'use client';

import type { DetailsHTMLAttributes, FocusEvent, KeyboardEvent } from 'react';

export interface DismissableDetailsProps extends Omit<
  DetailsHTMLAttributes<HTMLDetailsElement>,
  'open' | 'onKeyDown' | 'onBlur'
> {
  readonly defaultOpen?: boolean;
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

export function DismissableDetails({
  defaultOpen = false,
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
    >
      {children}
    </details>
  );
}
