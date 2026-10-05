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
});
