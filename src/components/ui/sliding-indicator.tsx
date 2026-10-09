import type { CSSProperties } from 'react';
import type { IndicatorFrame } from './use-sliding-indicator';

export type IndicatorShape = 'fill' | 'underline';

export interface SlidingIndicatorProps {
  readonly frame: IndicatorFrame | null;
  readonly shape: IndicatorShape;
  readonly className: string;
}

const PLACEMENTS: Readonly<Record<IndicatorShape, (frame: IndicatorFrame) => CSSProperties>> = {
  fill: ({ left, top, width, height }) => ({
    width: `${String(width)}px`,
    height: `${String(height)}px`,
    translate: `${String(left)}px ${String(top)}px`,
  }),
  underline: ({ left, top, width, height }) => ({
    width: `${String(width)}px`,
    translate: `${String(left)}px calc(${String(top + height)}px - 100%)`,
  }),
};

export function SlidingIndicator({ frame, shape, className }: SlidingIndicatorProps) {
  if (frame === null) {
    return null;
  }
  return (
    <span
      aria-hidden="true"
      data-testid="sliding-indicator"
      className={className}
      style={PLACEMENTS[shape](frame)}
    />
  );
}
