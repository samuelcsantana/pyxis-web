import type { MouseEvent } from 'react';
import {
  helpHref,
  installHref,
  SETTINGS_CONNECTIONS_PANEL,
  SETTINGS_KEYS_PANEL,
  settingsHref,
} from '@/components/shell/screens';
import { openSettings } from './settings-location';
import type { SettingsSection } from './settings-sections';

export function sectionOfThePageLink(
  projectId: string,
  link: URL,
  origin: string,
): SettingsSection | null {
  if (link.origin !== origin) {
    return null;
  }
  if (link.pathname === installHref(projectId)) {
    return 'install';
  }
  if (link.pathname === helpHref(projectId)) {
    return 'help';
  }
  if (link.pathname !== settingsHref(projectId)) {
    return null;
  }
  if (link.hash === `#${SETTINGS_KEYS_PANEL}-heading`) {
    return 'keys';
  }
  return link.hash === `#${SETTINGS_CONNECTIONS_PANEL}-heading` ? 'apps' : 'project';
}

function opensElsewhere(event: MouseEvent<HTMLElement>): boolean {
  return event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey;
}

export function keepPageLinksInside(projectId: string) {
  return (event: MouseEvent<HTMLElement>) => {
    if (opensElsewhere(event) || !(event.target instanceof Element)) {
      return;
    }
    const link = event.target.closest('a[href]');
    if (!(link instanceof HTMLAnchorElement)) {
      return;
    }
    const section = sectionOfThePageLink(projectId, new URL(link.href), window.location.origin);
    if (section === null) {
      return;
    }
    event.preventDefault();
    openSettings(section);
  };
}
