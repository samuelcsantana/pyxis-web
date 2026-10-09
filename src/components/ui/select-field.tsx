'use client';

import { createElement, type SelectHTMLAttributes } from 'react';
import { useCustomizableSelect } from '@/lib/use-customizable-select';

export interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  readonly frameClassName?: string;
}

const CHEVRON = 'M6 9l6 6 6-6';
const CHOSEN_OPTION = 'flex min-w-0 flex-1 items-center self-stretch text-left';
const SELECTED_TEXT = 'min-w-0 overflow-hidden text-ellipsis whitespace-nowrap';

export function SelectField({
  className = '',
  frameClassName = '',
  children,
  ...select
}: SelectFieldProps) {
  const customizable = useCustomizableSelect();
  return (
    <span className={`relative flex min-w-0 ${frameClassName}`}>
      <select
        {...select}
        className={`select-field w-full min-w-0 cursor-pointer truncate pr-9 ${className}`}
      >
        {customizable ? (
          <button type="button" className={CHOSEN_OPTION}>
            {createElement('selectedcontent', { className: SELECTED_TEXT })}
          </button>
        ) : null}
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
