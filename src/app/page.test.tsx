import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import HomePage from './page';

describe('HomePage', () => {
  it('states what Pyxis is', () => {
    render(<HomePage />);

    expect(
      screen.getByRole('heading', { level: 1, name: 'Privacy-first product analytics' }),
    ).toBeInTheDocument();
  });

  it('links to the three repositories', () => {
    render(<HomePage />);

    const navigation = screen.getByRole('navigation', { name: 'Project repositories' });
    const links = within(navigation).getAllByRole('link');

    expect(links.map((link) => link.getAttribute('href'))).toEqual([
      'https://github.com/samuelcsantana/pyxis-api',
      'https://github.com/samuelcsantana/pyxis-sdk',
      'https://github.com/samuelcsantana/pyxis-web',
    ]);
  });
});
