import { fireEvent, render, screen, within } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { CodeField, type CodeFieldProps } from './code-field';

function Field(props: Partial<CodeFieldProps>) {
  const [value, setValue] = useState(props.value ?? '');
  return (
    <>
      <label htmlFor="code">6-digit code</label>
      <CodeField
        id="code"
        length={6}
        invalid={false}
        {...props}
        value={value}
        onChange={(next) => {
          setValue(next.slice(0, 6));
          props.onChange?.(next);
        }}
      />
    </>
  );
}

const cellAt = (index: number) => {
  const cell = screen.getByTestId('code-cells').children.item(index);
  if (cell === null) {
    throw new Error(`no cell ${String(index)}`);
  }
  return cell;
};
const input = () => screen.getByLabelText<HTMLInputElement>('6-digit code');

describe('CodeField', () => {
  it('draws one cell per digit and shows each digit in its cell', () => {
    render(<Field value="123" />);

    expect(screen.getByTestId('code-cells').children).toHaveLength(6);
    expect(cellAt(0)).toHaveTextContent('1');
    expect(cellAt(2)).toHaveTextContent('3');
    expect(cellAt(3)).toHaveTextContent('');
  });

  it('keeps the cells out of the accessibility tree and the real field labelled', () => {
    render(<Field />);

    expect(screen.getByTestId('code-cells')).toHaveAttribute('aria-hidden', 'true');
    expect(input()).toHaveAttribute('autocomplete', 'one-time-code');
    expect(input()).toHaveAttribute('inputmode', 'numeric');
    expect(input()).toHaveAttribute('pattern', '[0-9]{6}');
  });

  it('hands every change to its owner', () => {
    const onChange = vi.fn();
    render(<Field onChange={onChange} />);

    fireEvent.change(input(), { target: { value: '12' } });

    expect(onChange).toHaveBeenCalledWith('12');
    expect(cellAt(1)).toHaveTextContent('2');
  });

  it('marks the next empty cell, with a caret, while the field has the focus', () => {
    render(<Field value="12" />);

    fireEvent.focus(input());

    expect(cellAt(2)).toHaveAttribute('data-active', 'true');
    expect(within(cellAt(2) as HTMLElement).getByTestId('code-caret')).toBeInTheDocument();
    expect(cellAt(1)).not.toHaveAttribute('data-active');
  });

  it('marks the last cell, without a caret, once every digit is in', () => {
    render(<Field value="123456" />);

    fireEvent.focus(input());

    expect(cellAt(5)).toHaveAttribute('data-active', 'true');
    expect(screen.queryByTestId('code-caret')).not.toBeInTheDocument();
  });

  it('marks nothing once the focus leaves', () => {
    render(<Field value="12" />);
    fireEvent.focus(input());

    fireEvent.blur(input());

    expect(screen.getByTestId('code-cells').querySelector('[data-active]')).toBeNull();
  });

  it('shades the filled cells when the whole code is selected, and marks no cell', () => {
    render(<Field value="1234" />);
    const field = input();
    field.focus();

    field.setSelectionRange(0, 4);
    fireEvent.select(field);

    expect(cellAt(0).className).toContain('bg-soft');
    expect(cellAt(3).className).toContain('bg-soft');
    expect(cellAt(4).className).not.toContain('bg-soft');
    expect(screen.getByTestId('code-cells').querySelector('[data-active]')).toBeNull();
  });

  it('moves a caret placed inside the code back to its end', () => {
    render(<Field value="1234" />);
    const field = input();
    field.focus();

    field.setSelectionRange(1, 2);
    fireEvent.select(field);

    expect([field.selectionStart, field.selectionEnd]).toEqual([4, 4]);
  });

  it('treats an empty field as having nothing selected', () => {
    render(<Field />);
    const field = input();

    fireEvent.focus(field);

    expect(cellAt(0)).toHaveAttribute('data-active', 'true');
    expect(cellAt(0).className).not.toContain('bg-soft');
  });

  it('draws every cell with the error border when the code is refused', () => {
    render(<Field value="123456" invalid describedBy="error" />);

    expect(cellAt(0).className).toContain('border-bad');
    expect(cellAt(5).className).toContain('border-bad');
    expect(input()).toHaveAttribute('aria-invalid', 'true');
    expect(input()).toHaveAttribute('aria-describedby', 'error');
  });

  it('draws the cells with the field border otherwise', () => {
    render(<Field value="1" />);

    expect(cellAt(0).className).toContain('border-field');
    expect(input()).toHaveAttribute('aria-invalid', 'false');
  });
});
