'use client';

import { type Ref, type SyntheticEvent, useState } from 'react';

export interface CodeFieldProps {
  readonly id: string;
  readonly length: number;
  readonly value: string;
  readonly invalid: boolean;
  readonly describedBy?: string;
  readonly inputRef?: Ref<HTMLInputElement>;
  readonly onChange: (value: string) => void;
}

interface Selection {
  readonly focused: boolean;
  readonly whole: boolean;
}

const RESTING: Selection = { focused: false, whole: false };

const INPUT =
  'absolute inset-0 z-[1] size-full cursor-text text-base text-transparent caret-transparent opacity-0';
const CELL =
  'relative flex h-13.5 items-center justify-center rounded-input border bg-card font-mono text-title font-semibold text-ink transition-colors duration-150 motion-reduce:transition-none';
const CELL_ACTIVE = 'outline-2 -outline-offset-1 outline-focus';
const CELL_SELECTED = 'bg-soft';
const CARET = 'h-6.5 w-0.5 rounded-full bg-ink motion-safe:animate-caret';

function selectionOf(input: HTMLInputElement): Selection {
  const end = input.value.length;
  const whole = end > 0 && input.selectionStart === 0 && input.selectionEnd === end;
  if (!whole && (input.selectionStart !== end || input.selectionEnd !== end)) {
    input.setSelectionRange(end, end);
  }
  return { focused: true, whole };
}

export function CodeField({
  id,
  length,
  value,
  invalid,
  describedBy,
  inputRef,
  onChange,
}: CodeFieldProps) {
  const [selection, setSelection] = useState<Selection>(RESTING);
  const follow = (event: SyntheticEvent<HTMLInputElement>) => {
    setSelection(selectionOf(event.currentTarget));
  };
  const active = Math.min(value.length, length - 1);
  return (
    <div className="relative">
      <input
        ref={inputRef}
        id={id}
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        required
        pattern={`[0-9]{${String(length)}}`}
        value={value}
        aria-invalid={invalid}
        aria-describedby={describedBy}
        onChange={(event) => {
          onChange(event.target.value);
        }}
        onFocus={follow}
        onSelect={follow}
        onBlur={() => {
          setSelection(RESTING);
        }}
        className={INPUT}
      />
      <div aria-hidden="true" data-testid="code-cells" className="grid grid-cols-6 gap-2">
        {Array.from({ length }, (_, index) => {
          const digit = value.charAt(index);
          const isActive = selection.focused && !selection.whole && index === active;
          const showsCaret = isActive && digit === '';
          return (
            <span
              key={index}
              data-active={isActive || undefined}
              className={`${CELL} ${invalid ? 'border-bad' : 'border-field'} ${isActive ? CELL_ACTIVE : ''} ${selection.whole && digit !== '' ? CELL_SELECTED : ''}`}
            >
              {showsCaret ? <span data-testid="code-caret" className={CARET} /> : digit}
            </span>
          );
        })}
      </div>
    </div>
  );
}
