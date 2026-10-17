'use client';

import { useChoiceAhead } from '@/components/ui/use-choice-ahead';
import { type Locale, LOCALES } from '@/i18n/locales';
import { closeLanguageSelect } from './close-language-select';
import { LANGUAGE_OPTION, LanguageOptionLabel, LanguageSelect } from './language-select';
import { useRevealWhenTheLanguageArrives } from './use-reveal-when-the-language-arrives';

export interface LanguageFormSelectProps {
  readonly locale: Locale;
  readonly label: string;
  readonly choose: (form: FormData) => Promise<void>;
}

export function LanguageFormSelect({ locale, label, choose }: LanguageFormSelectProps) {
  const [shown, chooseAhead] = useChoiceAhead(locale);
  useRevealWhenTheLanguageArrives(locale);
  return (
    <form action={choose}>
      <LanguageSelect locale={shown} label={label}>
        {LOCALES.map((each) => (
          <li key={each}>
            <button
              type="submit"
              name="locale"
              value={each}
              lang={each}
              aria-pressed={each === shown}
              onClick={(event) => {
                chooseAhead(each);
                closeLanguageSelect(event.currentTarget);
              }}
              className={LANGUAGE_OPTION}
            >
              <LanguageOptionLabel locale={each} current={each === shown} />
            </button>
          </li>
        ))}
      </LanguageSelect>
    </form>
  );
}
