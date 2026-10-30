import { screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { ProjectSettings } from '@/domain/project-settings';
import { english } from '@/test-utils/english';
import { renderWithMessages } from '@/test-utils/render-with-messages';
import { type KeyManagement, KeysPart, projectKeyId } from './keys-part';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: vi.fn(), refresh: vi.fn(), push: vi.fn() }),
}));

const FIRST_PUBLIC_KEY = `pyxis_pk_${'a'.repeat(32)}`;
const SECOND_PUBLIC_KEY = `pyxis_pk_${'b'.repeat(32)}`;

const FIRST_PUBLIC = { id: 'k1', key: FIRST_PUBLIC_KEY, createdAt: '2026-09-01T08:00:00.000Z' };
const SECOND_PUBLIC = { id: 'k3', key: SECOND_PUBLIC_KEY, createdAt: '2026-10-01T08:00:00.000Z' };
const SECRET = { id: 'k2', createdAt: '2026-09-03T12:00:00.000Z' };

const SETTINGS: ProjectSettings = {
  id: 'p1',
  accountId: 'a1',
  role: 'owner',
  name: 'Shop',
  timezone: 'UTC',
  conversionEvent: null,
  cityEnabled: false,
  allowedOrigins: ['https://shop.example.com'],
  createdAt: '2026-09-01T08:00:00.000Z',
  firstEventAt: null,
  lastEventAt: null,
  eventRetentionMonths: 13,
  publicKeys: [FIRST_PUBLIC],
  secretKeys: [SECRET],
  deletionHeldAt: null,
};

const MANAGE: KeyManagement = {
  createKey: () => Promise.resolve({ kind: 'tooMany' }),
  revokeKey: () => Promise.resolve({ kind: 'revoked' }),
};

const NO_LIVE_KEY = 'This project has no live public key, so it is not measuring.';
const REVOKED_FOR_GOOD =
  "When an account's access ends, its keys are revoked, and they stay revoked if the account comes back.";

const format = english.format.dateTime('eventTime', 'UTC');
const when = (iso: string) => format(new Date(iso));

function renderPart(settings: ProjectSettings, manage: KeyManagement | null) {
  return renderWithMessages(
    <KeysPart settings={settings} i18n={english} when={when} manage={manage} />,
  );
}

function part(name: string) {
  return screen.getByRole('region', { name });
}

describe('projectKeyId', () => {
  it('names the element that describes a key after the key', () => {
    expect(projectKeyId('k1')).toBe('project-key-k1');
  });
});

describe('KeysPart for a reader', () => {
  it('lists the public keys and when each secret key was created, with nothing to change', () => {
    renderPart({ ...SETTINGS, publicKeys: [FIRST_PUBLIC, SECOND_PUBLIC] }, null);

    const publicKeys = within(part('Public keys')).getAllByRole('listitem');
    expect(publicKeys.map((key) => key.textContent)).toEqual([
      `${FIRST_PUBLIC_KEY}Created Sep 1, 2026, 08:00`,
      `${SECOND_PUBLIC_KEY}Created Oct 1, 2026, 08:00`,
    ]);
    expect(part('Public keys')).toHaveTextContent(
      "A public key goes in your site's pages, so it is not a secret.",
    );
    expect(within(part('Secret keys')).getByRole('listitem')).toHaveTextContent(
      'Created Sep 3, 2026, 12:00',
    );
    expect(part('Secret keys')).toHaveTextContent('It is stored as a hash and never shown here.');
    expect(screen.queryByText(NO_LIVE_KEY)).not.toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('says the project has no live key and that only the owner can create one', () => {
    renderPart({ ...SETTINGS, publicKeys: [], secretKeys: [] }, null);

    const publicKeys = part('Public keys');
    expect(publicKeys).toHaveTextContent(NO_LIVE_KEY);
    expect(publicKeys).toHaveTextContent(REVOKED_FOR_GOOD);
    expect(publicKeys).toHaveTextContent("Only the account's owner can create one.");
    expect(within(publicKeys).queryByRole('list')).not.toBeInTheDocument();
    expect(part('Secret keys')).toHaveTextContent('No live secret key.');
    expect(within(part('Secret keys')).queryByRole('list')).not.toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('titles the public and the secret keys with third-level headings', () => {
    renderPart(SETTINGS, null);

    expect(
      screen
        .getAllByRole('heading', { level: 3 })
        .map((heading) => [heading.id, heading.textContent]),
    ).toEqual([
      ['settings-public-keys-heading', 'Public keys'],
      ['settings-secret-keys-heading', 'Secret keys'],
    ]);
  });
});

describe('KeysPart for the owner', () => {
  it('offers to revoke every key when the project keeps several public keys', () => {
    renderPart({ ...SETTINGS, publicKeys: [FIRST_PUBLIC, SECOND_PUBLIC] }, MANAGE);

    expect(screen.getAllByRole('button', { name: 'Revoke' })).toHaveLength(3);
    expect(
      screen.getByRole('button', {
        name: 'Revoke',
        description: `${FIRST_PUBLIC_KEY}Created Sep 1, 2026, 08:00`,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: 'Revoke',
        description: `${SECOND_PUBLIC_KEY}Created Oct 1, 2026, 08:00`,
      }),
    ).toBeInTheDocument();
    expect(
      within(part('Secret keys')).getByRole('button', {
        name: 'Revoke',
        description: 'Created Sep 3, 2026, 12:00',
      }),
    ).toBeInTheDocument();
    expect(document.getElementById(projectKeyId('k2'))).toHaveTextContent(
      'Created Sep 3, 2026, 12:00',
    );
    expect(screen.queryByText(/The only public key stays/)).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'New public key' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'New secret key' })).toBeInTheDocument();
  });

  it('keeps the only public key, saying why, and says there is no secret key', () => {
    renderPart({ ...SETTINGS, secretKeys: [] }, MANAGE);

    const publicKeys = part('Public keys');
    expect(within(publicKeys).getByRole('listitem')).toHaveTextContent(
      `${FIRST_PUBLIC_KEY}Created Sep 1, 2026, 08:00`,
    );
    expect(publicKeys).toHaveTextContent(
      'The only public key stays, or the site could not send events.',
    );
    expect(screen.queryByRole('button', { name: 'Revoke' })).not.toBeInTheDocument();
    expect(part('Secret keys')).toHaveTextContent('No live secret key.');
    expect(within(part('Secret keys')).queryByRole('list')).not.toBeInTheDocument();
    expect(
      within(part('Secret keys')).getByRole('button', { name: 'New secret key' }),
    ).toBeInTheDocument();
  });

  it('says the project has no live public key and offers to create one below', () => {
    renderPart({ ...SETTINGS, publicKeys: [] }, MANAGE);

    const publicKeys = part('Public keys');
    expect(publicKeys).toHaveTextContent(NO_LIVE_KEY);
    expect(publicKeys).toHaveTextContent(REVOKED_FOR_GOOD);
    expect(publicKeys).toHaveTextContent(
      'Create a public key below, then put it in place of the old one on your site.',
    );
    expect(publicKeys).not.toHaveTextContent("Only the account's owner can create one.");
    expect(within(publicKeys).queryByRole('list')).not.toBeInTheDocument();
    expect(within(publicKeys).getByRole('button', { name: 'New public key' })).toBeInTheDocument();
  });

  it('titles the public and the secret keys with third-level headings', () => {
    renderPart(SETTINGS, MANAGE);

    expect(screen.getByRole('heading', { level: 3, name: 'Public keys' })).toHaveAttribute(
      'id',
      'settings-public-keys-heading',
    );
    expect(screen.getByRole('heading', { level: 3, name: 'Secret keys' })).toHaveAttribute(
      'id',
      'settings-secret-keys-heading',
    );
  });
});
