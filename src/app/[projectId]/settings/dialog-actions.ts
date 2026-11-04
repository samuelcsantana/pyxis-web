'use server';

import {
  readSettingsDialogData,
  type SettingsDialogData,
} from '@/components/settings-dialog/settings-dialog-data';

export async function loadSettingsDialog(projectId: string): Promise<SettingsDialogData> {
  return readSettingsDialogData(projectId);
}
