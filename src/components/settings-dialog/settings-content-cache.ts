'use client';

import { loadSettingsDialog } from '@/app/[projectId]/settings/dialog-actions';
import type { SettingsDialogData } from './settings-dialog-data';

let pending: {
  readonly key: string;
  readonly content: Promise<SettingsDialogData>;
} | null = null;

export function settingsContentOf(projectId: string, locale: string): Promise<SettingsDialogData> {
  const key = `${projectId}:${locale}`;
  if (pending?.key !== key) {
    pending = { key, content: loadSettingsDialog(projectId) };
    pending.content.catch(() => {
      pending = null;
    });
  }
  return pending.content;
}

export function forgetSettingsContent() {
  pending = null;
}
