import type { ReactNode } from 'react';
import { SettingsWindowHost } from '@/components/settings-window/settings-window-host';
import { getTranslator } from '@/i18n/get-messages';

export interface ModalLayoutProps {
  readonly children: ReactNode;
}

export default async function ModalLayout({ children }: ModalLayoutProps) {
  const t = await getTranslator();
  return <SettingsWindowHost closeLabel={t('settings.close')}>{children}</SettingsWindowHost>;
}
