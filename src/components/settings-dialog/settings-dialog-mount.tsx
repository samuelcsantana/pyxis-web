'use client';

import { lazy, Suspense, useState } from 'react';
import type { SettingsDialogProps } from './settings-dialog';
import { useSettingsLocation } from './settings-location';

const SettingsDialog = lazy(() =>
  import('./settings-dialog').then((module) => ({ default: module.SettingsDialog })),
);

export function preloadTheSettingsDialog() {
  void import('./settings-dialog');
}

export function SettingsDialogMount(props: SettingsDialogProps) {
  const asked = useSettingsLocation().kind !== 'closed';
  const [mounted, setMounted] = useState(asked);
  if (asked && !mounted) {
    setMounted(true);
  }
  return mounted ? (
    <Suspense fallback={null}>
      <SettingsDialog {...props} />
    </Suspense>
  ) : null;
}
