'use client';

import { useId } from 'react';
import type { EmailPreferences } from '@/domain/email-preferences';
import { useT } from '@/i18n/messages-provider';
import { type ChooseEmailPreference, EmailPreferenceSwitch } from './email-preference-switch';

export interface EmailPreferenceSwitchesProps {
  readonly initial: EmailPreferences;
  readonly timezone: string;
  readonly choose: ChooseEmailPreference;
}

export function EmailPreferenceSwitches({
  initial,
  timezone,
  choose,
}: EmailPreferenceSwitchesProps) {
  const t = useT();
  const alertsId = useId();
  return (
    <div className="flex flex-col gap-3">
      <EmailPreferenceSwitch
        preference="weeklyDigest"
        initial={initial.weeklyDigest}
        label={t('emailPreferences.weeklyDigest')}
        note={t('emailPreferences.weeklyDigestNote', { timezone })}
        choose={choose}
      />
      <section aria-labelledby={alertsId} className="flex flex-col gap-3 border-t border-line pt-4">
        <div className="flex flex-col gap-0.5">
          <h3 id={alertsId} className="text-sm font-semibold">
            {t('emailPreferences.alertsHeading')}
          </h3>
          <p className="text-xs leading-[18px] text-muted">{t('emailPreferences.alertsNote')}</p>
        </div>
        <EmailPreferenceSwitch
          preference="noEventsAlert"
          initial={initial.noEventsAlert}
          label={t('emailPreferences.noEventsAlert')}
          note={t('emailPreferences.noEventsAlertNote')}
          choose={choose}
        />
        <EmailPreferenceSwitch
          preference="failedWritesAlert"
          initial={initial.failedWritesAlert}
          label={t('emailPreferences.failedWritesAlert')}
          note={t('emailPreferences.failedWritesAlertNote')}
          choose={choose}
        />
        <EmailPreferenceSwitch
          preference="conversionDropAlert"
          initial={initial.conversionDropAlert}
          label={t('emailPreferences.conversionDropAlert')}
          note={t('emailPreferences.conversionDropAlertNote')}
          choose={choose}
        />
      </section>
    </div>
  );
}
