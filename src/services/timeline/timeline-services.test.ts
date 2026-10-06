import { afterEach, describe, expect, it, vi } from 'vitest';
import { ApiReader } from '../api-reader';
import { DEMO_USER_ID, demoTimelineWire } from './demo-timeline';
import { HttpTimelineService } from './http-timeline-service';
import { MockTimelineService } from './mock-timeline-service';
import { createTimelineService } from './timeline-service.factory';

const API = 'https://api.pyxis.example.com';
const NOW = new Date('2026-10-06T02:30:00.000Z');
const VISIT = '3c07a1b2-6d4e-4f10-9a2b-5c8d7e6f1a01';

vi.mock('next/headers', () => ({
  cookies: () => Promise.resolve({ get: () => undefined }),
}));

function answering() {
  const fetchMock = vi.fn<typeof fetch>(() =>
    Promise.resolve(
      new Response(JSON.stringify(demoTimelineWire({ kind: 'user', id: DEMO_USER_ID }, NOW))),
    ),
  );
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

describe('HttpTimelineService', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('asks the visits of a person', async () => {
    const fetchMock = answering();

    const report = await new HttpTimelineService(
      new ApiReader(API, () => Promise.resolve('token')),
    ).timeline('p1', { kind: 'user', id: 'u_7f3a' }, null);

    expect(fetchMock.mock.calls[0]?.[0]).toBe(`${API}/v1/projects/p1/timeline?user_id=u_7f3a`);
    expect(report.visits).toHaveLength(3);
  });

  it('asks one visit, older than a cursor', async () => {
    const fetchMock = answering();

    await new HttpTimelineService(new ApiReader(API, () => Promise.resolve('token'))).timeline(
      'p1',
      { kind: 'visit', id: VISIT },
      '2026-10-01T00:00:00.000Z',
    );

    expect(fetchMock.mock.calls[0]?.[0]).toBe(
      `${API}/v1/projects/p1/timeline?session_id=${VISIT}&before=2026-10-01T00%3A00%3A00.000Z`,
    );
  });
});

describe('MockTimelineService', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('tells the board story of the demo person two visits at a time, relative to now', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(NOW);
    const service = new MockTimelineService();
    const person = { kind: 'user', id: DEMO_USER_ID } as const;

    const first = await service.timeline('demo', person, null);
    const second = await service.timeline('demo', person, first.nextBefore);

    expect(first.visits.map((visit) => visit.startedAt)).toEqual([
      '2026-10-05T21:40:12.000Z',
      '2026-10-03T12:12:04.000Z',
    ]);
    expect(first.visits[0]?.endedAt).toBe('2026-10-05T21:41:31.000Z');
    expect(first.nextBefore).toBe('2026-10-03T12:12:04.000Z');
    expect(second.visits.map((visit) => visit.startedAt)).toEqual(['2026-10-02T17:03:10.000Z']);
    expect(second.visits[0]?.events).toHaveLength(11);
    expect(second.nextBefore).toBeNull();
  });

  it('finds one visit by its id, and nothing for anyone else', async () => {
    const service = new MockTimelineService();
    const visit = await service.timeline('demo', { kind: 'visit', id: VISIT }, null);
    const nobody = await service.timeline('demo', { kind: 'user', id: 'someone_else' }, null);

    expect(visit.visits).toHaveLength(1);
    expect(visit.nextBefore).toBeNull();
    expect(nobody.visits).toEqual([]);
  });
});

describe('createTimelineService', () => {
  it('talks to the API when its URL is set', () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', API);

    expect(createTimelineService()).toBeInstanceOf(HttpTimelineService);
  });

  it('uses the demo service without an API URL', () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');

    expect(createTimelineService()).toBeInstanceOf(MockTimelineService);
  });
});
