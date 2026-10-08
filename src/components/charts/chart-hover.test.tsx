import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ChartHover, type HoverDay } from './chart-hover';

const PLOT_WIDTH = 200;

const DAYS: readonly HoverDay[] = [
  { label: 'Oct 3', rows: [{ label: 'Visits', value: '90', marker: 'bg-sky' }] },
  {
    label: 'Oct 4',
    rows: [
      { label: 'Visits', value: '120', marker: 'bg-sky' },
      { label: 'Visits, Sep 26', value: '110', marker: 'border-sky' },
    ],
  },
  { label: 'Oct 5', rows: [{ label: 'Visits', value: '80', marker: 'bg-sky' }] },
];

function renderHover(days: readonly HoverDay[] = DAYS) {
  const view = render(<ChartHover days={days} layout="points" />);
  const layer = view.container.querySelector<HTMLElement>('[data-layer="hover"]');
  if (layer === null) {
    throw new Error('The hover layer was not drawn');
  }
  vi.spyOn(layer, 'getBoundingClientRect').mockReturnValue({
    left: 10,
    width: PLOT_WIDTH,
  } as DOMRect);
  return { ...view, layer };
}

describe('ChartHover', () => {
  it('stays empty, and hidden from assistive technology, until a pointer is over the plot', () => {
    const { layer } = renderHover();

    expect(layer).toHaveAttribute('aria-hidden', 'true');
    expect(layer).toBeEmptyDOMElement();
  });

  it('shows the values of the day nearest to the pointer, with a line at that day', () => {
    const { layer } = renderHover();

    fireEvent.pointerMove(layer, { clientX: 10 + PLOT_WIDTH * 0.45 });

    expect(layer).toHaveTextContent('Oct 4Visits120Visits, Sep 26110');
    const [line, tooltip] = [...layer.children] as HTMLElement[];
    expect(line?.style.left).toBe('50%');
    expect(tooltip?.style.left).toBe('50%');
    expect(layer.querySelector('.border-sky')).not.toBeNull();
  });

  it('opens the tooltip towards the inside on the right half of the plot', () => {
    const { layer } = renderHover();

    fireEvent.pointerMove(layer, { clientX: 10 + PLOT_WIDTH });

    expect(layer).toHaveTextContent('Oct 5Visits80');
    const tooltip = layer.children[1] as HTMLElement;
    expect(tooltip.style.right).toBe('0%');
    expect(tooltip).toHaveClass('-translate-x-2');
  });

  it('follows a touch too, and hides when the pointer leaves', () => {
    const { layer } = renderHover();

    fireEvent.pointerDown(layer, { clientX: 10 });
    expect(layer).toHaveTextContent('Oct 3Visits90');

    fireEvent.pointerLeave(layer);
    expect(layer).toBeEmptyDOMElement();
  });

  it('shows nothing when the day under the pointer is gone after a new render', () => {
    const { layer, rerender } = renderHover();
    fireEvent.pointerMove(layer, { clientX: 10 + PLOT_WIDTH });

    rerender(<ChartHover days={DAYS.slice(0, 1)} layout="points" />);

    expect(layer).toBeEmptyDOMElement();
  });
});
