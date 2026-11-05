export const EMAIL_PREFERENCES = [
  'weeklyDigest',
  'noEventsAlert',
  'failedWritesAlert',
  'conversionDropAlert',
] as const;

export type EmailPreference = (typeof EMAIL_PREFERENCES)[number];

export type EmailPreferences = Readonly<Record<EmailPreference, boolean>>;

export interface EmailPreferenceChoice {
  readonly preference: EmailPreference;
  readonly on: boolean;
}

export interface EmailPreferencesWire {
  readonly weekly_digest: boolean;
  readonly no_events_alert: boolean;
  readonly failed_writes_alert: boolean;
  readonly conversion_drop_alert: boolean;
}

export type EmailPreferenceChangesWire = Partial<EmailPreferencesWire>;

const WIRE_NAMES: Readonly<Record<EmailPreference, keyof EmailPreferencesWire>> = {
  weeklyDigest: 'weekly_digest',
  noEventsAlert: 'no_events_alert',
  failedWritesAlert: 'failed_writes_alert',
  conversionDropAlert: 'conversion_drop_alert',
};

export function emailPreferenceChangesWire(
  choice: EmailPreferenceChoice,
): EmailPreferenceChangesWire {
  return { [WIRE_NAMES[choice.preference]]: choice.on };
}

export function emailPreferencesOf(wire: EmailPreferencesWire): EmailPreferences {
  return {
    weeklyDigest: wire.weekly_digest,
    noEventsAlert: wire.no_events_alert,
    failedWritesAlert: wire.failed_writes_alert,
    conversionDropAlert: wire.conversion_drop_alert,
  };
}
