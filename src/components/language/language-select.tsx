import type { ReactNode } from 'react';
import { CONTROL_TRANSITION, FOCUS_RING } from '@/components/ui/control-classes';
import { DismissableDetails } from '@/components/ui/dismissable-details';
import { type Locale, localeName } from '@/i18n/locales';
import { LocaleFlag } from './locale-flag';

export interface LanguageSelectProps {
  readonly locale: Locale;
  readonly label: string;
  readonly children: ReactNode;
}

const CHEVRON = 'M6 9l6 6 6-6';
const CHECK = 'M5 12.5l4.5 4.5L19 7.5';

export const LANGUAGE_OPTION = `flex min-h-10 w-full items-center gap-2.5 rounded-control px-2.5 text-left text-sm text-ink hover:bg-soft active:bg-line aria-[current=page]:font-semibold aria-pressed:font-semibold ${FOCUS_RING} ${CONTROL_TRANSITION}`;

export interface LanguageOptionLabelProps {
  readonly locale: Locale;
  readonly current: boolean;
}

export function LanguageOptionLabel({ locale, current }: LanguageOptionLabelProps) {
  return (
    <>
      <LocaleFlag locale={locale} />
      <span className="grow">{localeName(locale)}</span>
      <svg
        width={16}
        height={16}
        viewBox="0 0 24 24"
        aria-hidden="true"
        className={`shrink-0 text-accent ${current ? '' : 'invisible'}`}
      >
        <path
          d={CHECK}
          fill="none"
          stroke="currentColor"
          strokeWidth={2.2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </>
  );
}

export function LanguageSelect({ locale, label, children }: LanguageSelectProps) {
  return (
    <DismissableDetails className="group/language relative">
      <summary
        className={`flex h-11 cursor-pointer list-none items-center gap-2 rounded-input border border-line bg-card px-3 text-sm text-ink hover:border-muted hover:bg-soft active:bg-line ${FOCUS_RING} ${CONTROL_TRANSITION} [&::-webkit-details-marker]:hidden`}
      >
        <LocaleFlag locale={locale} />
        <span className="sr-only">{`${label}: `}</span>
        <span lang={locale} className="sr-only font-medium sm:not-sr-only">
          {localeName(locale)}
        </span>
        <svg
          width={14}
          height={14}
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="shrink-0 text-muted transition-transform duration-150 group-open/language:rotate-180 motion-reduce:transition-none"
        >
          <path
            d={CHEVRON}
            fill="none"
            stroke="currentColor"
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </summary>
      <div className="absolute top-full right-0 z-30 mt-2 w-56 rounded-input border border-line bg-card p-1.5 shadow-raised">
        <p
          aria-hidden="true"
          className="px-2.5 pt-1 pb-1.5 text-micro font-semibold tracking-[0.08em] text-muted uppercase"
        >
          {label}
        </p>
        <ul aria-label={label} className="flex flex-col gap-0.5">
          {children}
        </ul>
      </div>
    </DismissableDetails>
  );
}
