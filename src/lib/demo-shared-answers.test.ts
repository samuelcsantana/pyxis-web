import { describe, expect, it } from 'vitest';
import { sharedProjectResponseSchema } from '@/domain/shared-project.schema';
import { DEMO_SHARE_TOKEN } from '@/services/share-links/mock-share-links-service';
import { english } from '@/test-utils/english';
import {
  demoSharedAnswer,
  SHARE_LINK_NOT_FOUND,
  SHARED_QUERY_REFUSED,
} from './demo-shared-answers';

const NOW = new Date('2026-11-05T15:00:00.000Z');
const WEEK = 'from=2026-10-30&to=2026-11-05';

function answer(report: readonly string[], query = WEEK, token = DEMO_SHARE_TOKEN) {
  return demoSharedAnswer(token, report, new URLSearchParams(query), english, NOW);
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
