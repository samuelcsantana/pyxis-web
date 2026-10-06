import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import NotFound from './not-found';

describe('NotFound', () => {
  it('points a lost visitor back to their projects', () => {
    render(<NotFound />);

    expect(screen.getByRole('link', { name: 'Go to your projects' })).toHaveAttribute('href', '/');
  });
});
