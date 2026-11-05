import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { goalRows } from '@/domain/goals';
import { english } from '@/test-utils/english';
import { GoalPicker } from './goal-picker';
import { GoalsTable } from './goals-table';

const replace = vi.hoisted(() =>
  vi.fn((url: string) => {
    window.history.replaceState(null, '', url);
  }),
);

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace }),
  usePathname: () => window.location.pathname,
  useSearchParams: () => new URLSearchParams(window.location.search),
}));

const SIGN_UP = '7f0c2a4e-1b3d-4e5f-8a6b-9c0d1e2f3a4b';
const PRICING = '8a1d3b5f-2c4e-4f6a-9b7c-0d1e2f3a4b5c';
const CHOICES = [
  { id: SIGN_UP, name: 'Sign-up' },
  { id: PRICING, name: 'Saw the pricing' },
];

beforeEach(() => {
  replace.mockClear();
  window.history.replaceState(null, '', '/p-store/overview?range=7d');
});

describe('GoalPicker', () => {
  function picker(selected: string) {
    render(
      <GoalPicker
        goals={CHOICES}
        selected={selected}
        first={SIGN_UP}
        label="Goal counted as conversions"
      />,
    );
    return screen.getByRole('combobox', { name: 'Goal counted as conversions' });
  }

  it('shows the goal counted, among every goal of the project', () => {
    const select = picker(SIGN_UP);

    expect(select).toHaveValue(SIGN_UP);
    expect([...select.querySelectorAll('option')].map((option) => option.textContent)).toEqual([
      'Sign-up',
      'Saw the pricing',
    ]);
  });

  it('puts the goal picked in the address, keeping the rest, without scrolling', () => {
    const select = picker(SIGN_UP);

    act(() => {
      fireEvent.change(select, { target: { value: PRICING } });
    });

    expect(replace).toHaveBeenCalledWith(`/p-store/overview?range=7d&goal=${PRICING}`, {
      scroll: false,
    });
  });

  it('leaves the first goal out of the address, and leaves the address bare without other parameters', () => {
    window.history.replaceState(null, '', `/p-store/overview?goal=${PRICING}`);
    const select = picker(PRICING);

    act(() => {
      fireEvent.change(select, { target: { value: SIGN_UP } });
    });

    expect(replace).toHaveBeenCalledWith('/p-store/overview', { scroll: false });
  });
});

describe('GoalsTable', () => {
  const rows = goalRows(
    {
      visits: 1200,
      goals: [
        {
          id: SIGN_UP,
          name: 'Sign-up',
          kind: 'event',
          target: 'signup_completed',
          position: 1,
          conversions: 140,
          convertingVisits: 120,
          conversionRate: 0.1,
        },
        {
          id: PRICING,
          name: 'Saw the pricing',
          kind: 'page',
          target: '/pricing',
          position: 2,
          conversions: 0,
          convertingVisits: 0,
          conversionRate: 0,
        },
      ],
    },
    english,
  );

  function table() {
    render(
      <GoalsTable
        rows={rows}
        visits="1,200 visits"
        periodLabel="last 30 days"
        visitsHref={(goalId) => `/p-store/visits?reached_goal=${goalId}`}
        filterOf={(row) => ({
          href: `/p-store/overview?reached_goal=${row.id}`,
          active: false,
          label: `Filter by ${row.name}`,
          title: `Filter every screen by ${row.name}`,
        })}
        i18n={english}
      />,
    );
    return screen.getByRole('region', { name: 'Goals' });
  }

  it('says what it counts and against how many visits', () => {
    expect(table()).toHaveTextContent(
      'Visits that reached each goal, out of 1,200 visits, last 30 days',
    );
  });

  it('gives each goal its kind, target, visits, times reached and rate', () => {
    const [header, signUp, pricing] = within(table()).getAllByRole('row');

    expect(header).toHaveTextContent('GoalVisitsTimes reachedConversion rate');
    expect(signUp).toHaveTextContent('Sign-upEvent signup_completed12014010.0%');
    expect(pricing).toHaveTextContent('Saw the pricingPage /pricing000.0%');
  });

  it('opens the visits that reached a goal, and filters every screen by it', () => {
    const region = table();

    expect(within(region).getByRole('link', { name: 'Sign-up: see its visits' })).toHaveAttribute(
      'href',
      `/p-store/visits?reached_goal=${SIGN_UP}`,
    );
    expect(within(region).getByRole('link', { name: 'Filter by Sign-up' })).toHaveAttribute(
      'href',
      `/p-store/overview?reached_goal=${SIGN_UP}`,
    );
  });

  it('links no list for a goal no visit reached', () => {
    const region = table();

    expect(within(region).queryByRole('link', { name: /Saw the pricing/ })).toBeNull();
    expect(within(region).getByText('Saw the pricing')).toBeInTheDocument();
  });
});
