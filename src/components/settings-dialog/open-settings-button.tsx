'use client';

import type { ReactNode } from 'react';
import { closeTheMenuAround, focusReturnTargetOf } from '@/components/ui/focus-return';
import { useLocale } from '@/i18n/messages-provider';
import { settingsContentOf } from './settings-content-cache';
import { preloadTheSettingsDialog } from './settings-dialog-mount';
import { openSettings } from './settings-location';
import { type SettingsSection, settingsHash } from './settings-sections';

export interface OpenSettingsButtonProps {
  readonly projectId: string;
  readonly section: SettingsSection;
  readonly className: string;
  readonly children: ReactNode;
}

export function OpenSettingsButton({
  projectId,
  section,
  className,
  children,
}: OpenSettingsButtonProps) {
  const locale = useLocale();
  const prefetch = () => {
    preloadTheSettingsDialog();
    void settingsContentOf(projectId, locale);
  };
  return (
    <a
      href={settingsHash(section)}
      onPointerEnter={prefetch}
      onFocus={prefetch}
      onClick={(event) => {
        event.preventDefault();
        const opener = focusReturnTargetOf(event.currentTarget);
        closeTheMenuAround(event.currentTarget);
        openSettings(section, opener);
      }}
      className={className}
    >
      {children}
    </a>
  );
}
