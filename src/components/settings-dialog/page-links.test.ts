import { describe, expect, it } from 'vitest';
import { sectionOfThePageLink } from './page-links';

const ORIGIN = 'https://app.example.com';

function section(href: string) {
  return sectionOfThePageLink('p1', new URL(href, ORIGIN), ORIGIN);
}

describe('the section a link to an old page stands for', () => {
  it('opens the install guide, the help and the settings of the project in place', () => {
    expect(section('/p1/install')).toBe('install');
    expect(section('/p1/help')).toBe('help');
    expect(section('/p1/settings')).toBe('project');
  });

  it('opens the keys and the connected apps for their anchors on the settings page', () => {
    expect(section('/p1/settings#settings-keys-heading')).toBe('keys');
    expect(section('/p1/settings#settings-connections-heading')).toBe('apps');
  });

  it('leaves alone any other page, another project and another site', () => {
    expect(section('/p1/overview')).toBeNull();
    expect(section('/p2/settings')).toBeNull();
    expect(section('https://elsewhere.example.com/p1/settings')).toBeNull();
  });
});
