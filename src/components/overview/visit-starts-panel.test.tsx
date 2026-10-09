import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { HOURS_IN_A_DAY, type TimeOfDayReport, WEEKDAYS } from '@/domain/time-of-day';
import { english } from '@/test-utils/english';
import { renderWithMessages } from '@/test-utils/render-with-messages';
import { VisitStartsPanel } from './visit-starts-panel';

const REPORT: TimeOfDayReport = Array.from({ length: WEEKDAYS }, (_, index) => ({
  weekday: index + 1,
  hours: Array.from({ length: HOURS_IN_A_DAY }, (_, hour) =>
    index === 0 && hour === 9 ? 40 : index === 2 && hour === 14 ? 10 : 0,
  ),
}));

function renderPanel(report: TimeOfDayReport = REPORT) {
  return renderWithMessages(
    <VisitStartsPanel report={report} periodLabel="last 30 days" i18n={english} />,
  );
}

describe('VisitStartsPanel', () => {
  it('draws a week of hours named by its busiest hour, shaded by the visits of each', () => {
    const { container } = renderPanel();

    expect(screen.getByRole('heading', { name: 'When visits start' })).toBeInTheDocument();
    expect(
      screen.getByRole('img', { name: 'Busiest: Monday, 09:00 to 10:00 (40 visits).' }),
    ).toBeInTheDocument();
    const cells = container.querySelectorAll('[title]');
    expect(cells).toHaveLength(WEEKDAYS * HOURS_IN_A_DAY);
    expect(container.querySelector('[title="Monday, 09:00: 40 visits"]')).toHaveClass('bg-sky');
    expect(container.querySelector('[title="Wednesday, 14:00: 10 visits"]')).toHaveClass(
      'bg-sky/25',
    );
    expect(container.querySelector('[title="Monday, 10:00: 0 visits"]')).toHaveClass('bg-soft');
  });

  it('shows every hour of every weekday as a table on demand', async () => {
    renderPanel();

    await userEvent.click(screen.getByRole('button', { name: 'Table' }));

    const table = screen.getByRole('table', { name: 'When visits start' });
    expect(within(table).getAllByRole('row')).toHaveLength(WEEKDAYS + 1);
    const monday = within(table).getByRole('rowheader', { name: 'Monday' }).closest('tr');
    expect(monday?.querySelectorAll('td')[9]).toHaveTextContent('40');
  });

  it('says no visit started in an empty period', () => {
    renderPanel(REPORT.map((day) => ({ ...day, hours: day.hours.map(() => 0) })));

    expect(screen.getByRole('img', { name: 'No visit started in this period.' })).toBeVisible();
  });
});
