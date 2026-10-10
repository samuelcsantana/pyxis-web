import type { I18n } from '@/i18n/i18n';
import { browserLabel, operatingSystemLabel } from './devices';

export interface AdminSession {
  readonly id: string;
  readonly browser: string | null;
  readonly os: string | null;
  readonly deviceType: string | null;
  readonly createdAt: string;
  readonly lastUsedAt: string;
  readonly current: boolean;
}

export function describeDevice(session: AdminSession, i18n: I18n): string {
  if (session.browser === null || session.os === null) {
    return i18n.t('sessions.unknownDevice');
  }
  return i18n.t('sessions.device', {
    browser: browserLabel(session.browser, i18n),
    os: operatingSystemLabel(session.os, i18n),
  });
}
