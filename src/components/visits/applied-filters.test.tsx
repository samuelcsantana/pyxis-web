import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { appliedVisitFilters } from '@/domain/applied-visit-filters';
import { NO_VISIT_FILTERS, type VisitFilters, visitFilterParameters } from '@/domain/visits';
import { english } from '@/test-utils/english';
import { AppliedVisitFilters } from './applied-visit-filters';

const APPLIED: VisitFilters = {
  ...NO_VISIT_FILTERS,
  event: 'signup_completed',
  channel: 'paid',
  failed: true,
};

function removeHref(without: VisitFilters): string {
  return `/p1/visits?${new URLSearchParams(visitFilterParameters(without)).toString()}`;
}

describe('AppliedVisitFilters', () => {
  it('shows nothing when no filter is applied', () => {
    const { container } = render(
      <AppliedVisitFilters
        applied={[]}
        removeHref={removeHref}
        clearHref="/p1/visits"
        i18n={english}
      />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('lists each applied filter with a link that removes only it, and one that clears all', () => {
    render(
      <AppliedVisitFilters
        applied={appliedVisitFilters(APPLIED, english)}
        removeHref={removeHref}
        clearHref="/p1/visits?range=7d"
        i18n={english}
      />,
    );

    const region = screen.getByRole('region', { name: 'Applied filters' });
    expect(
      within(region)
        .getAllByRole('listitem')
        .map((item) => item.textContent),
    ).toEqual(['Had event: signup_completed', 'Channel: Paid', 'With a failed request']);
    expect(within(region).getByText('signup_completed')).toHaveClass('font-mono');
    expect(within(region).getByText('Paid')).toHaveClass('font-medium');
    expect(within(region).getByRole('link', { name: 'Remove Channel: Paid' })).toHaveAttribute(
      'href',
      '/p1/visits?event=signup_completed&failed=true',
    );
    expect(
      within(region).getByRole('link', { name: 'Remove With a failed request' }),
    ).toHaveAttribute('href', '/p1/visits?event=signup_completed&channel=paid');
    expect(within(region).getByRole('link', { name: 'Clear all' })).toHaveAttribute(
      'href',
      '/p1/visits?range=7d',
    );
  });
});
