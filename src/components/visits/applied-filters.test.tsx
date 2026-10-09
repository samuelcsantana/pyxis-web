import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { appliedVisitFilters } from '@/domain/applied-visit-filters';
import { NO_VISIT_FILTERS, type VisitFilters, visitFilterParameters } from '@/domain/visits';
import { english } from '@/test-utils/english';
import { AppliedVisitFilters } from './applied-visit-filters';
import { UnappliedFilterChanges } from './unapplied-filter-changes';

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

function FiltersForm({ withExtras }: { readonly withExtras: boolean }) {
  return (
    <form>
      <input name="range" defaultValue="30d" />
      <input aria-label="Had event" name="event" defaultValue="signup_completed" />
      <select aria-label="Channel" name="channel" defaultValue="paid">
        <option value="">Any channel</option>
        <option value="paid">Paid</option>
        <option value="email">Email</option>
      </select>
      {withExtras ? (
        <input
          aria-label="With a failed request"
          type="checkbox"
          name="failed"
          value="true"
          defaultChecked
        />
      ) : null}
      <UnappliedFilterChanges
        applied={visitFilterParameters(withExtras ? APPLIED : { ...APPLIED, failed: false })}
        notice="Changes not applied yet"
        undo="Undo"
      />
    </form>
  );
}

afterEach(() => {
  vi.useRealTimers();
});

describe('UnappliedFilterChanges', () => {
  it('says nothing while the form holds the applied filters', () => {
    render(<FiltersForm withExtras />);

    expect(screen.getByRole('status')).toBeEmptyDOMElement();
  });

  it('flags the changed fields and says the changes are not applied yet', () => {
    render(<FiltersForm withExtras />);

    fireEvent.change(screen.getByRole('combobox', { name: 'Channel' }), {
      target: { value: 'email' },
    });
    fireEvent.click(screen.getByRole('checkbox', { name: 'With a failed request' }));

    expect(screen.getByRole('status')).toHaveTextContent('Changes not applied yet');
    expect(screen.getByRole('combobox', { name: 'Channel' })).toHaveAttribute('data-changed');
    expect(screen.getByRole('checkbox', { name: 'With a failed request' })).toHaveAttribute(
      'data-changed',
    );
    expect(screen.getByRole('textbox', { name: 'Had event' })).not.toHaveAttribute('data-changed');
  });

  it('puts the applied filters back in the form on undo', () => {
    vi.useFakeTimers();
    render(<FiltersForm withExtras={false} />);
    const event = screen.getByRole('textbox', { name: 'Had event' });
    fireEvent.input(event, { target: { value: 'cta_clicked' } });

    fireEvent.click(screen.getByRole('button', { name: 'Undo' }));
    act(() => {
      vi.runAllTimers();
    });

    expect(event).toHaveValue('signup_completed');
    expect(event).not.toHaveAttribute('data-changed');
    expect(screen.getByRole('status')).toBeEmptyDOMElement();
  });

  it('does nothing outside a form', () => {
    render(<UnappliedFilterChanges applied={{}} notice="Changes not applied yet" undo="Undo" />);

    expect(screen.getByRole('status')).toBeEmptyDOMElement();
  });
});
