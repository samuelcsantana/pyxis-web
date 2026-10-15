import { describe, expect, it } from 'vitest';
import {
  canManageProject,
  hasLivePublicKey,
  isProjectDeletionHeld,
  projectActivity,
  type ProjectSettings,
} from './project-settings';
import { projectSettingsResponseSchema } from './project-settings.schema';

const SETTINGS: ProjectSettings = {
  id: 'p1',
  accountId: 'a1',
  role: 'owner',
  name: 'Shop',
  timezone: 'UTC',
  conversionEvent: null,
  allowedOrigins: [],
  createdAt: '2026-10-01T00:00:00.000Z',
  firstEventAt: '2026-10-02T00:00:00.000Z',
  lastEventAt: '2026-10-03T00:00:00.000Z',
  eventRetentionMonths: 13,
  publicKeys: [],
  secretKeys: [],
  deletionHeldAt: null,
};

describe('projectActivity', () => {
  it('is waiting before the first event arrives', () => {
    expect(projectActivity({ ...SETTINGS, firstEventAt: null, lastEventAt: null })).toEqual({
      kind: 'waiting',
    });
  });

  it('is waiting while the latest event is unknown', () => {
    expect(projectActivity({ ...SETTINGS, lastEventAt: null })).toEqual({ kind: 'waiting' });
  });

  it('is receiving once an event was kept, with its oldest and latest event', () => {
    expect(projectActivity(SETTINGS)).toEqual({
      kind: 'receiving',
      firstEventAt: '2026-10-02T00:00:00.000Z',
      lastEventAt: '2026-10-03T00:00:00.000Z',
    });
  });
});

describe('canManageProject', () => {
  it.each([
    ['the owner of the account', 'owner', true],
    ['someone the owner added', 'member', false],
    ['the operator, whose projects change through the command line', null, false],
  ] as const)('is %s: %s', (_, role, expected) => {
    expect(canManageProject({ ...SETTINGS, role })).toBe(expected);
  });
});

describe('hasLivePublicKey', () => {
  it('is false when every public key was revoked, so the site cannot send events', () => {
    expect(hasLivePublicKey(SETTINGS)).toBe(false);
  });

  it('is true while a public key works', () => {
    expect(
      hasLivePublicKey({
        ...SETTINGS,
        publicKeys: [{ id: 'k1', key: 'pyxis_pk_x', createdAt: '2026-10-01T00:00:00.000Z' }],
      }),
    ).toBe(true);
  });
});

describe('isProjectDeletionHeld', () => {
  it('is true while Pyxis holds the deletion of the project', () => {
    expect(isProjectDeletionHeld({ ...SETTINGS, deletionHeldAt: '2026-10-04T00:00:00.000Z' })).toBe(
      true,
    );
  });

  it('is false otherwise', () => {
    expect(isProjectDeletionHeld(SETTINGS)).toBe(false);
  });
});

describe('projectSettingsResponseSchema', () => {
  const WIRE = {
    id: 'p1',
    account_id: 'a1',
    role: 'owner',
    name: 'Shop',
    timezone: 'UTC',
    conversion_event: null,
    allowed_origins: [],
    created_at: '2026-10-01T00:00:00.000Z',
    first_event_at: null,
    last_event_at: null,
    event_retention_months: 13,
    public_keys: [],
    secret_keys: [],
  };

  it('reads when Pyxis began holding the deletion of the project', () => {
    expect(
      projectSettingsResponseSchema.parse({ ...WIRE, deletion_held_at: '2026-10-04T00:00:00.000Z' })
        .deletionHeldAt,
    ).toBe('2026-10-04T00:00:00.000Z');
  });

  it('reads no hold when the API does not send one', () => {
    expect(projectSettingsResponseSchema.parse(WIRE).deletionHeldAt).toBeNull();
    expect(
      projectSettingsResponseSchema.parse({ ...WIRE, deletion_held_at: null }).deletionHeldAt,
    ).toBeNull();
  });
});
