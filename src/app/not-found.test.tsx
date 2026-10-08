import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import NotFound, { generateMetadata } from './not-found';

describe('NotFound', () => {
  it('says the page was not found in its one heading and points back to the projects', async () => {
    render(await NotFound());

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Page not found');
    expect(screen.getByRole('main')).toHaveTextContent(/^Pyxis/);
    expect(
      screen.getByText('This page does not exist, or the project is not one you may read.'),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Go to your projects' })).toHaveAttribute('href', '/');
  });

  it('names itself in the title', async () => {
    expect((await generateMetadata()).title).toBe('Page not found');
  });
});
