import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithMessages } from '@/test-utils/render-with-messages';
import { LazyRangeCalendar } from './lazy-range-calendar';

const CALENDAR = { from: '2026-09-10', to: '2026-10-09', today: '2026-10-09' };

describe('LazyRangeCalendar', () => {
  it('keeps a placeholder until its details open, then loads the calendar', async () => {
    const { container } = renderWithMessages(
      <details>
        <summary>Custom</summary>
        <LazyRangeCalendar {...CALENDAR} openAtFirst={false} />
      </details>,
    );
    const details = container.querySelector('details');

    expect(screen.getByTestId('calendar-placeholder')).toBeInTheDocument();
    expect(screen.queryByRole('grid')).not.toBeInTheDocument();

    if (details !== null) {
      details.open = true;
    }

    expect(await screen.findByRole('grid', { name: 'October 2026' })).toBeInTheDocument();

    if (details !== null) {
      details.open = false;
    }

    expect(await screen.findByRole('grid', { name: 'October 2026' })).toBeInTheDocument();
  });

  it('loads the calendar at once when it opens with the page', async () => {
    renderWithMessages(<LazyRangeCalendar {...CALENDAR} openAtFirst />);

    expect(await screen.findByRole('grid', { name: 'October 2026' })).toBeInTheDocument();
  });

  it('stays a placeholder outside a details element', () => {
    renderWithMessages(<LazyRangeCalendar {...CALENDAR} openAtFirst={false} />);

    expect(screen.getByTestId('calendar-placeholder')).toBeInTheDocument();
  });
});
