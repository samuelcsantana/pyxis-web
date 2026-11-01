'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { type SubmitEvent, useId, useState } from 'react';
import { withAddedFilter } from '@/domain/dashboard-filter-parameters';
import { BUTTON_PRIMARY, FIELD } from '@/components/ui/control-classes';
import { SelectField } from '@/components/ui/select-field';
import { useT } from '@/i18n/messages-provider';
import type { FilterFieldText, FilterFieldTexts } from './screen-topbar-texts';

const VALUE_NAME = 'value';
const LABEL = 'text-caption font-medium';
const CONTROL = `min-h-11 w-full rounded-input px-3 text-base font-normal sm:text-sm ${FIELD}`;

export interface AddFilterFormProps {
  readonly fields: FilterFieldTexts;
}

function closeTheMenuHolding(form: HTMLFormElement) {
  const details = form.closest('details');
  if (details === null) {
    return;
  }
  details.open = false;
  details.querySelector<HTMLElement>(':scope > summary')?.focus();
}

function startingValueOf(field: FilterFieldText): string {
  return field.options === undefined ? '' : field.options[0].value;
}

export function AddFilterForm({ fields }: AddFilterFormProps) {
  const t = useT();
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();
  const fieldId = useId();
  const valueId = useId();
  const hintId = useId();
  const [chosen, setChosen] = useState<FilterFieldText>(fields[0]);
  const [value, setValue] = useState(startingValueOf(fields[0]));

  const apply = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const filter = value.trim();
    if (filter === '') {
      return;
    }
    router.push(`${pathname}?${withAddedFilter(search.toString(), chosen.field, filter)}`, {
      scroll: false,
    });
    closeTheMenuHolding(event.currentTarget);
  };

  return (
    <form onSubmit={apply} className="flex flex-col gap-1.5">
      <label htmlFor={fieldId} className={LABEL}>
        {t('nav.filterBy')}
      </label>
      <SelectField
        id={fieldId}
        value={chosen.field}
        onChange={(event) => {
          const picked = event.currentTarget.value;
          const next = fields.find((text) => text.field === picked) ?? fields[0];
          setChosen(next);
          setValue(startingValueOf(next));
        }}
        className={CONTROL}
      >
        {fields.map((text) => (
          <option key={text.field} value={text.field}>
            {text.label}
          </option>
        ))}
      </SelectField>
      <label htmlFor={valueId} className={`mt-1.5 ${LABEL}`}>
        {t('nav.filterValue')}
      </label>
      {chosen.options === undefined ? (
        <input
          id={valueId}
          name={VALUE_NAME}
          value={value}
          onChange={(event) => {
            const typed = event.currentTarget.value;
            setValue(chosen.upperCase === true ? typed.toUpperCase() : typed);
          }}
          required
          autoComplete="off"
          spellCheck={false}
          autoCapitalize={chosen.upperCase === true ? 'characters' : 'none'}
          pattern={chosen.pattern}
          maxLength={chosen.maxLength}
          placeholder={chosen.placeholder}
          aria-describedby={chosen.hint === undefined ? undefined : hintId}
          className={CONTROL}
        />
      ) : (
        <SelectField
          id={valueId}
          name={VALUE_NAME}
          value={value}
          onChange={(event) => {
            setValue(event.currentTarget.value);
          }}
          className={CONTROL}
        >
          {chosen.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </SelectField>
      )}
      {chosen.hint === undefined ? null : (
        <p id={hintId} className="text-xs text-muted">
          {chosen.hint}
        </p>
      )}
      <button
        type="submit"
        className={`mt-1.5 min-h-11 rounded-input px-4 text-sm ${BUTTON_PRIMARY}`}
      >
        {t('periodSelector.apply')}
      </button>
    </form>
  );
}
