'use client';

import { useState } from 'react';
import { FIELD } from '@/components/ui/control-classes';
import { useT } from '@/i18n/messages-provider';

export interface CustomRangeFieldsProps {
  readonly from: string;
  readonly to: string;
  readonly today: string;
  readonly problemId?: string;
}

const LABEL_CLASS = 'flex flex-col gap-1 text-xs font-medium text-muted';
const DATE_INPUT_CLASS = `min-h-11 rounded-control px-2 text-base sm:min-h-9 sm:text-caption ${FIELD}`;

export function CustomRangeFields({ from, to, today, problemId }: CustomRangeFieldsProps) {
  const t = useT();
  const [start, setStart] = useState(from);
  const rejected = problemId !== undefined;
  return (
    <>
      <label className={LABEL_CLASS}>
        {t('periodSelector.from')}
        <input
          type="date"
          name="from"
          required
          max={today}
          defaultValue={from}
          onChange={(event) => {
            setStart(event.currentTarget.value);
          }}
          aria-invalid={rejected ? true : undefined}
          aria-describedby={problemId}
          className={DATE_INPUT_CLASS}
        />
      </label>
      <label className={LABEL_CLASS}>
        {t('periodSelector.to')}
        <input
          type="date"
          name="to"
          required
          min={start === '' ? undefined : start}
          max={today}
          defaultValue={to}
          aria-invalid={rejected ? true : undefined}
          aria-describedby={problemId}
          className={DATE_INPUT_CLASS}
        />
      </label>
    </>
  );
}
