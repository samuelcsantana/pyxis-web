import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { COLOR_TOKENS, DesignTokens, RADIUS_TOKENS, TYPE_SCALE } from './design-tokens';

describe('DesignTokens', () => {
  it('shows a swatch for every color token, painted from its CSS variable', () => {
    render(<DesignTokens />);

    const colors = within(screen.getByRole('region', { name: 'Colors' })).getAllByRole('listitem');

    expect(colors).toHaveLength(COLOR_TOKENS.length);
    expect(colors[0]?.querySelector('span')?.getAttribute('style')).toContain('var(--color-bg)');
  });

  it('shows every step of the type scale and every radius', () => {
    render(<DesignTokens />);

    expect(
      within(screen.getByRole('region', { name: 'Type' })).getAllByRole('listitem'),
    ).toHaveLength(TYPE_SCALE.length);
    expect(
      within(screen.getByRole('region', { name: 'Radius' })).getAllByRole('listitem'),
    ).toHaveLength(RADIUS_TOKENS.length);
  });

  it('names each type step with its rem size and draws a sample in it', () => {
    render(<DesignTokens />);

    const type = within(screen.getByRole('region', { name: 'Type' }));
    const sample = type.getByText('text-caption').closest('li')?.lastElementChild;

    expect(
      type.getByText('0.8125rem · Tables, secondary text, segmented options'),
    ).toBeInTheDocument();
    expect(sample).toHaveTextContent('4,758 visits');
    expect(sample).toHaveClass('text-caption');
  });

  it('lists the type scale from the smallest size to the largest, in rem', () => {
    const sizes = TYPE_SCALE.map((step) => Number.parseFloat(step.size));

    expect(TYPE_SCALE.every((step) => step.size.endsWith('rem'))).toBe(true);
    expect(sizes).toEqual([...sizes].sort((left, right) => left - right));
  });
});
