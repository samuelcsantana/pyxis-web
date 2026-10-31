import type { SourceMessages } from '@/i18n/messages';
import type { MessageKey } from '@/i18n/translate';
import {
  SETTINGS_CONNECTIONS_PANEL,
  SETTINGS_ICON,
  SETTINGS_KEYS_PANEL,
  settingsHref,
} from '@/components/shell/screens';

export const PROJECT_SECTIONS = ['project', 'keys', 'people', 'email', 'export', 'delete'] as const;
export type ProjectSection = (typeof PROJECT_SECTIONS)[number];

export const ACCOUNT_SECTIONS = ['plan', 'preferences', 'sessions', 'tokens', 'apps'] as const;
export type AccountSection = (typeof ACCOUNT_SECTIONS)[number];

export type SettingsSection = ProjectSection | AccountSection;

export const ACCOUNT_PATH = '/account';

const OWNER_ONLY: ReadonlySet<ProjectSection> = new Set<ProjectSection>(['export', 'delete']);

export interface SectionLook {
  readonly label: MessageKey<SourceMessages>;
  readonly icon: string;
  readonly titleId: string;
}

export const SECTION_LOOKS: Readonly<Record<SettingsSection, SectionLook>> = {
  project: {
    label: 'settings.project.heading',
    icon: SETTINGS_ICON,
    titleId: 'settings-project-heading',
  },
  keys: {
    label: 'settings.keys.heading',
    icon: 'M15 3a6 6 0 1 1-5.2 9L3 18.8V21h3v-2h2v-2h2.2l1-1A6 6 0 0 1 15 3z M16.5 7.5v.01',
    titleId: `${SETTINGS_KEYS_PANEL}-heading`,
  },
  people: {
    label: 'people.heading',
    icon: 'M9 11a4 4 0 1 0 0-8a4 4 0 0 0 0 8z M2 21v-1a6 6 0 0 1 12 0v1 M16 3.1a4 4 0 0 1 0 7.8 M22 21v-1a6 6 0 0 0-4-5.6',
    titleId: 'settings-people-heading',
  },
  email: {
    label: 'emailPreferences.heading',
    icon: 'M4 6h16v12H4z M4 7l8 6 8-6',
    titleId: 'settings-email-heading',
  },
  export: {
    label: 'exportEvents.heading',
    icon: 'M12 4v11 M7 10l5 5 5-5 M5 20h14',
    titleId: 'settings-export-heading',
  },
  delete: {
    label: 'deleteProject.heading',
    icon: 'M4 7h16 M9 7V4h6v3 M6 7l1 13h10l1-13',
    titleId: 'settings-delete-heading',
  },
  plan: {
    label: 'nav.billing',
    icon: 'M4 7h16v10H4z M4 11h16',
    titleId: 'account-plan-heading',
  },
  preferences: {
    label: 'preferences.heading',
    icon: 'M12 3a9 9 0 1 0 0 18a9 9 0 0 0 0-18z M12 3v18 M12 8h6.5 M12 12h9 M12 16h6.5',
    titleId: 'account-preferences-heading',
  },
  sessions: {
    label: 'sessions.heading',
    icon: 'M3 5h12v9H3z M7 18h4 M9 14v4 M17 8h4v12h-4z',
    titleId: 'settings-sessions-heading',
  },
  tokens: {
    label: 'accessTokens.heading',
    icon: 'M4 7h16v10H4z M8 12h.01 M12 12h.01 M16 12h.01',
    titleId: 'settings-access-tokens-heading',
  },
  apps: {
    label: 'connectedApps.heading',
    icon: 'M9 3v5 M15 3v5 M6 8h12v3a6 6 0 0 1-12 0z M12 17v4',
    titleId: `${SETTINGS_CONNECTIONS_PANEL}-heading`,
  },
};

export const ACCOUNT_HOME_SECTION: AccountSection = 'plan';

export function accountSectionOf(
  segments: readonly string[] | undefined,
): AccountSection | undefined {
  if (segments === undefined || segments.length === 0) {
    return ACCOUNT_HOME_SECTION;
  }
  const [section] = segments;
  return segments.length === 1 && section !== ACCOUNT_HOME_SECTION
    ? ACCOUNT_SECTIONS.find((known) => known === section)
    : undefined;
}

export function projectSectionsFor(owner: boolean): readonly ProjectSection[] {
  return owner ? PROJECT_SECTIONS : PROJECT_SECTIONS.filter((section) => !OWNER_ONLY.has(section));
}

export function isOwnerOnly(section: ProjectSection): boolean {
  return OWNER_ONLY.has(section);
}

export function projectSectionHref(projectId: string, section: ProjectSection): string {
  const base = settingsHref(projectId);
  return section === 'project' ? base : `${base}/${section}`;
}

export function accountSectionHref(section: AccountSection): string {
  return section === ACCOUNT_HOME_SECTION ? ACCOUNT_PATH : `${ACCOUNT_PATH}/${section}`;
}
