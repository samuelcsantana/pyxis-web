import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { english } from '@/test-utils/english';
import { RequestFilters } from './request-filters';

describe('RequestFilters', () => {
  it('marks every route as shown and offers the failing ones', () => {
    render(
      <RequestFilters
        i18n={english}
        kind="writes"
        allHref="/p1/requests?range=7d"
        failingHref="/p1/requests?range=7d&show=failing"
        failingOnly={false}
        screen={null}
        clearScreenHref="/p1/requests?range=7d"
      />,
    );

    expect(screen.getByRole('link', { name: 'All routes' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(screen.getByRole('link', { name: 'Failing only' })).toHaveAttribute(
      'href',
      '/p1/requests?range=7d&show=failing',
    );
    expect(screen.queryByText('From screen')).not.toBeInTheDocument();
  });

  it('shows the failing filter and the screen filter with a way to clear it', () => {
    render(
      <RequestFilters
        i18n={english}
        kind="writes"
        allHref="/p1/requests?range=7d&screen=%2Forders"
        failingHref="/p1/requests?range=7d&show=failing&screen=%2Forders"
        failingOnly
        screen="/orders"
        clearScreenHref="/p1/requests?range=7d&show=failing"
      />,
    );

    expect(screen.getByRole('link', { name: 'Failing only' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(screen.getByRole('link', { name: 'All routes' })).not.toHaveAttribute('aria-current');
    expect(screen.getByText('/orders')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Clear the screen filter' })).toHaveAttribute(
      'href',
      '/p1/requests?range=7d&show=failing',
    );
  });

  it('offers no "failing only" switch for failed reads, which all failed', () => {
    render(
      <RequestFilters
        i18n={english}
        kind="reads"
        allHref="/p1/requests?range=7d&kind=reads"
        failingHref="/p1/requests?range=7d&kind=reads&show=failing"
        failingOnly={false}
        screen="/products"
        clearScreenHref="/p1/requests?range=7d&kind=reads"
      />,
    );

    expect(screen.queryByRole('navigation', { name: 'Show' })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Clear the screen filter' })).toHaveAttribute(
      'href',
      '/p1/requests?range=7d&kind=reads',
    );
  });
});
