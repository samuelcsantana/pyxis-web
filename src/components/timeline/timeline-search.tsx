'use client';

import Form from 'next/form';
import { useState } from 'react';
import type { Lookup, RejectedLookup } from '@/domain/timeline';
import { BUTTON_PRIMARY, FIELD } from '@/components/ui/control-classes';
import { PendingSubmitButton } from '@/components/ui/pending-submit-button';

export interface TimelineSearchProps {
  readonly action: string;
  readonly lookup: Lookup | null;
  readonly hint: string | null;
  readonly keep?: Readonly<Record<string, string>>;
  readonly rejected?: RejectedLookup | null;
}

const NOTHING_KEPT: Readonly<Record<string, string>> = {};

type LookupKind = Lookup['kind'];

const FIELD_CLASS = `min-h-11 rounded-input px-3 text-base sm:text-sm ${FIELD}`;
const ERROR_ID = 'timeline-search-error';

export function TimelineSearch({
  action,
  lookup,
  hint,
  keep = NOTHING_KEPT,
  rejected = null,
}: TimelineSearchProps) {
  const [kind, setKind] = useState<LookupKind>(rejected?.kind ?? lookup?.kind ?? 'user');
  const invalid = rejected !== null && rejected.kind === kind;
  return (
    <Form
      role="search"
      action={action}
      className="flex flex-wrap items-end gap-3"
      aria-describedby={hint === null ? undefined : 'timeline-search-hint'}
    >
      {Object.entries(keep).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
      <label className="flex max-w-full min-w-0 flex-col gap-1.5 text-caption font-medium">
        Look up
        <select
          value={kind}
          onChange={(event) => {
            setKind(event.target.value === 'visit' ? 'visit' : 'user');
          }}
          className={FIELD_CLASS}
        >
          <option value="user">A person, by user id</option>
          <option value="visit">One visit, by visit id</option>
        </select>
      </label>
      <label className="flex min-w-0 grow basis-32 flex-col gap-1.5 text-caption font-medium sm:max-w-md sm:basis-64">
        {kind === 'user' ? 'User id' : 'Visit id'}
        <input
          name={kind}
          defaultValue={rejected?.value ?? lookup?.id ?? ''}
          required
          autoComplete="off"
          spellCheck={false}
          aria-invalid={invalid}
          aria-describedby={invalid ? ERROR_ID : undefined}
          className={`${FIELD_CLASS} font-mono`}
        />
      </label>
      <PendingSubmitButton
        label="Show timeline"
        pendingLabel="Looking up…"
        className={`min-h-11 rounded-input px-4.5 text-sm ${BUTTON_PRIMARY}`}
      />
      {invalid ? (
        <p id={ERROR_ID} className="basis-full text-caption font-medium text-bad">
          Nothing was looked up. {rejected.hint}
        </p>
      ) : null}
      {hint === null ? null : (
        <span id="timeline-search-hint" className="pb-3 text-xs text-muted">
          {hint}
        </span>
      )}
    </Form>
  );
}
