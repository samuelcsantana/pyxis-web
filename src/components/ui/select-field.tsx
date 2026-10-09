import type { SelectHTMLAttributes } from 'react';

export interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  readonly frameClassName?: string;
}

const CHEVRON = 'M6 9l6 6 6-6';

export function SelectField({
  className = '',
  frameClassName = '',
  children,
  ...select
}: SelectFieldProps) {
  return (
    <span className={`relative flex min-w-0 ${frameClassName}`}>
      <select
        {...select}
        className={`select-field w-full min-w-0 cursor-pointer truncate pr-9 ${className}`}
      >
        {children}
      </select>
      <svg
        width={16}
        height={16}
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="select-chevron pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-muted transition-[rotate] duration-150 motion-reduce:transition-none"
      >
        <path
          d={CHEVRON}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
