export const SETTINGS_SECTIONS = [
  'general',
  'billing',
  'security',
  'tokens',
  'apps',
  'install',
  'project',
  'goals',
  'share',
  'privacy',
  'keys',
  'people',
  'email',
  'data',
  'help',
] as const;

export type SettingsSection = (typeof SETTINGS_SECTIONS)[number];

export type SettingsGroup = 'account' | 'project' | 'support';

export const SECTION_GROUPS: Readonly<Record<SettingsGroup, readonly SettingsSection[]>> = {
  account: ['general', 'billing', 'security', 'tokens', 'apps'],
  project: ['install', 'project', 'goals', 'share', 'privacy', 'keys', 'people', 'email', 'data'],
  support: ['help'],
};

export const SETTINGS_HASH_PREFIX = '#settings';
export const FIRST_SECTION: SettingsSection = 'general';

export type SettingsLocation =
  | { readonly kind: 'closed' }
  | { readonly kind: 'list' }
  | { readonly kind: 'section'; readonly section: SettingsSection };

const CLOSED: SettingsLocation = { kind: 'closed' };
const LIST: SettingsLocation = { kind: 'list' };

function isSettingsSection(value: string): value is SettingsSection {
  return (SETTINGS_SECTIONS as readonly string[]).includes(value);
}

export function settingsLocationOf(hash: string): SettingsLocation {
  if (hash === SETTINGS_HASH_PREFIX) {
    return LIST;
  }
  if (!hash.startsWith(`${SETTINGS_HASH_PREFIX}/`)) {
    return CLOSED;
  }
  const section = hash.slice(SETTINGS_HASH_PREFIX.length + 1);
  return isSettingsSection(section) ? { kind: 'section', section } : LIST;
}

export function settingsHash(section?: SettingsSection): string {
  return section === undefined ? SETTINGS_HASH_PREFIX : `${SETTINGS_HASH_PREFIX}/${section}`;
}
