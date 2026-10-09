import { describe, expect, it } from 'vitest';
import { english } from '@/test-utils/english';
import { portuguese } from '@/test-utils/portuguese';
import {
  type EngagementReport,
  engagementSummary,
  medianVisitLabel,
  singlePageShare,
  visitLengthRows,
} from './engagement';
import { engagementResponseSchema } from './engagement.schema';

const BOUNDS = [10, 30, 60, 180, 600, 1800, null] as const;

const REPORT: EngagementReport = engagementResponseSchema.parse({
  visits: 40,
  single_page_visits: 10,
  median_visit_seconds: 95,
  visit_lengths: BOUNDS.map((upToSeconds, index) => ({
    up_to_seconds: upToSeconds,
    visits: [10, 0, 5, 20, 3, 1, 1][index],
  })),
  entry_pages: [{ path: '/', visits: 30, single_page_visits: 8 }],
  exit_pages: [{ path: '/pricing', visits: 12 }],
});

describe('engagement', () => {
  it('reads the API answer into the domain', () => {
    expect(REPORT).toMatchObject({
      visits: 40,
      singlePageVisits: 10,
      medianVisitSeconds: 95,
      entryPages: [{ path: '/', visits: 30, singlePageVisits: 8 }],
      exitPages: [{ path: '/pricing', visits: 12 }],
    });
    expect(REPORT.visitLengths.at(-1)).toEqual({ upToSeconds: null, visits: 1 });
  });

  it('labels each length bucket by its bounds, in seconds then minutes, the last one open', () => {
    expect(visitLengthRows(REPORT, english).map((row) => row.label)).toEqual([
      'Under 10 s',
      '10 s to 30 s',
      '30 s to 1 min',
      '1 min to 3 min',
      '3 min to 10 min',
      '10 min to 30 min',
      '30 min or more',
    ]);
    expect(visitLengthRows(REPORT, portuguese).at(-1)?.label).toBe('30 min ou mais');
  });

  it('gives each bucket its share of the visits and a bar against the busiest bucket', () => {
    const rows = visitLengthRows(REPORT, english);

    expect(rows[3]).toMatchObject({ visits: 20, share: 0.5, barWidth: '100%' });
    expect(rows[0]).toMatchObject({ share: 0.25, barWidth: '50%' });
    expect(rows[1]).toMatchObject({ share: 0, barWidth: '0%' });
  });

  it('opens a lone bucket from zero and keeps empty shares at zero', () => {
    const lone: EngagementReport = {
      ...REPORT,
      visits: 0,
      visitLengths: [{ upToSeconds: null, visits: 0 }],
    };

    expect(visitLengthRows(lone, english)).toEqual([
      { label: '0 s or more', visits: 0, share: 0, barWidth: '0%' },
    ]);
    expect(singlePageShare(lone)).toBe(0);
  });

  it('sums the visits up with their median and the share that viewed one page', () => {
    expect(medianVisitLabel(REPORT, english)).toBe('1 min 35 s');
    expect(engagementSummary(REPORT, english)).toBe(
      'Median visit 1 min 35 s; 25.0% of the visits viewed one page.',
    );
    expect(medianVisitLabel({ ...REPORT, medianVisitSeconds: null }, english)).toBe('no visits');
  });
});
