import { type SparklineBox, sparklinePoints } from '@/domain/sparkline';

export interface SparklineProps {
  readonly values: readonly number[];
  readonly box: SparklineBox;
  readonly width: number | string;
  readonly strokeClass: string;
  readonly strokeWidth: number;
  readonly className?: string;
}

export function Sparkline({
  values,
  box,
  width,
  strokeClass,
  strokeWidth,
  className,
}: SparklineProps) {
  return (
    <svg
      viewBox={[0, 0, box.width, box.height].join(' ')}
      width={width}
      height={box.height}
      preserveAspectRatio="none"
      aria-hidden="true"
      className={className}
    >
      <polyline
        points={sparklinePoints(values, box)}
        fill="none"
        className={strokeClass}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
