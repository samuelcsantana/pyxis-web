import { LanguageDialogButton } from '@/components/language/language-dialog-button';
import { LocaleFlag } from '@/components/language/locale-flag';
import { BUTTON_SECONDARY } from '@/components/ui/control-classes';
import { localeName } from '@/i18n/locales';
import { PANEL, PANEL_TITLE } from '@/components/ui/panel-classes';
import type { I18n } from '@/i18n/i18n';
import type { Theme } from '@/lib/theme';
import { ThemeTiles } from './theme-tiles';

export interface GeneralSectionProps {
  readonly email: string;
  readonly theme?: Theme;
  readonly i18n: I18n;
  readonly chooseLocale: (form: FormData) => Promise<void>;
}

export function GeneralSection({ email, theme, i18n, chooseLocale }: GeneralSectionProps) {
  return (
    <div className="flex flex-col gap-3.5 sm:gap-4">
      <section aria-labelledby="settings-general-email" className={PANEL}>
        <h3 id="settings-general-email" className={PANEL_TITLE}>
          {i18n.t('settingsDialog.general.email')}
        </h3>
        <p className="text-sm wrap-anywhere">{email}</p>
        <p className="text-xs text-muted">{i18n.t('settingsDialog.general.emailNote')}</p>
      </section>
      <section aria-labelledby="settings-general-appearance" className={PANEL}>
        <h3 id="settings-general-appearance" className={PANEL_TITLE}>
          {i18n.t('settingsDialog.general.appearance')}
        </h3>
        <ThemeTiles initialTheme={theme} />
      </section>
      <section aria-labelledby="settings-general-language" className={PANEL}>
        <h3 id="settings-general-language" className={PANEL_TITLE}>
          {i18n.t('settingsDialog.general.language')}
        </h3>
        <LanguageDialogButton
          choose={chooseLocale}
          className={`flex min-h-11 items-center gap-3 self-start rounded-input px-3 text-sm ${BUTTON_SECONDARY}`}
        >
          <LocaleFlag locale={i18n.locale} />
          <span>{localeName(i18n.locale)}</span>
          <svg width={16} height={16} viewBox="0 0 24 24" aria-hidden="true" className="text-muted">
            <path
              d="M6 9l6 6 6-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </LanguageDialogButton>
      </section>
    </div>
  );
}
