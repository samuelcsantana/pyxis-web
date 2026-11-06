import { describe, expect, it } from 'vitest';
import { sharedProjectResponseSchema } from '@/domain/shared-project.schema';
import {
  DEMO_PROTECTED_SHARE_TOKEN,
  DEMO_SHARE_PASSWORD,
  DEMO_SHARE_TOKEN,
  DEMO_SHARE_UNLOCK,
} from '@/services/share-links/mock-share-links-service';
import { english } from '@/test-utils/english';
import {
  demoSharedAnswer,
  demoUnlockAnswer,
  SHARE_LINK_NOT_FOUND,
  SHARE_PASSWORD_NOT_SET,
  SHARE_PASSWORD_REQUIRED,
  SHARED_QUERY_REFUSED,
  WRONG_SHARE_PASSWORD,
} from './demo-shared-answers';

const NOW = new Date('2026-11-05T15:00:00.000Z');
const WEEK = 'from=2026-10-30&to=2026-11-05';

function answer(
  report: readonly string[],
  query = WEEK,
  token = DEMO_SHARE_TOKEN,
  unlock: string | null = null,
) {
  return demoSharedAnswer(token, report, new URLSearchParams(query), english, NOW, unlock);
}

describe('demoSharedAnswer', () => {
  it('opens the demo store for the demo token, with its goals and no expiry', () => {
    const card = answer([]);

    expect(card.status).toBe(200);
    const project = sharedProjectResponseSchema.parse(card.body);
    expect(project.name).toBe('My site');
    expect(project.goals.length).toBeGreaterThan(0);
    expect(project.expiresAt).toBeNull();
  });

  it('answers the same 404 to another token and to a report it does not share', () => {
    expect(answer([], WEEK, `pyxis_sh_${'A'.repeat(32)}`)).toEqual({
      status: 404,
      body: SHARE_LINK_NOT_FOUND,
    });
    expect(answer(['visits'])).toEqual({ status: 404, body: SHARE_LINK_NOT_FOUND });
  });

  it.each(['identity=identified', 'property=plan%3Dpro'])(
    'refuses %s, like the API, since it would narrow a sum to a person',
    (refused) => {
      expect(answer(['overview'], `${WEEK}&${refused}`)).toEqual({
        status: 400,
        body: SHARED_QUERY_REFUSED,
      });
    },
  );

  it.each([
    [['overview'], 'kpis'],
    [['time-of-day'], 'weekdays'],
    [['goals', 'summary'], 'goals'],
    [['acquisition'], 'sources'],
    [['devices'], 'reach'],
    [['features'], 'items'],
    [['engagement'], 'visits'],
    [['funnel'], 'steps'],
    [['funnel', 'segments'], 'segments'],
  ])('answers the demo %j report', (report, field) => {
    const shared = answer(report, `${WEEK}&goal=&kind=screens`);

    expect(shared.status).toBe(200);
    expect(shared.body).toHaveProperty(field);
  });

  it('reads the funnel steps, mode and segment the address asks for', () => {
    const steps = encodeURIComponent('page:/,event:signup_completed');
    const funnel = answer(['funnel'], `${WEEK}&mode=user&steps=${steps}`);
    const segments = answer(['funnel', 'segments'], `${WEEK}&steps=${steps}&by=channel&by=os`);

    expect(funnel.body).toHaveProperty('steps', expect.arrayContaining([expect.anything()]));
    expect(segments.body).toHaveProperty('by', 'channel');
  });

  it('refuses a report without its period, like the API', () => {
    expect(answer(['features'], 'kind=events')).toEqual({
      status: 400,
      body: SHARED_QUERY_REFUSED,
    });
  });
});

describe('the protected demo link', () => {
  it('answers only that a password is needed, and refuses its reports, until unlocked', () => {
    expect(answer([], WEEK, DEMO_PROTECTED_SHARE_TOKEN)).toEqual({
      status: 200,
      body: { password_required: true },
    });
    expect(answer(['overview'], WEEK, DEMO_PROTECTED_SHARE_TOKEN, 'pyxis_su_wrong')).toEqual({
      status: 401,
      body: SHARE_PASSWORD_REQUIRED,
    });
  });

  it('opens the demo store with the demo unlock', () => {
    const card = answer([], WEEK, DEMO_PROTECTED_SHARE_TOKEN, DEMO_SHARE_UNLOCK);
    const report = answer(['overview'], WEEK, DEMO_PROTECTED_SHARE_TOKEN, DEMO_SHARE_UNLOCK);

    expect(sharedProjectResponseSchema.parse(card.body).name).toBe('My site');
    expect(report.status).toBe(200);
  });

  it('unlocks for eight hours with the demo password, and only with it', () => {
    expect(demoUnlockAnswer(DEMO_PROTECTED_SHARE_TOKEN, DEMO_SHARE_PASSWORD, NOW)).toEqual({
      status: 200,
      body: { unlock: DEMO_SHARE_UNLOCK, expires_at: '2026-11-05T23:00:00.000Z' },
    });
    expect(demoUnlockAnswer(DEMO_PROTECTED_SHARE_TOKEN, 'guess', NOW)).toEqual({
      status: 401,
      body: WRONG_SHARE_PASSWORD,
    });
  });

  it('answers like the API to an open link and to an unknown one', () => {
    expect(demoUnlockAnswer(DEMO_SHARE_TOKEN, DEMO_SHARE_PASSWORD, NOW)).toEqual({
      status: 409,
      body: SHARE_PASSWORD_NOT_SET,
    });
    expect(demoUnlockAnswer(`pyxis_sh_${'A'.repeat(32)}`, DEMO_SHARE_PASSWORD, NOW)).toEqual({
      status: 404,
      body: SHARE_LINK_NOT_FOUND,
    });
  });
});
