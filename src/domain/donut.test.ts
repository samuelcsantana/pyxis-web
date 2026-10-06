import { describe, expect, it } from 'vitest';
import { withDonutSegments } from './donut';

describe('withDonutSegments', () => {
  it('draws each share as an arc that starts where the previous one ended', () => {
    expect(
      withDonutSegments(
        [
          { id: 'mobile', fraction: 0.75 },
          { id: 'desktop', fraction: 0.25 },
        ],
        100,
      ),
    ).toEqual([
      { id: 'mobile', fraction: 0.75, dashArray: '75.00 25.00', dashOffset: '0.00' },
      { id: 'desktop', fraction: 0.25, dashArray: '25.00 75.00', dashOffset: '-75.00' },
    ]);
  });

  it('draws nothing without shares', () => {
    expect(withDonutSegments([], 100)).toEqual([]);
  });
});
