import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import NotFound, { metadata } from './not-found';

describe('NotFound', () => {
  it('says the page was not found in its one heading and points back to the projects', () => {
    render(<NotFound />);

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Page not found');
    expect(screen.getByRole('main')).toHaveTextContent(/^Pyxis/);
    expect(screen.getByRole('link', { name: 'Go to your projects' })).toHaveAttribute('href', '/');
  });

  it('names itself in the title', () => {
    expect(metadata.title).toBe('Page not found · Pyxis');
  });
});
