import { describe, expect, it } from 'vitest';
import type { Project } from './admin';
import { emptyPeriodView } from './empty-period';
import type { Period } from './period';

const PROJECT: Project = {
  id: 'p1',
  name: 'Demo Store',
  timezone: 'America/Sao_Paulo',
  conversionEvent: 'signup_completed',
};
const LAST_7_DAYS: Period = { preset: '7d', from: '2026-09-29', to: '2026-10-05' };
const LAST_30_DAYS: Period = { preset: '30d', from: '2026-09-06', to: '2026-10-05' };

describe('emptyPeriodView', () => {
  it('shows the first run while the project has never received an event', () => {
    expect(
      emptyPeriodView({ ...PROJECT, firstEventAt: null, lastEventAt: null }, LAST_7_DAYS),
    ).toEqual({ kind: 'first-run' });
  });

  it('shows the first run, as before, when an older API does not say', () => {
    expect(emptyPeriodView(PROJECT, LAST_7_DAYS)).toEqual({ kind: 'first-run' });
  });

  it('calls a period quiet once events have arrived, with the latest one in local time', () => {
    const project = {
      ...PROJECT,
      firstEventAt: '2026-03-02T12:00:00.000Z',
      lastEventAt: '2026-09-20T01:30:00.000Z',
    };

    expect(emptyPeriodView(project, LAST_7_DAYS)).toEqual({
      kind: 'quiet',
      latestEvent: 'Sep 19, 2026, 22:30',
      offersWiderPeriod: true,
    });
    expect(emptyPeriodView(project, LAST_30_DAYS)).toMatchObject({ offersWiderPeriod: false });
  });

  it('calls a period quiet without a latest event when the API leaves it out', () => {
    expect(
      emptyPeriodView({ ...PROJECT, firstEventAt: '2026-03-02T12:00:00.000Z' }, LAST_7_DAYS),
    ).toMatchObject({ kind: 'quiet', latestEvent: null });
  });
});
