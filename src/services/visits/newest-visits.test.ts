import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NO_VISIT_FILTERS, type VisitSummary } from '@/domain/visits';
import type { IVisitsService } from './visits-service.interface';
import { readNewestVisits } from './newest-visits';

const state = vi.hoisted<{ visits: IVisitsService['visits'] }>(() => ({
  visits: () => Promise.reject(new Error('visits not set')),
}));

vi.mock('./visits-service.factory', () => ({
  createVisitsService: (): IVisitsService => ({
    visits: (projectId, range, filters, cursor) => state.visits(projectId, range, filters, cursor),
  }),
}));

const RANGE = { from: '2026-09-07', to: '2026-10-06' };

function visit(index: number): VisitSummary {
  return {
    sessionId: `visit-${String(index)}`,
    startedAt: '2026-10-05T13:02:00.000Z',
    endedAt: '2026-10-05T13:09:30.000Z',
    entryPath: '/',
    pageViews: 1,
    highlights: [],
    failedRequests: 0,
    deviceType: 'desktop',
    browser: 'chrome',
    os: 'windows',
    country: 'BR',
    channel: 'direct',
    userId: null,
  };
}

const PAGES: Readonly<
  Record<string, { visits: VisitSummary[]; nextCursor: string | null; total: number }>
> = {
  first: { visits: [visit(1), visit(2)], nextCursor: 'second', total: 5 },
  second: { visits: [visit(3), visit(4)], nextCursor: 'third', total: 5 },
  third: { visits: [visit(5)], nextCursor: null, total: 5 },
};

let visits = vi.fn<IVisitsService['visits']>();

beforeEach(() => {
  visits = vi.fn<IVisitsService['visits']>((_projectId, _range, _filters, cursor) =>
    Promise.resolve(PAGES[cursor ?? 'first'] ?? { visits: [], nextCursor: null, total: 0 }),
  );
  state.visits = visits;
});

describe('readNewestVisits', () => {
  it('follows the cursor until the last page', async () => {
    const found = await readNewestVisits('p-store', RANGE, NO_VISIT_FILTERS, 10);

    expect(found.map((entry) => entry.sessionId)).toEqual([
      'visit-1',
      'visit-2',
      'visit-3',
      'visit-4',
      'visit-5',
    ]);
    expect(visits.mock.calls.map((call) => call[3])).toEqual([null, 'second', 'third']);
    expect(visits).toHaveBeenCalledWith('p-store', RANGE, NO_VISIT_FILTERS, null);
  });

  it('stops reading once it holds the most it may keep, and keeps the newest', async () => {
    const found = await readNewestVisits('p-store', RANGE, NO_VISIT_FILTERS, 3);

    expect(found.map((entry) => entry.sessionId)).toEqual(['visit-1', 'visit-2', 'visit-3']);
    expect(visits).toHaveBeenCalledTimes(2);
  });
});
