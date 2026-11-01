import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { english } from '@/test-utils/english';
import { renderWithMessages } from '@/test-utils/render-with-messages';
import { FilterControl } from './filter-control';
import { LazyAddFilterForm } from './lazy-add-filter-form';
import { screenTopbarTexts } from './screen-topbar-texts';

vi.mock('next/navigation', () => ({
  usePathname: () => '/p1/overview',
  useSearchParams: () => new URLSearchParams('range=7d'),
  useRouter: () => ({ push: vi.fn() }),
}));

const FIELDS = screenTopbarTexts(english).filterFields;

describe('FilterControl', () => {
  it('loads the form only when Filter opens, under its heading', async () => {
    const user = userEvent.setup();
    renderWithMessages(<FilterControl fields={FIELDS} />);

    expect(screen.getByTestId('add-filter-placeholder')).toBeInTheDocument();
    expect(screen.queryByLabelText('Filter by')).not.toBeInTheDocument();
    await user.click(screen.getByText('Filter'));

    expect(await screen.findByLabelText('Filter by')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Add a filter' })).toBeInTheDocument();
  });
});

describe('LazyAddFilterForm', () => {
  it('loads the form at once where it opens with the page, as in the phone sheet', async () => {
    renderWithMessages(<LazyAddFilterForm fields={FIELDS} openAtFirst />);

    expect(await screen.findByLabelText('Filter by')).toBeInTheDocument();
  });
});
