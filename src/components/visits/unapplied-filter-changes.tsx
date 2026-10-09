'use client';

import { useCallback, useRef, useState } from 'react';
import {
  changedVisitFilterFields,
  VISIT_FILTER_FIELDS,
  type VisitFilterField,
} from '@/domain/applied-visit-filters';
import { TEXT_LINK } from '@/components/ui/control-classes';

export interface UnappliedFilterChangesProps {
  readonly applied: Readonly<Partial<Record<string, string>>>;
  readonly notice: string;
  readonly undo: string;
}

const CHANGED = 'data-changed';

function enteredValue(form: HTMLFormElement, field: VisitFilterField): string {
  const control = form.elements.namedItem(field);
  if (control instanceof HTMLInputElement && control.type === 'checkbox') {
    return control.checked ? control.value : '';
  }
  return control instanceof HTMLInputElement || control instanceof HTMLSelectElement
    ? control.value
    : '';
}

function markChanged(form: HTMLFormElement, changed: ReadonlySet<VisitFilterField>): void {
  for (const field of VISIT_FILTER_FIELDS) {
    const control = form.elements.namedItem(field);
    if (control instanceof HTMLElement) {
      control.toggleAttribute(CHANGED, changed.has(field));
    }
  }
}

export function UnappliedFilterChanges({ applied, notice, undo }: UnappliedFilterChangesProps) {
  const [changed, setChanged] = useState(false);
  const form = useRef<HTMLFormElement | null>(null);
  const watch = useCallback(
    (status: HTMLParagraphElement | null) => {
      const owner = status?.closest('form');
      if (!owner) {
        return undefined;
      }
      form.current = owner;
      const check = () => {
        const fields = changedVisitFilterFields(
          applied,
          Object.fromEntries(
            VISIT_FILTER_FIELDS.map((field) => [field, enteredValue(owner, field)]),
          ),
        );
        markChanged(owner, new Set(fields));
        setChanged(fields.length > 0);
      };
      const checkOnceReset = () => {
        window.setTimeout(check, 0);
      };
      owner.addEventListener('input', check);
      owner.addEventListener('change', check);
      owner.addEventListener('reset', checkOnceReset);
      return () => {
        owner.removeEventListener('input', check);
        owner.removeEventListener('change', check);
        owner.removeEventListener('reset', checkOnceReset);
      };
    },
    [applied],
  );
  return (
    <p
      ref={watch}
      role="status"
      className="flex flex-wrap items-center gap-x-3 gap-y-1 text-caption"
    >
      {changed ? (
        <>
          <span className="font-medium text-warn">{notice}</span>
          <button
            type="button"
            onClick={() => {
              form.current?.reset();
            }}
            className={`min-h-6 ${TEXT_LINK}`}
          >
            {undo}
          </button>
        </>
      ) : null}
    </p>
  );
}
