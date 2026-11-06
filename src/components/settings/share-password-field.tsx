'use client';

import type { Ref } from 'react';
import { FIELD } from '@/components/ui/control-classes';
import {
  MAX_SHARE_PASSWORD_LENGTH,
  MIN_SHARE_PASSWORD_LENGTH,
  type SharePasswordProblem,
} from '@/domain/share-links';
import { useT } from '@/i18n/messages-provider';

export interface SharePasswordFieldProps {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly problem: SharePasswordProblem | null;
  readonly onChange: (value: string) => void;
  readonly fieldRef?: Ref<HTMLInputElement>;
}

const INPUT = `min-h-11 w-full rounded-input px-3 text-base placeholder:text-muted sm:text-sm ${FIELD}`;

export function SharePasswordField({
  id,
  label,
  value,
  problem,
  onChange,
  fieldRef,
}: SharePasswordFieldProps) {
  const t = useT();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <label htmlFor={id} className="text-caption font-medium">
        {label}
      </label>
      <input
        ref={fieldRef}
        id={id}
        type="password"
        autoComplete="new-password"
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
        }}
        aria-invalid={problem !== null}
        aria-describedby={problem === null ? hintId : `${errorId} ${hintId}`}
        className={INPUT}
      />
      <p id={hintId} className="text-xs leading-[18px] text-muted">
        {t('shareLinks.passwordHint', {
          min: String(MIN_SHARE_PASSWORD_LENGTH),
          max: String(MAX_SHARE_PASSWORD_LENGTH),
        })}
      </p>
      {problem === null ? null : (
        <p id={errorId} role="alert" className="text-caption font-medium text-bad">
          {problem === 'tooShort'
            ? t('shareLinks.passwordTooShort', { min: String(MIN_SHARE_PASSWORD_LENGTH) })
            : t('shareLinks.passwordTooLong', { max: String(MAX_SHARE_PASSWORD_LENGTH) })}
        </p>
      )}
    </div>
  );
}
