import { describe, expect, it } from 'vitest';
import { english } from '@/test-utils/english';
import { portuguese } from '@/test-utils/portuguese';
import {
  funnelSegmentDimensionOf,
  type FunnelSegmentsReport,
  segmentLabel,
  segmentRows,
} from './funnel-segments';
import { funnelSegmentsResponseSchema } from './funnel-segments.schema';

const BY_DEVICE: FunnelSegmentsReport = funnelSegmentsResponseSchema.parse({
  by: 'device',
  segments: [
    { segment: 'mobile', steps: [40, 20, 10] },
    { segment: 'desktop', steps: [20, 15, 5] },
  ],
});

describe('funnel segments', () => {
  it('reads device unless the address asks for channel', () => {
    expect(funnelSegmentDimensionOf(undefined)).toBe('device');
    expect(funnelSegmentDimensionOf('channel')).toBe('channel');
    expect(funnelSegmentDimensionOf('country')).toBe('device');
  });

  it('names devices, channels and unknown segments in the reader language', () => {
    expect(segmentLabel('device', 'mobile', english)).toBe('Mobile');
    expect(segmentLabel('channel', 'organic', english)).toBe('Organic search');
    expect(segmentLabel('channel', 'organic', portuguese)).toBe('Busca orgânica');
    expect(segmentLabel('channel', 'unknown', english)).toBe('Unknown');
    expect(segmentLabel('channel', 'carrier-pigeon', english)).toBe('carrier-pigeon');
  });

  it('scales every step of every segment against the largest first step', () => {
    const [mobile, desktop] = segmentRows(BY_DEVICE, english);

    expect(mobile).toMatchObject({ key: 'mobile', label: 'Mobile', conversion: 0.25 });
    expect(mobile?.cells.map((cell) => cell.barWidth)).toEqual(['100%', '50%', '25%']);
    expect(desktop?.cells.map((cell) => cell.count)).toEqual([20, 15, 5]);
    expect(desktop?.cells[0]?.barWidth).toBe('50%');
  });

  it('keeps empty segments at zero instead of dividing by zero', () => {
    const rows = segmentRows(
      {
        by: 'device',
        segments: [
          { segment: 'tablet', steps: [0, 0] },
          { segment: 'tv', steps: [] },
        ],
      },
      english,
    );

    expect(rows.map((row) => row.conversion)).toEqual([0, 0]);
    expect(rows[0]?.cells.map((cell) => cell.barWidth)).toEqual(['0%', '0%']);
  });
});
