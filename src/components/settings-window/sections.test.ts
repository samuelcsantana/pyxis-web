import { describe, expect, it } from 'vitest';
import { english } from '@/test-utils/english';
import {
  ACCOUNT_PATH,
  ACCOUNT_SECTIONS,
  accountSectionHref,
  isAccountSection,
  isOwnerOnly,
  PROJECT_SECTIONS,
  projectSectionHref,
  projectSectionsFor,
  SECTION_LOOKS,
  type SettingsSection,
} from './sections';

const SPACED_PROJECT = 'shop one/two';
const ENCODED_PROJECT = 'shop%20one%2Ftwo';

describe('settings sections', () => {
  it('give an owner the six project sections in their order', () => {
    expect(projectSectionsFor(true)).toEqual([
      'project',
      'keys',
      'people',
      'email',
      'export',
      'delete',
    ]);
  });

  it('take export and delete away from a member and keep the order of the rest', () => {
    expect(projectSectionsFor(false)).toEqual(['project', 'keys', 'people', 'email']);
  });

  it('mark only export and delete as reserved to the owner', () => {
    const ownerOnly = PROJECT_SECTIONS.filter((section) => isOwnerOnly(section));

    expect(ownerOnly).toEqual(['export', 'delete']);
    expect(isOwnerOnly('project')).toBe(false);
    expect(isOwnerOnly('keys')).toBe(false);
  });

  it('point the project section at the settings address itself', () => {
    expect(projectSectionHref('p-store', 'project')).toBe('/p-store/settings');
  });

  it('point every other project section at its own segment under the settings address', () => {
    expect(projectSectionHref('p-store', 'keys')).toBe('/p-store/settings/keys');
    expect(projectSectionHref('p-store', 'people')).toBe('/p-store/settings/people');
    expect(projectSectionHref('p-store', 'email')).toBe('/p-store/settings/email');
    expect(projectSectionHref('p-store', 'export')).toBe('/p-store/settings/export');
    expect(projectSectionHref('p-store', 'delete')).toBe('/p-store/settings/delete');
  });

  it('encode the project id in the address of every project section', () => {
    expect(projectSectionHref(SPACED_PROJECT, 'project')).toBe(`/${ENCODED_PROJECT}/settings`);
    expect(projectSectionHref(SPACED_PROJECT, 'delete')).toBe(
      `/${ENCODED_PROJECT}/settings/delete`,
    );
  });

  it('point the account sections at their segment under the account address', () => {
    expect(ACCOUNT_PATH).toBe('/account');
    expect(ACCOUNT_SECTIONS.map((section) => accountSectionHref(section))).toEqual([
      '/account/sessions',
      '/account/tokens',
      '/account/apps',
    ]);
  });

  it('know the account sections by name, and nothing else', () => {
    for (const section of ACCOUNT_SECTIONS) {
      expect(isAccountSection(section)).toBe(true);
    }
    for (const value of ['billing', 'keys', 'Sessions', '']) {
      expect(isAccountSection(value)).toBe(false);
    }
  });

  it('give every section the id of the heading its panel used to carry', () => {
    const titleIds = Object.fromEntries(
      Object.entries(SECTION_LOOKS).map(([section, look]) => [section, look.titleId]),
    );

    expect(titleIds).toEqual({
      project: 'settings-project-heading',
      keys: 'settings-keys-heading',
      people: 'settings-people-heading',
      email: 'settings-email-heading',
      export: 'settings-export-heading',
      delete: 'settings-delete-heading',
      sessions: 'settings-sessions-heading',
      tokens: 'settings-access-tokens-heading',
      apps: 'settings-connections-heading',
    });
  });

  it('give every section a distinct title id, an icon and the heading of its panel as label', () => {
    const sections: readonly SettingsSection[] = [...PROJECT_SECTIONS, ...ACCOUNT_SECTIONS];
    const looks = sections.map((section) => SECTION_LOOKS[section]);

    expect(new Set(looks.map((look) => look.titleId)).size).toBe(sections.length);
    expect(looks.every((look) => look.icon.length > 0)).toBe(true);
    expect(looks.map((look) => look.label)).toEqual([
      'settings.project.heading',
      'settings.keys.heading',
      'people.heading',
      'emailPreferences.heading',
      'exportEvents.heading',
      'deleteProject.heading',
      'sessions.heading',
      'accessTokens.heading',
      'connectedApps.heading',
    ]);
    expect(looks.every((look) => english.t(look.label).length > 0)).toBe(true);
  });
});
