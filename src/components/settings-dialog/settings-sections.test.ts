import { describe, expect, it } from 'vitest';
import {
  SECTION_GROUPS,
  SETTINGS_SECTIONS,
  settingsHash,
  settingsLocationOf,
} from './settings-sections';

describe('settings sections', () => {
  it('place every section in exactly one group', () => {
    const grouped = Object.values(SECTION_GROUPS).flat();

    expect([...grouped].sort()).toEqual([...SETTINGS_SECTIONS].sort());
    expect(new Set(grouped).size).toBe(grouped.length);
  });

  it('write the address of the list and of each section', () => {
    expect(settingsHash()).toBe('#settings');
    expect(settingsHash('keys')).toBe('#settings/keys');
  });

  it('read the list, a section, or nothing from the address', () => {
    expect(settingsLocationOf('')).toEqual({ kind: 'closed' });
    expect(settingsLocationOf('#settings-keys-heading')).toEqual({ kind: 'closed' });
    expect(settingsLocationOf('#settings')).toEqual({ kind: 'list' });
    expect(settingsLocationOf('#settings/install')).toEqual({
      kind: 'section',
      section: 'install',
    });
  });

  it('fall back to the list for a section that does not exist', () => {
    expect(settingsLocationOf('#settings/constructor')).toEqual({ kind: 'list' });
    expect(settingsLocationOf('#settings/')).toEqual({ kind: 'list' });
  });
});
