import { describe, expect, it } from 'vitest';
import {
  canCreateProjectKey,
  hasProblems,
  isTimeZone,
  MAX_PROJECT_NAME_LENGTH,
  originOf,
  type ProjectDraft,
  projectChangesOf,
  projectDraftOf,
  projectDraftProblems,
  timeZoneChoices,
} from './project-management';

const DRAFT: ProjectDraft = {
  name: ' Shop ',
  origins: ['https://shop.example.com', ''],
  timezone: 'America/Sao_Paulo',
  conversionEvent: ' signup_completed ',
};

describe('originOf', () => {
  it.each([
    ['https://shop.example.com', 'https://shop.example.com'],
    ['shop.example.com', 'https://shop.example.com'],
    ['  https://shop.example.com/pricing?x=1 ', 'https://shop.example.com'],
    ['http://localhost:5173', 'http://localhost:5173'],
    ['HTTPS://Shop.Example.com', 'https://shop.example.com'],
  ])('reads %s as the origin %s', (input, origin) => {
    expect(originOf(input)).toBe(origin);
  });

  it.each([[''], ['   '], ['ftp://shop.example.com'], ['https://'], ['https://exa mple.com']])(
    'refuses %j',
    (input) => {
      expect(originOf(input)).toBeNull();
    },
  );
});

describe('isTimeZone', () => {
  it.each([
    ['America/Sao_Paulo', true],
    ['UTC', true],
    ['Mars/Olympus_Mons', false],
    ['', false],
  ])('%s is a time zone: %s', (timezone, expected) => {
    expect(isTimeZone(timezone)).toBe(expected);
  });
});

describe('projectDraftProblems', () => {
  it('finds nothing wrong with a filled draft, ignoring empty origin rows', () => {
    const problems = projectDraftProblems(DRAFT);

    expect(problems).toEqual({});
    expect(hasProblems(problems)).toBe(false);
  });

  it('names every problem at once', () => {
    const problems = projectDraftProblems({
      name: '   ',
      origins: ['', ' '],
      timezone: 'Nowhere/Land',
      conversionEvent: 'Sign Up',
    });

    expect(problems).toEqual({
      name: 'missing',
      origins: 'missing',
      timezone: 'invalid',
      conversionEvent: 'invalid',
    });
    expect(hasProblems(problems)).toBe(true);
  });

  it('refuses a name over the limit and an origin it cannot read', () => {
    expect(
      projectDraftProblems({
        ...DRAFT,
        name: 'x'.repeat(MAX_PROJECT_NAME_LENGTH + 1),
        origins: ['ftp://shop.example.com'],
      }),
    ).toEqual({ name: 'tooLong', origins: 'invalid' });
  });

  it('refuses a sixth distinct origin but not a repeated one', () => {
    const five = ['a', 'b', 'c', 'd', 'e'].map((host) => `https://${host}.example.com`);

    expect(projectDraftProblems({ ...DRAFT, origins: [...five, 'https://f.example.com'] })).toEqual(
      { origins: 'tooMany' },
    );
    expect(projectDraftProblems({ ...DRAFT, origins: [...five, five[0] ?? ''] })).toEqual({});
  });
});

describe('projectChangesOf', () => {
  it('trims the name, reads each origin once and leaves no conversion event as null', () => {
    expect(
      projectChangesOf({
        ...DRAFT,
        origins: ['shop.example.com', 'https://shop.example.com/', ''],
        conversionEvent: '  ',
      }),
    ).toEqual({
      name: 'Shop',
      allowedOrigins: ['https://shop.example.com'],
      timezone: 'America/Sao_Paulo',
      conversionEvent: null,
    });
  });

  it('leaves out an origin it cannot read', () => {
    expect(
      projectChangesOf({ ...DRAFT, origins: ['ftp://shop.example.com', 'docs.example.com'] })
        .allowedOrigins,
    ).toEqual(['https://docs.example.com']);
  });

  it('keeps a conversion event, trimmed', () => {
    expect(projectChangesOf(DRAFT).conversionEvent).toBe('signup_completed');
  });
});

describe('projectDraftOf', () => {
  it('starts the form from the saved settings', () => {
    expect(
      projectDraftOf({
        name: 'Shop',
        allowedOrigins: ['https://shop.example.com'],
        timezone: 'UTC',
        conversionEvent: 'signup_completed',
      }),
    ).toEqual({
      name: 'Shop',
      origins: ['https://shop.example.com'],
      timezone: 'UTC',
      conversionEvent: 'signup_completed',
    });
  });

  it('gives an empty origin row and an empty conversion event when there are none', () => {
    expect(
      projectDraftOf({ name: 'Shop', allowedOrigins: [], timezone: 'UTC', conversionEvent: null }),
    ).toMatchObject({ origins: [''], conversionEvent: '' });
  });
});

describe('canCreateProjectKey', () => {
  it('allows a key until five of that kind are live', () => {
    expect(canCreateProjectKey(4)).toBe(true);
    expect(canCreateProjectKey(5)).toBe(false);
  });
});

describe('timeZoneChoices', () => {
  it('lists the zones the runtime knows, sorted, with UTC and the current zone', () => {
    const choices = timeZoneChoices('America/Sao_Paulo');

    expect(choices).toContain('UTC');
    expect(choices).toContain('America/Sao_Paulo');
    expect([...choices].sort()).toEqual(choices);
    expect(new Set(choices).size).toBe(choices.length);
  });

  it('keeps a saved zone the runtime does not list', () => {
    expect(timeZoneChoices('Etc/GMT+3')).toContain('Etc/GMT+3');
  });
});
