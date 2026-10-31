import { PreferencesPanel } from '@/components/settings/preferences-panel';
import { chooseLocale } from '@/i18n/choose-locale';
import { chosenTheme } from '@/lib/theme-cookie';
import type { AccountBodyInput } from '@/app/[projectId]/settings/settings-sections';

export async function preferencesBody({ i18n }: AccountBodyInput) {
  return <PreferencesPanel i18n={i18n} theme={await chosenTheme()} choose={chooseLocale} />;
}
