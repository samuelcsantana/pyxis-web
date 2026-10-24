import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ContentPlaceholder } from './content-placeholder';

describe('ContentPlaceholder', () => {
  it('says the screen is loading, marks itself busy and hides its skeleton from assistive technology', () => {
    const { container } = render(<ContentPlaceholder label="Loading…" />);

    const placeholder = container.firstElementChild;
    expect(placeholder).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByRole('status')).toHaveTextContent('Loading…');
    expect(screen.getByRole('status').nextElementSibling).toHaveAttribute('aria-hidden', 'true');
    expect(screen.queryByRole('main')).toBeNull();
  });

  it('hides itself whenever a main content follows it', () => {
    const { container } = render(<ContentPlaceholder label="Loading…" />);

    expect(container.firstElementChild).toHaveClass('[&:has(~main)]:hidden');
  });
});
