import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { english } from '@/test-utils/english';
import { FilteredPeriodEmpty } from './filtered-period-empty';

describe('FilteredPeriodEmpty', () => {
  it('says no visit matches the filters in the period and offers to remove them', () => {
    render(
      <FilteredPeriodEmpty
        periodLabel="Sep 30 to Oct 6"
        removeFiltersHref="/p1/overview?range=7d"
        i18n={english}
      />,
    );

    expect(screen.getByRole('heading', { name: 'No visits match these filters' })).toBeVisible();
    expect(
      screen.getByText(
        'Nothing in Sep 30 to Oct 6 matches every filter above. Remove one of them, or all of them.',
      ),
    ).toBeVisible();
    expect(screen.getByRole('link', { name: 'Remove filters' })).toHaveAttribute(
      'href',
      '/p1/overview?range=7d',
    );
  });
});
