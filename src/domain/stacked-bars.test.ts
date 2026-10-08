import { describe, expect, it } from 'vitest';
import { stackedBars } from './stacked-bars';

type Channel = 'paid' | 'organic' | 'direct';

const CHANNELS: readonly Channel[] = ['paid', 'organic', 'direct'];

describe('stackedBars', () => {
  it('stacks the channels of a day from the bottom, in the order given', () => {
    const { segments } = stackedBars([{ paid: 10, organic: 20, direct: 10 }], CHANNELS, 50);

    expect(segments).toEqual([
      { day: 0, key: 'paid', x: 100, y: 800, width: 800, height: 200 },
      { day: 0, key: 'organic', x: 100, y: 400, width: 800, height: 400 },
      { day: 0, key: 'direct', x: 100, y: 200, width: 800, height: 200 },
    ]);
  });

  it('draws a separator between each pair of stacked segments, none below or above', () => {
    const { separators } = stackedBars([{ paid: 10, organic: 20, direct: 10 }], CHANNELS, 50);

    expect(separators).toBe('M100,800H900M100,400H900');
  });

  it('leaves out a channel with no visits that day, and its separator', () => {
    const { segments, separators } = stackedBars(
      [{ paid: 25, organic: 0, direct: 25 }],
      CHANNELS,
      50,
    );

    expect(segments.map((segment) => segment.key)).toEqual(['paid', 'direct']);
    expect(separators).toBe('M100,500H900');
  });

  it('gives each day its own bar, side by side', () => {
    const { segments, separators } = stackedBars(
      [
        { paid: 4, organic: 0, direct: 0 },
        { paid: 2, organic: 2, direct: 0 },
      ],
      CHANNELS,
      4,
    );

    expect(segments).toEqual([
      { day: 0, key: 'paid', x: 50, y: 0, width: 400, height: 1000 },
      { day: 1, key: 'paid', x: 550, y: 500, width: 400, height: 500 },
      { day: 1, key: 'organic', x: 550, y: 0, width: 400, height: 500 },
    ]);
    expect(separators).toBe('M550,500H950');
  });

  it('shares each boundary between the segments it separates, so rounding leaves no gap', () => {
    const { segments } = stackedBars([{ paid: 1, organic: 1, direct: 1 }], CHANNELS, 3);

    expect(segments.map((segment) => [segment.y, segment.height])).toEqual([
      [666.7, 333.3],
      [333.3, 333.4],
      [0, 333.3],
    ]);
  });

  it('draws nothing for a day without visits, or without days', () => {
    expect(stackedBars([{ paid: 0, organic: 0, direct: 0 }], CHANNELS, 1)).toEqual({
      segments: [],
      separators: '',
    });
    expect(stackedBars([], CHANNELS, 1)).toEqual({ segments: [], separators: '' });
  });
});
