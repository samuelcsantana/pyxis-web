import { fireEvent, render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { SelectField } from './select-field';

afterEach(() => {
  vi.restoreAllMocks();
});

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

  it('keeps the native select where the browser cannot customize it', () => {
    vi.spyOn(CSS, 'supports').mockReturnValue(false);
    render(
      <SelectField aria-label="Kind">
        <option>Person</option>
      </SelectField>,
    );

    const select = screen.getByRole('combobox', { name: 'Kind' });
    expect(select.querySelector('button')).toBeNull();
    expect(select.querySelector('selectedcontent')).toBeNull();
  });

  it('shows the chosen option in a slot of its own where the browser customizes selects', () => {
    vi.spyOn(CSS, 'supports').mockReturnValue(true);
    render(
      <SelectField aria-label="Kind">
        <option>Person</option>
      </SelectField>,
    );

    const select = screen.getByRole('combobox', { name: 'Kind' });
    expect(select.firstElementChild?.tagName).toBe('BUTTON');
    expect(select.firstElementChild).toHaveAttribute('type', 'button');
    expect(select.querySelector('button > selectedcontent')).toHaveClass('text-ellipsis');
    expect(CSS.supports).toHaveBeenCalledWith('appearance', 'base-select');
  });

  it('sends the plain select from the server, so the page hydrates in any browser', () => {
    vi.spyOn(CSS, 'supports').mockReturnValue(true);

    const html = renderToString(
      <SelectField aria-label="Kind">
        <option>Person</option>
      </SelectField>,
    );

    expect(html).toContain('<option>Person</option>');
    expect(html).not.toContain('selectedcontent');
  });
});
