import { fireEvent, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderWithMessages } from '@/test-utils/render-with-messages';
import { HelpMenuRow } from './help-menu-row';
import { menuRowClasses } from './menu-row-classes';

const navigation = vi.hoisted(() => ({ pathname: '/p-1/overview', search: 'range=7d' }));

vi.mock('next/navigation', () => ({
  usePathname: () => navigation.pathname,
  useSearchParams: () => new URLSearchParams(navigation.search),
}));

const assign = vi.fn();

beforeEach(() => {
  navigation.pathname = '/p-1/overview';
  navigation.search = 'range=7d';
  assign.mockClear();
  vi.stubGlobal('location', { assign });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

function helpRow(): HTMLAnchorElement {
  renderWithMessages(<HelpMenuRow projectId="p-1" label="Help and support" />);
  return screen.getByRole<HTMLAnchorElement>('link', { name: 'Help and support' });
}

describe('HelpMenuRow', () => {
  it('opens Help and support at the project, keeping the view of the screen', () => {
    const row = helpRow();

    expect(row).toHaveAttribute('href', '/p-1/help?range=7d');
    expect(row).not.toHaveAttribute('aria-current');
    expect(row.className).toBe(menuRowClasses());
  });

  it('lets the window open over a screen, without reloading', () => {
    const row = helpRow();

    const opened = fireEvent.click(row);

    expect(opened).toBe(true);
    expect(assign).not.toHaveBeenCalled();
  });

  it('marks itself as where you are on the Help page, and reloads it as a page there', () => {
    navigation.pathname = '/p-1/help';
    navigation.search = '';
    const row = helpRow();

    const opened = fireEvent.click(row);

    expect(row).toHaveAttribute('aria-current', 'page');
    expect(row.className).toBe(menuRowClasses(true));
    expect(opened).toBe(false);
    expect(assign).toHaveBeenCalledWith('/p-1/help');
  });

  it('leaves a click that opens elsewhere to the browser, even on the Help page', () => {
    navigation.pathname = '/p-1/help';
    const row = helpRow();

    fireEvent.click(row, { ctrlKey: true });

    expect(assign).not.toHaveBeenCalled();
  });
});
