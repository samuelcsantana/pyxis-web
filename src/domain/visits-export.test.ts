import { describe, expect, it } from 'vitest';
import type { VisitSummary } from './visits';
import { VISITS_TABLE_LABEL, visitsCsvTable } from './visits-export';

const VISIT: VisitSummary = {
  sessionId: '0f1e2d3c-4b5a-4968-8776-655443322110',
  startedAt: '2026-10-05T13:02:00.000Z',
  endedAt: '2026-10-05T13:09:30.000Z',
  entryPath: '/pricing',
  pageViews: 4,
  highlights: ['cta_clicked', 'signup_completed'],
  failedRequests: 1,
  deviceType: 'mobile',
  browser: 'safari',
  os: 'ios',
  country: 'BR',
  channel: 'social',
  userId: 'user-42',
};

describe('visitsCsvTable', () => {
  it('writes one row per visit with every column of the list', () => {
    expect(visitsCsvTable([VISIT])).toEqual({
      columns: [
        'visit_id',
        'started_at',
        'ended_at',
        'entry_path',
        'page_views',
        'highlights',
        'failed_requests',
        'device_type',
        'browser',
        'os',
        'country',
        'channel',
        'user_id',
      ],
      rows: [
        [
          '0f1e2d3c-4b5a-4968-8776-655443322110',
          '2026-10-05T13:02:00.000Z',
          '2026-10-05T13:09:30.000Z',
          '/pricing',
          4,
          'cta_clicked; signup_completed',
          1,
          'mobile',
          'safari',
          'ios',
          'BR',
          'social',
          'user-42',
        ],
      ],
    });
  });

  it('leaves the missing values of an anonymous visit empty', () => {
    const [row] = visitsCsvTable([
      { ...VISIT, entryPath: null, country: null, channel: null, userId: null, highlights: [] },
    ]).rows;

    expect(row).toEqual([
      VISIT.sessionId,
      VISIT.startedAt,
      VISIT.endedAt,
      null,
      4,
      '',
      1,
      'mobile',
      'safari',
      'ios',
      null,
      null,
      null,
    ]);
  });

  it('names the link after the most visits a file holds', () => {
    expect(VISITS_TABLE_LABEL).toBe('Newest 1,000 visits');
  });
});
