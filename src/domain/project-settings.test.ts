import { describe, expect, it } from 'vitest';
import { projectActivity, type ProjectSettings } from './project-settings';

const SETTINGS: ProjectSettings = {
  id: 'p1',
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
