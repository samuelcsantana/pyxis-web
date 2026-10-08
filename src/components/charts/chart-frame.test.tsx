import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { valueAxis } from '@/domain/chart-scale';
import { ChartFrame } from './chart-frame';

const WEEK = [
  '2026-09-29',
  '2026-09-30',
  '2026-10-01',
  '2026-10-02',
  '2026-10-03',
  '2026-10-04',
  '2026-10-05',
] as const;

function renderFrame(dates: readonly string[] = WEEK, axis = valueAxis([191])) {
  return render(
    <ChartFrame
      summary="Line chart of 7 days."
      heightClassName="h-60"
      axis={axis}
      dates={dates}
      layout="points"
    >
      <path d="M0,0L1000,1000" stroke="var(--color-sky)" />
    </ChartFrame>,
  );
}

describe('ChartFrame', () => {
  it('names the drawing with its summary and keeps the shapes away from assistive technology', () => {
    renderFrame();

    const figure = screen.getByRole('img', { name: 'Line chart of 7 days.' });
    const svg = figure.querySelector('svg');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg).toHaveAttribute('viewBox', '0 0 1000 1000');
    expect(svg).toHaveAttribute('preserveAspectRatio', 'none');
    expect(svg?.querySelector('path[stroke="var(--color-sky)"]')).toHaveAttribute(
      'd',
      'M0,0L1000,1000',
    );
  });

  it('draws a grid line and a label at each value tick, the top tick at the top', () => {
    renderFrame();

    const figure = screen.getByRole('img');
    expect(figure.querySelector('path[stroke="var(--color-grid)"]')).toHaveAttribute(
      'd',
      'M0,1000H1000M0,750H1000M0,500H1000M0,250H1000M0,0H1000',
    );
    expect(within(figure).getByText('200')).toHaveStyle({ top: '0%' });
    expect(within(figure).getByText('50')).toHaveStyle({ top: '75%' });
    expect(within(figure).getByText('0')).toHaveStyle({ top: '100%' });
  });

  it('labels fewer days on a narrow plot than on a wide one, the edges kept inside', () => {
    renderFrame();

    const rows = [...screen.getByRole('img').querySelectorAll<HTMLElement>('div.absolute')].map(
      (row) => ({
        className: row.className,
        labels: [...row.querySelectorAll<HTMLElement>('span')].map((label) => ({
          text: label.textContent,
          anchor: label.className.split(' ').at(-1),
          left: label.style.left,
        })),
      }),
    );
    expect(rows).toHaveLength(2);
    expect(rows[0]).toEqual({
      className: 'absolute inset-0 @md:hidden',
      labels: [
        { text: 'Sep 29', anchor: 'translate-x-0', left: '0%' },
        { text: 'Oct 2', anchor: '-translate-x-1/2', left: '50%' },
        { text: 'Oct 5', anchor: '-translate-x-full', left: '100%' },
      ],
    });
    expect(rows[1]?.className).toBe('absolute inset-0 hidden @md:block');
    expect(rows[1]?.labels.map((label) => label.text)).toEqual([
      'Sep 29',
      'Sep 30',
      'Oct 1',
      'Oct 2',
      'Oct 3',
      'Oct 4',
      'Oct 5',
    ]);
  });

  it('draws the axes without day labels when there are no days', () => {
    renderFrame([], valueAxis([]));

    const figure = screen.getByRole('img');
    expect(figure.querySelectorAll('div.absolute > span')).toHaveLength(0);
    expect(within(figure).getByText('1')).toHaveStyle({ top: '0%' });
    expect(within(figure).getByText('0')).toHaveStyle({ top: '100%' });
  });
});
