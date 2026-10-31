import { LanguageField } from '@/components/language/language-field';
import { ThemeChoiceGroup } from '@/components/theme/theme-choice';
import { SECTION_BODY } from '@/components/ui/panel-classes';
import type { I18n } from '@/i18n/i18n';
import type { Theme } from '@/lib/theme';

export interface PreferencesPanelProps {
  readonly i18n: I18n;
  readonly theme?: Theme;
  readonly choose: (form: FormData) => Promise<void>;
}

const THEME_LABEL_ID = 'preferences-theme-label';

export function PreferencesPanel({ i18n, theme, choose }: PreferencesPanelProps) {
  return (
    <div className={SECTION_BODY}>
      <p className="text-sm text-muted">{i18n.t('preferences.thisBrowser')}</p>
      <div className="flex flex-col gap-1.5">
        <span id={THEME_LABEL_ID} className="text-caption font-medium">
          {i18n.t('theme.label')}
        </span>
        <ThemeChoiceGroup initialTheme={theme} labelledBy={THEME_LABEL_ID} />
      </div>
      <LanguageField locale={i18n.locale} label={i18n.t('language.label')} choose={choose} />
    </div>
  );
}
