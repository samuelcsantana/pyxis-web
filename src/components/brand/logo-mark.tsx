export interface LogoMarkProps {
  readonly size?: number;
  readonly title?: string;
}

const DEFAULT_SIZE = 40;

export function LogoMark({ size = DEFAULT_SIZE, title }: LogoMarkProps) {
  const decorative = title === undefined;
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      role={decorative ? undefined : 'img'}
      aria-hidden={decorative ? true : undefined}
      aria-label={title}
    >
      <path
        d="M7 25 L25 7"
        fill="none"
        stroke="var(--color-muted)"
        strokeWidth={1.2}
        strokeLinecap="round"
      />
      <circle cx={7} cy={25} r={2.6} fill="currentColor" />
      <circle cx={16} cy={16} r={3.6} fill="var(--color-accent)" />
      <circle cx={25} cy={7} r={2.6} fill="currentColor" />
    </svg>
  );
}
