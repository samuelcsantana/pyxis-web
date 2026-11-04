const DEFAULT_SIZE_PX = 18;
const DEFAULT_STROKE = 1.8;

export interface StrokeIconProps {
  readonly path: string;
  readonly size?: number;
  readonly strokeWidth?: number;
  readonly className?: string;
}

export function StrokeIcon({
  path,
  size = DEFAULT_SIZE_PX,
  strokeWidth = DEFAULT_STROKE,
  className = '',
}: StrokeIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
    >
      <path
        d={path}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
