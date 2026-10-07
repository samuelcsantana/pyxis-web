import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { BUTTON_RECIPES, ControlRecipes } from './control-recipes';

describe('ControlRecipes', () => {
  it('shows every button recipe enabled, unavailable and busy, and the icon button', () => {
    render(<ControlRecipes />);

    const buttons = within(screen.getByRole('region', { name: 'Buttons' }));

    for (const { name } of BUTTON_RECIPES) {
      expect(buttons.getByRole('button', { name })).toBeEnabled();
      expect(buttons.getByRole('button', { name: `${name}, unavailable` })).toBeDisabled();
      expect(buttons.getByRole('button', { name: `${name}, busy…` })).toHaveAttribute(
        'aria-busy',
        'true',
      );
    }
    expect(buttons.getByRole('button', { name: 'Icon' })).toBeEnabled();
  });

  it('shows a selected and an idle segmented option, tab and pill', () => {
    render(<ControlRecipes />);

    for (const group of ['Segmented', 'Tabs', 'Pills']) {
      const options = within(screen.getByRole('group', { name: group })).getAllByRole('button');

      expect(options.map((option) => option.getAttribute('aria-pressed'))).toEqual([
        'true',
        'false',
      ]);
    }
  });
});
