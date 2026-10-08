import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Breakable } from './breakable';

describe('Breakable', () => {
  it('offers a line break after each separator without changing the text', () => {
    const { container } = render(
      <span>
        <Breakable text="/orders/:id" />
      </span>,
    );

    expect(container).toHaveTextContent('/orders/:id');
    expect(container.querySelectorAll('wbr')).toHaveLength(3);
  });

  it('adds no break to text without a separator', () => {
    const { container } = render(
      <span>
        <Breakable text="Organic search" />
      </span>,
    );

    expect(container).toHaveTextContent('Organic search');
    expect(container.querySelector('wbr')).toBeNull();
  });
});
