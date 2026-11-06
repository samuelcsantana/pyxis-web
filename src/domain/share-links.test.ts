import { describe, expect, it } from 'vitest';
import { demoAccountsWire } from '@/services/accounts/mock-accounts-service';
import type { Account } from './accounts';
import { myAccountsResponseSchema } from './accounts.schema';
import {
  canCreateShareLink,
  MAX_SHARE_LINKS,
  parseShareLinkExpiry,
  type ShareLink,
  shareLinkNameProblem,
  shareLinkRequestOf,
  shareLinkUrl,
  shareLinkValidity,
  sharesOnPro,
  sharePasswordProblem,
} from './share-links';
import {
  createdShareLinkResponseSchema,
  shareLinkPasswordWire,
  shareLinkRequestWire,
  shareLinkResponseSchema,
  shareLinksResponseSchema,
} from './share-links.schema';

const NOW = new Date('2026-11-05T12:00:00.000Z');
const LINK: ShareLink = {
  id: '4d0f6b8c-5e7a-4f9b-8c4d-6e8f0a2b4c5d',
  name: 'Monthly board report',
  createdAt: '2026-10-27T12:00:00.000Z',
  expiresAt: null,
  passwordProtected: false,
};

const [DEMO_ACCOUNT] = myAccountsResponseSchema.parse(demoAccountsWire(NOW));

function account(id: string, status: Account['status']): Account {
  if (DEMO_ACCOUNT === undefined) {
    throw new Error('The demo has an account.');
  }
  return { ...DEMO_ACCOUNT, id, status };
}

describe('parseShareLinkExpiry', () => {
  it('reads never and each offered number of days', () => {
    expect(parseShareLinkExpiry('never')).toBe('never');
    expect(parseShareLinkExpiry('7')).toBe(7);
    expect(parseShareLinkExpiry('365')).toBe(365);
  });

  it('refuses any other choice', () => {
    expect(parseShareLinkExpiry('14')).toBeNull();
    expect(parseShareLinkExpiry('')).toBeNull();
  });
});

describe('shareLinkNameProblem', () => {
  it('asks for a name, and for one of at most 64 characters', () => {
    expect(shareLinkNameProblem('   ')).toBe('missing');
    expect(shareLinkNameProblem('x'.repeat(65))).toBe('tooLong');
    expect(shareLinkNameProblem(` ${'x'.repeat(64)} `)).toBeNull();
  });
});

describe('canCreateShareLink', () => {
  it('allows a link until the project has ten', () => {
    expect(canCreateShareLink(Array.from({ length: MAX_SHARE_LINKS - 1 }, () => LINK))).toBe(true);
    expect(canCreateShareLink(Array.from({ length: MAX_SHARE_LINKS }, () => LINK))).toBe(false);
  });
});

describe('shareLinkRequestOf', () => {
  it('trims the name and turns the chosen days into an expiry from now', () => {
    expect(shareLinkRequestOf({ name: '  Board ', expiry: 30, password: null }, NOW)).toEqual({
      name: 'Board',
      expiresAt: '2026-12-05T12:00:00.000Z',
      password: null,
    });
  });

  it('sends no expiry for a link that never expires', () => {
    expect(
      shareLinkRequestOf({ name: 'Board', expiry: 'never', password: null }, NOW).expiresAt,
    ).toBeNull();
  });

  it('keeps the password exactly as typed, spaces included', () => {
    expect(
      shareLinkRequestOf({ name: 'Board', expiry: 'never', password: ' open sesame ' }, NOW)
        .password,
    ).toBe(' open sesame ');
  });
});

describe('shareLinkValidity', () => {
  it('tells a link that never expires, one still open and one that expired', () => {
    expect(shareLinkValidity(LINK, NOW)).toEqual({ kind: 'forever' });
    expect(shareLinkValidity({ ...LINK, expiresAt: '2026-11-06T00:00:00.000Z' }, NOW)).toEqual({
      kind: 'until',
      at: '2026-11-06T00:00:00.000Z',
    });
    expect(shareLinkValidity({ ...LINK, expiresAt: NOW.toISOString() }, NOW)).toEqual({
      kind: 'expired',
      at: NOW.toISOString(),
    });
  });
});

describe('shareLinkUrl', () => {
  it('points at the public page of the dashboard the link was made on', () => {
    expect(shareLinkUrl('https://app.pyxis-analytics.dev', 'pyxis_sh_abc')).toBe(
      'https://app.pyxis-analytics.dev/share/pyxis_sh_abc',
    );
  });
});

describe('sharesOnPro', () => {
  it('lets the projects of an account on Pro share, and those outside any account', () => {
    expect(sharesOnPro([account('a1', 'active')], 'a1')).toBe(true);
    expect(sharesOnPro([], null)).toBe(true);
  });

  it('keeps sharing to Pro: an account on Hobby, or one it cannot read, does not', () => {
    expect(sharesOnPro([account('a1', 'free')], 'a1')).toBe(false);
    expect(sharesOnPro([account('a2', 'active')], 'a1')).toBe(false);
  });
});

function linkWire(passwordProtected: boolean) {
  return {
    id: LINK.id,
    name: LINK.name,
    created_at: LINK.createdAt,
    expires_at: null,
    password_protected: passwordProtected,
  };
}

describe('sharePasswordProblem', () => {
  it('takes 8 to 128 characters, counting each emoji as one', () => {
    expect(sharePasswordProblem('1234567')).toBe('tooShort');
    expect(sharePasswordProblem('12345678')).toBeNull();
    expect(sharePasswordProblem('🔒'.repeat(8))).toBeNull();
    expect(sharePasswordProblem('x'.repeat(128))).toBeNull();
    expect(sharePasswordProblem('x'.repeat(129))).toBe('tooLong');
  });
});

describe('the share link schemas', () => {
  it('read the list and the created link, and write the API body', () => {
    expect(
      shareLinksResponseSchema.parse({
        links: [linkWire(false)],
      }),
    ).toEqual([LINK]);
    expect(
      createdShareLinkResponseSchema.parse({
        id: LINK.id,
        name: LINK.name,
        created_at: LINK.createdAt,
        expires_at: '2026-12-05T12:00:00.000Z',
        password_protected: false,
        token: 'pyxis_sh_abc',
      }),
    ).toEqual({ ...LINK, expiresAt: '2026-12-05T12:00:00.000Z', token: 'pyxis_sh_abc' });
    expect(shareLinkRequestWire({ name: 'Board', expiresAt: null, password: null })).toEqual({
      name: 'Board',
      expires_at: null,
      password: null,
    });
    expect(shareLinkPasswordWire('open sesame')).toEqual({ password: 'open sesame' });
    expect(shareLinkResponseSchema.parse(linkWire(true))).toEqual({
      ...LINK,
      passwordProtected: true,
    });
  });
});
