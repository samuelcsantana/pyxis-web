import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ViewKeepingLink } from './view-keeping-link';

const navigation = vi.hoisted(() => ({ search: '' }));

vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(navigation.search),
}));

function linkFrom(search: string, href: string) {
  navigation.search = search;
  render(
    <ViewKeepingLink href={href} className="text-sm">
      Settings
    </ViewKeepingLink>,
  );
  return screen.getByRole('link', { name: 'Settings' });
}

describe('ViewKeepingLink', () => {
  it('carries the period and the filters of the page it is drawn on', () => {
    const link = linkFrom('range=today&device=mobile&metric=visitors', '/p1/settings');

    expect(link).toHaveAttribute('href', '/p1/settings?range=today&device=mobile');
    expect(link).toHaveClass('text-sm');
  });

  it('carries a custom period before the anchor of the link', () => {
    expect(
      linkFrom('from=2026-10-01&to=2026-10-10', '/p1/settings#settings-keys-heading'),
    ).toHaveAttribute('href', '/p1/settings?from=2026-10-01&to=2026-10-10#settings-keys-heading');
  });

  it('leaves the link as it is on a page with no period and no filter', () => {
    expect(linkFrom('', '/p1/install')).toHaveAttribute('href', '/p1/install');
  });
});
