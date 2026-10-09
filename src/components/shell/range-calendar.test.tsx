import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithMessages } from '@/test-utils/render-with-messages';
import { RangeCalendar } from './range-calendar';

const TODAY = '2026-10-09';

function renderCalendar(from = '2026-09-10', to = TODAY, locale: 'en' | 'pt-BR' = 'en') {
  return renderWithMessages(
    <form>
      <RangeCalendar from={from} to={to} today={TODAY} />
    </form>,
    locale,
  );
}

function day(name: string) {
  return screen.getByRole('button', { name });
}

function hidden(name: 'from' | 'to') {
  return document.querySelector<HTMLInputElement>(`input[name="${name}"]`)?.value;
}

function selectedDays(): readonly string[] {
  return [...document.querySelectorAll('[role="gridcell"][aria-selected="true"]')].map(
    (cell) => cell.textContent,
  );
}

describe('RangeCalendar', () => {
  it('opens on the month of the last day, with the range, its length and a working Apply', () => {
    renderCalendar();

    expect(screen.getByRole('grid', { name: 'October 2026' })).toBeInTheDocument();
    expect(screen.getByText('Sep 10 – Oct 9, 2026 · 30 days')).toBeInTheDocument();
    expect(selectedDays()).toEqual(['1', '2', '3', '4', '5', '6', '7', '8', '9']);
    expect(day('Friday, October 9, 2026')).toHaveAttribute('aria-current', 'date');
    expect(day('Friday, October 9, 2026')).toHaveAttribute('tabindex', '0');
    expect(day('Thursday, October 8, 2026')).toHaveAttribute('tabindex', '-1');
    expect(screen.getByRole('button', { name: 'Apply' })).toBeEnabled();
    expect([hidden('from'), hidden('to')]).toEqual(['2026-09-10', TODAY]);
    expect(screen.getAllByRole('columnheader').map((header) => header.textContent)).toEqual([
      'S',
      'M',
      'T',
      'W',
      'T',
      'F',
      'S',
    ]);
  });

  it('starts a range on a click, previews it under the pointer and ends it on the second click', () => {
    renderCalendar();

    fireEvent.click(day('Friday, October 2, 2026'));

    expect(screen.getByText('From Oct 2, 2026: now choose the last day.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Apply' })).toBeDisabled();
    expect(selectedDays()).toEqual(['2']);
    expect([hidden('from'), hidden('to')]).toEqual(['2026-10-02', '2026-10-02']);

    fireEvent.mouseEnter(day('Wednesday, October 7, 2026'));
    expect(day('Monday, October 5, 2026').closest('td')).toHaveClass('bg-accent/25');
    expect(selectedDays()).toEqual(['2']);

    fireEvent.mouseLeave(screen.getByRole('grid'));
    expect(day('Monday, October 5, 2026').closest('td')).not.toHaveClass('bg-accent/25');

    fireEvent.click(day('Wednesday, October 7, 2026'));

    expect(screen.getByText('Oct 2 – Oct 7, 2026 · 6 days')).toBeInTheDocument();
    expect(selectedDays()).toEqual(['2', '3', '4', '5', '6', '7']);
    expect([hidden('from'), hidden('to')]).toEqual(['2026-10-02', '2026-10-07']);
    expect(screen.getByRole('button', { name: 'Apply' })).toBeEnabled();
  });

  it('takes a last day before the first one as the start, and a single day as a range', () => {
    renderCalendar();
    fireEvent.click(day('Wednesday, October 7, 2026'));
    fireEvent.click(day('Friday, October 2, 2026'));

    expect([hidden('from'), hidden('to')]).toEqual(['2026-10-02', '2026-10-07']);

    fireEvent.click(day('Monday, October 5, 2026'));
    fireEvent.click(day('Monday, October 5, 2026'));

    expect(screen.getByText('Oct 5, 2026 · 1 day')).toBeInTheDocument();
  });

  it('ignores days after today, which it shows as unavailable', () => {
    renderCalendar();

    fireEvent.click(day('Saturday, October 10, 2026'));

    expect(day('Saturday, October 10, 2026')).toHaveAttribute('aria-disabled', 'true');
    expect(screen.getByText('Sep 10 – Oct 9, 2026 · 30 days')).toBeInTheDocument();
  });

  it('never shows a month after the one of today, but goes back as far as asked', () => {
    renderCalendar();

    expect(screen.getByRole('button', { name: 'Next month' })).toBeDisabled();

    fireEvent.click(screen.getByRole('button', { name: 'Previous month' }));

    expect(screen.getByRole('grid', { name: 'September 2026' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next month' })).toBeEnabled();
    expect(day('Thursday, September 10, 2026').closest('td')).toHaveClass('rounded-l-pill');

    fireEvent.click(screen.getByRole('button', { name: 'Next month' }));

    expect(screen.getByRole('grid', { name: 'October 2026' })).toBeInTheDocument();
  });

  it('refuses a last day more than 400 days from the first', () => {
    renderCalendar('2025-09-01', '2025-09-30');
    fireEvent.click(day('Monday, September 1, 2025'));
    for (let month = 0; month < 13; month += 1) {
      fireEvent.click(screen.getByRole('button', { name: 'Next month' }));
    }

    expect(day('Friday, October 9, 2026')).toHaveAttribute('aria-disabled', 'true');

    fireEvent.click(day('Friday, October 9, 2026'));

    expect(screen.getByText('From Sep 1, 2025: now choose the last day.')).toBeInTheDocument();
    expect(day('Saturday, October 3, 2026')).not.toHaveAttribute('aria-disabled');
  });

  it('moves the focus through days and months with the keys of a grid, never past today', () => {
    renderCalendar();
    const start = day('Friday, October 9, 2026');
    start.focus();

    fireEvent.keyDown(start, { key: 'ArrowLeft' });
    expect(day('Thursday, October 8, 2026')).toHaveFocus();
    expect(day('Thursday, October 8, 2026')).toHaveAttribute('tabindex', '0');

    fireEvent.keyDown(document.activeElement ?? start, { key: 'ArrowUp' });
    expect(day('Thursday, October 1, 2026')).toHaveFocus();

    fireEvent.keyDown(document.activeElement ?? start, { key: 'PageUp' });
    expect(screen.getByRole('grid', { name: 'September 2026' })).toBeInTheDocument();
    expect(day('Tuesday, September 1, 2026')).toHaveFocus();

    fireEvent.keyDown(document.activeElement ?? start, { key: 'PageUp', shiftKey: true });
    expect(day('Monday, September 1, 2025')).toHaveFocus();

    fireEvent.keyDown(document.activeElement ?? start, { key: 'PageDown', shiftKey: true });
    fireEvent.keyDown(document.activeElement ?? start, { key: 'PageDown' });
    fireEvent.keyDown(document.activeElement ?? start, { key: 'ArrowDown' });
    expect(day('Thursday, October 8, 2026')).toHaveFocus();

    fireEvent.keyDown(document.activeElement ?? start, { key: 'ArrowDown' });
    expect(day('Friday, October 9, 2026')).toHaveFocus();

    fireEvent.keyDown(document.activeElement ?? start, { key: 'Tab' });
    expect(day('Friday, October 9, 2026')).toHaveFocus();
  });

  it('speaks Portuguese', () => {
    renderCalendar('2026-09-10', TODAY, 'pt-BR');

    expect(screen.getByRole('grid', { name: 'outubro de 2026' })).toBeInTheDocument();
    expect(screen.getByText('10 de set. – 9 de out. de 2026 · 30 dias')).toBeInTheDocument();
    expect(day('sexta-feira, 9 de outubro de 2026')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Aplicar' })).toBeEnabled();
  });
});
