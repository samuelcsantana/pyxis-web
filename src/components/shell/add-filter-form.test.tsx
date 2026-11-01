import { fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { english } from '@/test-utils/english';
import { portuguese } from '@/test-utils/portuguese';
import { renderWithMessages } from '@/test-utils/render-with-messages';
import { AddFilterForm } from './add-filter-form';
import { screenTopbarTexts } from './screen-topbar-texts';

const navigation = vi.hoisted(() => ({
  pathname: '/p1/overview',
  search: 'range=7d&os=ios',
  push: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  usePathname: () => navigation.pathname,
  useSearchParams: () => new URLSearchParams(navigation.search),
  useRouter: () => ({ push: navigation.push }),
}));

const FIELDS = screenTopbarTexts(english).filterFields;

function form() {
  return renderWithMessages(<AddFilterForm fields={FIELDS} />);
}

beforeEach(() => {
  navigation.push.mockClear();
});

describe('AddFilterForm', () => {
  it('adds the value typed to the address, in capitals for a country, keeping the rest', async () => {
    const user = userEvent.setup();
    form();

    expect(screen.getByLabelText('Filter by')).toHaveValue('country');
    await user.type(screen.getByLabelText('Value'), 'br');
    expect(screen.getByLabelText('Value')).toHaveValue('BR');
    await user.click(screen.getByRole('button', { name: 'Apply' }));

    expect(navigation.push).toHaveBeenCalledWith('/p1/overview?range=7d&os=ios&country=BR', {
      scroll: false,
    });
  });

  it('offers the values of a field that has them, starting on the first', async () => {
    const user = userEvent.setup();
    form();

    await user.selectOptions(screen.getByLabelText('Filter by'), 'device');
    const value = screen.getByLabelText('Value');
    expect(value).toHaveValue('mobile');
    expect(screen.getByRole('option', { name: 'Tablet' })).toBeInTheDocument();
    await user.selectOptions(value, 'tablet');
    await user.click(screen.getByRole('button', { name: 'Apply' }));

    expect(navigation.push).toHaveBeenCalledWith('/p1/overview?range=7d&os=ios&device=tablet', {
      scroll: false,
    });
  });

  it('keeps what is typed as it is outside a code, and starts empty on another field', async () => {
    const user = userEvent.setup();
    form();

    await user.type(screen.getByLabelText('Value'), 'p');
    await user.selectOptions(screen.getByLabelText('Filter by'), 'campaign');
    expect(screen.getByLabelText('Value')).toHaveValue('');
    await user.type(screen.getByLabelText('Value'), ' Spring_Sale ');
    await user.click(screen.getByRole('button', { name: 'Apply' }));

    expect(navigation.push).toHaveBeenCalledWith(
      '/p1/overview?range=7d&os=ios&campaign=Spring_Sale',
      { scroll: false },
    );
  });

  it('describes the value with the hint of its field, when it has one, and its rule', async () => {
    const user = userEvent.setup();
    form();

    const value = screen.getByLabelText('Value');
    expect(value).toHaveAccessibleDescription('Two-letter code');
    expect(value).toHaveAttribute('pattern', '[A-Z]{2}');
    expect(value).toHaveAttribute('placeholder', 'BR');
    await user.selectOptions(screen.getByLabelText('Filter by'), 'campaign');

    expect(screen.getByLabelText('Value')).not.toHaveAccessibleDescription();
    expect(screen.getByLabelText('Value')).toHaveAttribute('maxlength', '64');
  });

  it('goes back to the first field for a field it does not know', async () => {
    const user = userEvent.setup();
    form();
    await user.selectOptions(screen.getByLabelText('Filter by'), 'device');

    fireEvent.change(screen.getByLabelText('Filter by'), { target: { value: 'weather' } });

    expect(screen.getByLabelText('Filter by')).toHaveValue('country');
    expect(screen.getByLabelText('Value')).toHaveValue('');
  });

  it('applies nothing for a value of blanks', () => {
    const { container } = form();
    fireEvent.change(screen.getByLabelText('Value'), { target: { value: '   ' } });

    const element = container.querySelector('form');
    if (element !== null) {
      fireEvent.submit(element);
    }

    expect(navigation.push).not.toHaveBeenCalled();
  });

  it('closes the menu that holds it and gives the focus back to its button', async () => {
    const user = userEvent.setup();
    const { container } = renderWithMessages(
      <details open>
        <summary>Filter</summary>
        <AddFilterForm fields={FIELDS} />
      </details>,
    );

    await user.type(screen.getByLabelText('Value'), 'pt');
    await user.click(screen.getByRole('button', { name: 'Apply' }));

    expect(container.querySelector('details')).not.toHaveAttribute('open');
    expect(screen.getByText('Filter')).toHaveFocus();
  });

  it('speaks the language of the admin', () => {
    renderWithMessages(
      <AddFilterForm fields={screenTopbarTexts(portuguese).filterFields} />,
      'pt-BR',
    );

    expect(screen.getByLabelText('Filtrar por')).toHaveDisplayValue('País');
    expect(screen.getByRole('button', { name: 'Aplicar' })).toBeInTheDocument();
  });
});
