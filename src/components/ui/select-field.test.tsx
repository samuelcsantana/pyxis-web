import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SelectField } from './select-field';

describe('SelectField', () => {
  it('is a real select, labelled by its label, with room for its own arrow', () => {
    const onChange = vi.fn();
    render(
      <label>
        Channel
        <SelectField name="channel" defaultValue="" className="px-3" onChange={onChange}>
          <option value="">Any channel</option>
          <option value="paid">Paid</option>
        </SelectField>
      </label>,
    );

    const select = screen.getByRole('combobox', { name: 'Channel' });
    expect(select).toHaveClass('select-field', 'pr-9', 'px-3');
    expect(select).toHaveAttribute('name', 'channel');

    fireEvent.change(select, { target: { value: 'paid' } });

    expect(onChange).toHaveBeenCalledOnce();
    expect(select).toHaveValue('paid');
  });

  it('lets its frame take a width', () => {
    const { container } = render(
      <SelectField aria-label="Kind" frameClassName="w-60">
        <option>Person</option>
      </SelectField>,
    );

    expect(container.firstElementChild).toHaveClass('relative', 'w-60');
  });
});
