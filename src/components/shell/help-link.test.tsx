import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { renderWithMessages } from '@/test-utils/render-with-messages';
import { HelpLink } from './help-link';

const navigation = vi.hoisted(() => ({ pathname: '/p-1/overview', search: '' }));

vi.mock('next/navigation', () => ({
  usePathname: () => navigation.pathname,
  useSearchParams: () => new URLSearchParams(navigation.search),
}));

function helpFrom(pathname: string, search: string) {
  navigation.pathname = pathname;
  navigation.search = search;
  renderWithMessages(<HelpLink projectId="p-1" />);
  return screen.getByRole('link', { name: 'Help and support' });
}

describe('HelpLink', () => {
  it('links the help of the project, keeping the period and the filters of the screen', () => {
    const help = helpFrom('/p-1/devices', 'range=7d&country=BR&metric=visitors');

    expect(help).toHaveAttribute('href', '/p-1/help?range=7d&country=BR');
    expect(help).not.toHaveAttribute('aria-current');
  });

  it('marks itself as the current page on the help page', () => {
    const help = helpFrom('/p-1/help', 'range=7d');

    expect(help).toHaveAttribute('aria-current', 'page');
    expect(help).toHaveClass('bg-nav-active');
  });
});
