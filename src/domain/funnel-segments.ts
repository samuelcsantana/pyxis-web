import type { I18n } from '@/i18n/i18n';
import { type Channel, CHANNELS, channelLabel } from './acquisition';
import { deviceTypeLabel } from './devices';

export const FUNNEL_SEGMENT_DIMENSIONS = ['device', 'channel'] as const;
export type FunnelSegmentDimension = (typeof FUNNEL_SEGMENT_DIMENSIONS)[number];
export const SEGMENT_PARAMETER = 'by';
const UNKNOWN_SEGMENT = 'unknown';
const PERCENT = 100;

export interface FunnelSegment {
  readonly segment: string;
  readonly steps: readonly number[];
}

export interface FunnelSegmentsReport {
  readonly by: FunnelSegmentDimension;
  readonly segments: readonly FunnelSegment[];
}

export interface SegmentCell {
  readonly count: number;
  readonly barWidth: string;
}

export interface SegmentRow {
  readonly key: string;
  readonly label: string;
  readonly cells: readonly SegmentCell[];
  readonly conversion: number;
}

export function funnelSegmentDimensionOf(value: string | undefined): FunnelSegmentDimension {
  return value === 'channel' ? 'channel' : 'device';
}

function isChannel(value: string): value is Channel {
  return (CHANNELS as readonly string[]).includes(value);
}

export function segmentLabel(by: FunnelSegmentDimension, segment: string, i18n: I18n): string {
  if (segment === UNKNOWN_SEGMENT) {
    return i18n.t('funnelSegments.unknown');
  }
  if (by === 'device') {
    return deviceTypeLabel(segment, i18n);
  }
  return isChannel(segment) ? channelLabel(segment, i18n) : segment;
}

export function segmentRows(report: FunnelSegmentsReport, i18n: I18n): readonly SegmentRow[] {
  const largest = Math.max(0, ...report.segments.map((segment) => segment.steps[0] ?? 0));
  return report.segments.map((segment) => {
    const first = segment.steps[0] ?? 0;
    const last = segment.steps.at(-1) ?? 0;
    return {
      key: segment.segment,
      label: segmentLabel(report.by, segment.segment, i18n),
      cells: segment.steps.map((count) => ({
        count,
        barWidth: `${String(largest === 0 ? 0 : (count / largest) * PERCENT)}%`,
      })),
      conversion: first === 0 ? 0 : last / first,
    };
  });
}
