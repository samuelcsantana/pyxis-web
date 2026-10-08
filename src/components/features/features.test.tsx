import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { featureRows } from '@/domain/features';
import { FeatureSearch } from './feature-search';
import { FeatureTable } from './feature-table';
import { FeatureTabs } from './feature-tabs';

function visitsHref(name: string): string {
  return `/p1/visits?${new URLSearchParams({ range: '7d', event: name }).toString()}`;
}

const ITEMS = [
  { name: 'cta_clicked', count: 120, visits: 90, daily: [50, 70] },
  { name: 'login_completed', count: 40, visits: 30, daily: [20, 20] },
];

describe('FeatureTabs', () => {
  it('links both kinds and marks the current one', () => {
    render(
      <FeatureTabs
        current="screens"
        tabs={[
          { kind: 'events', label: 'Events', href: '/p1/features?range=7d&kind=events' },
          { kind: 'screens', label: 'Screens', href: '/p1/features?range=7d&kind=screens' },
        ]}
      />,
    );

    expect(screen.getByRole('link', { name: 'Screens' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Events' })).not.toHaveAttribute('aria-current');
    expect(screen.getByRole('link', { name: 'Events' })).toHaveAttribute(
      'href',
      '/p1/features?range=7d&kind=events',
    );
  });
});

describe('FeatureSearch', () => {
  it('sends the search with the period and the kind, and offers to clear it', () => {
    const { container } = render(
      <FeatureSearch
        action="/p1/features"
        keep={{ range: '7d', kind: 'events' }}
        query="cta"
        label="Search events"
        clearHref="/p1/features?range=7d&kind=events"
      />,
    );

    expect(screen.getByRole('search')).toHaveAttribute('action', '/p1/features');
    expect(screen.getByRole('searchbox', { name: 'Search events' })).toHaveValue('cta');
    expect(container.querySelector('input[type="hidden"][name="kind"]')).toHaveValue('events');
    expect(screen.getByRole('link', { name: 'Clear' })).toHaveAttribute(
      'href',
      '/p1/features?range=7d&kind=events',
    );
  });

  it('offers nothing to clear without a search', () => {
    render(
      <FeatureSearch
        action="/p1/features"
        keep={{}}
        query=""
        label="Search screens"
        clearHref="/"
      />,
    );

    expect(screen.queryByRole('link', { name: 'Clear' })).not.toBeInTheDocument();
  });
});

describe('FeatureTable', () => {
  it('lists events by label and name, with count, visits, trend and share', () => {
    const { container } = render(
      <FeatureTable
        kind="events"
        rows={featureRows(ITEMS, 'events', '')}
        query=""
        visitsHref={visitsHref}
      />,
    );

    const rows = screen.getAllByRole('row');
    expect(screen.getByRole('table', { name: 'Most used events' })).toBeInTheDocument();
    expect(rows[1]).toHaveTextContent('CTA clickedcta_clicked1209075%');
    expect(container.querySelectorAll('polyline')).toHaveLength(2);
  });

  it('lists screens by path only', () => {
    render(
      <FeatureTable
        kind="screens"
        rows={featureRows(
          [{ name: '/orders/:id', count: 5, visits: 4, daily: [5] }],
          'screens',
          '',
        )}
        query=""
        visitsHref={(path) => `/p1/visits?range=7d&path=${encodeURIComponent(path)}`}
      />,
    );

    expect(screen.getByRole('table', { name: 'Most visited screens' })).toBeInTheDocument();
    expect(screen.getAllByRole('row')[1]).toHaveTextContent('/orders/:id54100%');
    expect(screen.getByRole('link', { name: '/orders/:id: see its visits' })).toHaveAttribute(
      'href',
      '/p1/visits?range=7d&path=%2Forders%2F%3Aid',
    );
  });

  it('links each event to the visits that sent it', () => {
    render(
      <FeatureTable
        kind="events"
        rows={featureRows(ITEMS, 'events', '')}
        query=""
        visitsHref={visitsHref}
      />,
    );

    expect(screen.getByRole('link', { name: 'Login completed: see its visits' })).toHaveAttribute(
      'href',
      '/p1/visits?range=7d&event=login_completed',
    );
  });

  it('says what is missing: nothing tracked, or nothing matching the search', () => {
    const { rerender } = render(
      <FeatureTable kind="events" rows={[]} query="" visitsHref={visitsHref} />,
    );
    expect(screen.getByText(/No named events in this period/)).toBeInTheDocument();

    rerender(<FeatureTable kind="screens" rows={[]} query="" visitsHref={visitsHref} />);
    expect(screen.getByText('No page views in this period.')).toBeInTheDocument();

    rerender(<FeatureTable kind="events" rows={[]} query="zzz" visitsHref={visitsHref} />);
    expect(screen.getByText('Nothing matches “zzz”.')).toBeInTheDocument();
  });
});
