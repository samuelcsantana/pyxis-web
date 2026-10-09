export interface EmailPreferences {
  readonly weeklyDigest: boolean;
}

export interface EmailPreferencesWire {
  readonly weekly_digest: boolean;
}

export function emailPreferencesWire(preferences: EmailPreferences): EmailPreferencesWire {
  return { weekly_digest: preferences.weeklyDigest };
}
