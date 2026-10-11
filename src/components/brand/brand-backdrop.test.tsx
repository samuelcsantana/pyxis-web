import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { BrandBackdrop } from './brand-backdrop';

describe('BrandBackdrop', () => {
  it('stays out of the accessibility tree, drawn by the brand-backdrop styles', () => {
    render(<BrandBackdrop />);

    const backdrop = screen.getByTestId('brand-backdrop');
    expect(backdrop).toHaveAttribute('aria-hidden', 'true');
    expect(backdrop).toHaveClass('brand-backdrop');
  });

  it('holds the faint brand mark', () => {
    render(<BrandBackdrop />);

    expect(screen.getByTestId('brand-backdrop-mark')).toHaveClass('brand-backdrop-mark');
  });
});
