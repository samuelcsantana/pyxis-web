import { NAV_CONTROL } from '@/components/ui/control-classes';
import { DismissableDetails } from '@/components/ui/dismissable-details';
import type { Locale } from '@/i18n/locales';
import { LanguageMenu } from './language-menu';

export interface LanguageSwitcherProps {
  readonly locale: Locale;
  readonly label: string;
  readonly summary: string;
  readonly choose: (form: FormData) => Promise<void>;
}

const GLOBE_ICON =
  'M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18 M3 12h18 M12 3c2.4 2.5 3.6 5.5 3.6 9s-1.2 6.5-3.6 9 M12 3c-2.4 2.5-3.6 5.5-3.6 9s1.2 6.5 3.6 9';

export function LanguageSwitcher({ locale, label, summary, choose }: LanguageSwitcherProps) {
  return (
    <DismissableDetails className="relative">
      <summary
        className={`flex size-9 list-none items-center justify-center rounded-input border border-nav-border text-nav-strong hover:bg-nav-hover active:bg-nav-active ${NAV_CONTROL} [&::-webkit-details-marker]:hidden`}
      >
        <span className="sr-only">{summary}</span>
        <svg width={18} height={18} viewBox="0 0 24 24" aria-hidden="true">
          <path
            d={GLOBE_ICON}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </summary>
      <div className="absolute top-full right-0 z-10 mt-1.5 w-max rounded-input border border-nav-border bg-nav-raised p-1.5 shadow-lg">
        <LanguageMenu locale={locale} label={label} choose={choose} surface="nav" layout="column" />
      </div>
    </DismissableDetails>
  );
}
