import { fireEvent, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { IntentPrefetchLink } from './intent-prefetch-link';

vi.mock('next/link', () => ({
  default: ({
    prefetch,
    children,
    ...props
  }: {
    readonly prefetch: boolean | null;
    readonly children: ReactNode;
    readonly href: string;
  }) => (
    <a {...props} data-prefetch={String(prefetch)}>
      {children}
    </a>
  ),
}));

function link() {
  render(<IntentPrefetchLink href="/p1/funnel?range=7d">Funnel</IntentPrefetchLink>);
  return screen.getByRole('link', { name: 'Funnel' });
}

describe('IntentPrefetchLink', () => {
  it('prefetches as Next does by default until someone shows intent', () => {
    expect(link()).toHaveAttribute('data-prefetch', 'null');
  });

  it('prefetches the whole screen once a mouse or a pen rests on it', () => {
    const target = link();

    fireEvent.pointerEnter(target, { pointerType: 'mouse' });

    expect(target).toHaveAttribute('data-prefetch', 'true');
  });

  it('waits for the tap on a touch screen, which has no hover', () => {
    const target = link();

    fireEvent.pointerEnter(target, { pointerType: 'touch' });

    expect(target).toHaveAttribute('data-prefetch', 'null');
  });

  it('prefetches the whole screen when the keyboard focuses it', () => {
    const target = link();

    fireEvent.focus(target);

    expect(target).toHaveAttribute('data-prefetch', 'true');
  });
});
