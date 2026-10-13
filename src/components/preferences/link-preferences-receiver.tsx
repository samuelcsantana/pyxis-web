'use client';

import { useEffect } from 'react';
import { bestEffortRememberDeviceTheme } from '@/lib/device-theme';
import { carriesPreferences, preferencesIn, withoutPreferences } from '@/lib/link-preferences';

export function LinkPreferencesReceiver() {
  useEffect(() => {
    const address = new URL(window.location.href);
    if (!carriesPreferences(address.searchParams)) {
      return;
    }
    const { theme } = preferencesIn(address.searchParams);
    if (theme !== undefined) {
      bestEffortRememberDeviceTheme(theme);
      document.documentElement.dataset.theme = theme;
    }
    window.history.replaceState(window.history.state, '', withoutPreferences(address));
  }, []);

  return null;
}
