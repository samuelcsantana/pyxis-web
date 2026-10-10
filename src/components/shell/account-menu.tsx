import { LanguageMenu } from '@/components/language/language-menu';
import { ThemeChoiceGroup } from '@/components/theme/theme-choice';
import { NAV_CONTROL } from '@/components/ui/control-classes';
import { DismissableDetails } from '@/components/ui/dismissable-details';
import { emailInitial } from '@/domain/admin';
import type { I18n } from '@/i18n/i18n';
import type { Theme } from '@/lib/theme';
import { SignOutButton } from './sign-out-button';

export interface AccountMenuProps {
  readonly email: string;
  readonly theme?: Theme;
  readonly i18n: I18n;
  readonly chooseLocale: (form: FormData) => Promise<void>;
}

const CHEVRON = 'M6 15l6-6 6 6';
const GROUP_LABEL = 'px-1 text-micro font-semibold tracking-[0.08em] text-nav-muted uppercase';

export function AccountMenu({ email, theme, i18n, chooseLocale }: AccountMenuProps) {
  return (
    <DismissableDetails className="group relative">
      <summary
        className={`flex min-h-11 list-none items-center gap-2 rounded-input px-1 hover:bg-nav-hover active:bg-nav-active ${NAV_CONTROL} [&::-webkit-details-marker]:hidden`}
      >
        <span
          aria-hidden="true"
          className="flex size-8 shrink-0 items-center justify-center rounded-pill bg-nav-border text-caption font-semibold text-nav-strong"
        >
          {emailInitial(email)}
        </span>
        <span className="sr-only">{i18n.t('nav.account')}</span>
        <span className="min-w-0 flex-1 text-xs wrap-anywhere text-nav-text">{email}</span>
        <svg
          width={16}
          height={16}
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="shrink-0 text-nav-muted transition-transform duration-150 group-open:rotate-180 motion-reduce:transition-none"
        >
          <path
            d={CHEVRON}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </summary>
      <div className="absolute right-0 bottom-full left-0 z-10 mb-2 flex flex-col gap-3 rounded-input border border-nav-border bg-nav-raised p-3 shadow-lg">
        <div className="flex flex-col gap-1.5">
          <span className={GROUP_LABEL}>{i18n.t('nav.language')}</span>
          <LanguageMenu
            locale={i18n.locale}
            label={i18n.t('language.label')}
            choose={chooseLocale}
            surface="nav"
            layout="column"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <span className={GROUP_LABEL}>{i18n.t('theme.label')}</span>
          <ThemeChoiceGroup initialTheme={theme} />
        </div>
        <div className="border-t border-nav-line pt-2">
          <SignOutButton />
          <SignOutButton scope="everywhere" />
        </div>
      </div>
    </DismissableDetails>
  );
}
