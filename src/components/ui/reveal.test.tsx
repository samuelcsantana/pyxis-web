import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Reveal } from './reveal';

const REVEALING = 'motion-safe:animate-reveal';

function shown() {
  return screen.getByTestId('reveal');
}

describe('Reveal', () => {
  it('shows its first content still, as the server drew it', () => {
    render(
      <Reveal show="chart" className="flex">
        <p>Chart</p>
      </Reveal>,
    );

    expect(shown()).toHaveTextContent('Chart');
    expect(shown()).toHaveClass('min-w-0', 'flex');
    expect(shown()).not.toHaveClass(REVEALING);
  });

  it('brings new content in afresh, and keeps doing so on every later switch', () => {
    const view = render(
      <Reveal show="chart">
        <p>Chart</p>
      </Reveal>,
    );
    const first = shown();

    view.rerender(
      <Reveal show="table">
        <p>Table</p>
      </Reveal>,
    );
    const second = shown();
    view.rerender(
      <Reveal show="chart">
        <p>Chart</p>
      </Reveal>,
    );

    expect(second).not.toBe(first);
    expect(second).toHaveClass(REVEALING);
    expect(shown()).toHaveClass(REVEALING);
    expect(shown()).toHaveTextContent('Chart');
  });
});
