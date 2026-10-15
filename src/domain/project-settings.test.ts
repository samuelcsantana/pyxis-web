import { describe, expect, it } from 'vitest';
import { canManageProject, projectActivity, type ProjectSettings } from './project-settings';

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
