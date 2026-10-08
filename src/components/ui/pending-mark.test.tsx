import { render, screen } from '@testing-library/react';
import Link from 'next/link';
import { describe, expect, it } from 'vitest';
import { NavigationPendingProvider, NavigationRegion } from '@/components/shell/navigation-pending';
import { PendingBar, PendingMark } from './pending-mark';

describe('PendingBar', () => {
  it('is hidden from assistive technology and marked only while pending', () => {
    const { container, rerender } = render(<PendingBar pending={false} />);
    const bar = container.querySelector('span');

    expect(bar).toHaveAttribute('aria-hidden', 'true');
    expect(bar).not.toHaveAttribute('data-pending');

    rerender(<PendingBar pending />);
    expect(bar).toHaveAttribute('data-pending', '');
  });
});

describe('PendingMark', () => {
  it('leaves the link name alone and the content idle when the link is not navigating', () => {
    const { container } = render(
      <NavigationPendingProvider>
        <NavigationRegion className="flex">
          <Link href="/p1/overview?range=30d">
            30 days
            <PendingMark />
          </Link>
        </NavigationRegion>
      </NavigationPendingProvider>,
    );

    expect(screen.getByRole('link', { name: '30 days' })).toBeInTheDocument();
    expect(container.querySelector('a > span[aria-hidden="true"]')).not.toHaveAttribute(
      'data-pending',
    );
    expect(container.querySelector('[aria-busy]')).toBeNull();
  });
});
