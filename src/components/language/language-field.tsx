'use client';

import { type FocusEvent, type KeyboardEvent, useId, useRef } from 'react';
import { FIELD } from '@/components/ui/control-classes';
import { SelectField } from '@/components/ui/select-field';
import { useChoiceAhead } from '@/components/ui/use-choice-ahead';
import { LOCALES, type Locale, localeName, parseLocale } from '@/i18n/locales';
import { useRevealWhenTheLanguageArrives } from './use-reveal-when-the-language-arrives';

export interface LanguageFieldProps {
  readonly locale: Locale;
  readonly label: string;
  readonly choose: (form: FormData) => Promise<void>;
}

const LABEL = 'text-caption font-medium';
const SELECT = `min-h-11 w-full rounded-input px-3 text-base sm:text-sm ${FIELD}`;
const ENTER = 'Enter';
const KEYS_THAT_KEEP_THE_VALUE: ReadonlySet<string> = new Set([
  'Tab',
  'Escape',
  'Shift',
  'Control',
  'Alt',
  'Meta',
]);

export function LanguageField({ locale, label, choose }: LanguageFieldProps) {
  const fieldId = useId();
  const [shown, chooseAhead] = useChoiceAhead(locale);
  const browsingByKeyboard = useRef(false);
  const sent = useRef<string>(locale);
  useRevealWhenTheLanguageArrives(locale);

  const commit = (select: HTMLSelectElement) => {
    if (select.value === sent.current) {
      return;
    }
    sent.current = select.value;
    select.form?.requestSubmit();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLSelectElement>) => {
    if (event.target !== event.currentTarget) {
      return;
    }
    if (event.key === ENTER) {
      event.preventDefault();
      commit(event.currentTarget);
      return;
    }
    browsingByKeyboard.current = !KEYS_THAT_KEEP_THE_VALUE.has(event.key);
  };

  const onBlur = (event: FocusEvent<HTMLSelectElement>) => {
    browsingByKeyboard.current = false;
    if (event.relatedTarget instanceof Node && event.currentTarget.contains(event.relatedTarget)) {
      return;
    }
    commit(event.currentTarget);
  };

  return (
    <form action={choose} className="flex min-w-0 flex-col gap-1.5">
      <label htmlFor={fieldId} className={LABEL}>
        {label}
      </label>
      <SelectField
        id={fieldId}
        name="locale"
        value={shown}
        frameClassName="w-full sm:max-w-64"
        className={SELECT}
        onKeyDown={onKeyDown}
        onKeyUp={() => {
          browsingByKeyboard.current = false;
        }}
        onPointerDown={() => {
          browsingByKeyboard.current = false;
        }}
        onBlur={onBlur}
        onChange={(event) => {
          const chosen = parseLocale(event.currentTarget.value);
          if (chosen === undefined) {
            return;
          }
          chooseAhead(chosen);
          if (!browsingByKeyboard.current) {
            commit(event.currentTarget);
          }
        }}
      >
        {LOCALES.map((each) => (
          <option key={each} value={each} lang={each}>
            {localeName(each)}
          </option>
        ))}
      </SelectField>
    </form>
  );
}
