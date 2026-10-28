import { render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { english } from '@/test-utils/english';
import { DashboardFiltersRow, filtersSlot, screenOwnQuery } from './dashboard-filters-row';

vi.mock('@/i18n/get-messages', async () => {
  const { english: messages } = await import('@/test-utils/english');
  return { getI18n: () => Promise.resolve(messages) };
});

describe('DashboardFiltersRow', () => {
  it('draws nothing while no filter is on', () => {
    const { container } = render(
      <DashboardFiltersRow
        projectId="p1"
        screen="overview"
        search={{ range: '7d', metric: 'visits' }}
        i18n={english}
      />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('shows each filter as a chip whose removal keeps the period, the screen and the others', () => {
    render(
      <DashboardFiltersRow
        projectId="p1"
        screen="features"
        search={{ range: '7d', kind: 'events', q: 'cta', device: 'mobile', os: 'ios' }}
        i18n={english}
      />,
    );

    const row = screen.getByRole('region', { name: 'Filters' });
    expect(within(row).getByRole('link', { name: 'Remove Device: Mobile' })).toHaveAttribute(
      'href',
      '/p1/features?range=7d&kind=events&q=cta&os=ios',
    );
    expect(within(row).getByRole('link', { name: 'Remove filters' })).toHaveAttribute(
      'href',
      '/p1/features?range=7d&kind=events&q=cta',
    );
    expect(within(row).getByText('New arrivals are paused while filters are on.')).toBeVisible();
  });

  it('leaves the address bare when removing the last filter of a screen without a period', () => {
    render(
      <DashboardFiltersRow
        projectId="p1"
        screen="devices"
        search={{ browser: 'edge' }}
        i18n={english}
      />,
    );

    expect(screen.getByRole('link', { name: 'Remove filters' })).toHaveAttribute(
      'href',
      '/p1/devices',
    );
  });
});

describe('screenOwnQuery', () => {
  it('keeps the period and the screen parameters but not the filters nor a repeated name', () => {
    expect(
      screenOwnQuery('funnel', { range: '30d', mode: 'user', steps: ['a', 'b'], channel: 'paid' }),
    ).toBe('range=30d&mode=user');
  });
});

describe('filtersSlot', () => {
  it('renders the row of its screen from the address of the page', async () => {
    const Slot = filtersSlot('acquisition');

    render(
      await Slot({
        params: Promise.resolve({ projectId: 'p1' }),
        searchParams: Promise.resolve({ range: '7d', source: 'google' }),
      }),
    );

    expect(screen.getByRole('link', { name: 'Remove Source: google' })).toHaveAttribute(
      'href',
      '/p1/acquisition?range=7d',
    );
  });
});
