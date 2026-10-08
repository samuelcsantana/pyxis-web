import { describe, expect, it } from 'vitest';
import type { AcquisitionReport, Source } from './acquisition';
import { acquisitionCsvTable } from './acquisition-export';

const SOURCE: Source = {
  source: 'instagram.com',
  medium: 'social',
  channel: 'social',
  visits: 40,
  conversions: 6,
  convertingVisits: 5,
  fromAdClickVisits: 0,
};

const REPORT: AcquisitionReport = {
  days: [
    {
      date: '2026-10-05',
      byChannel: {
        paid: 3,
        email: 1,
        social: 7,
        campaign: 0,
        organic: 12,
        referral: 2,
        direct: 20,
      },
    },
  ],
  sources: [SOURCE, { ...SOURCE, source: 'google', medium: null, channel: 'paid', visits: 9 }],
};

describe('acquisitionCsvTable', () => {
  it('writes each source with its channel, visits, conversions and ad click visits', () => {
    expect(acquisitionCsvTable(REPORT, 'sources')).toEqual({
      columns: [
        'source',
        'medium',
        'channel',
        'visits',
        'conversion_events',
        'converting_visits',
        'ad_click_visits',
      ],
      rows: [
        ['instagram.com', 'social', 'social', 40, 6, 5, 0],
        ['google', null, 'paid', 9, 6, 5, 0],
      ],
    });
  });

  it('leaves the conversion columns out when nothing counts conversions', () => {
    const table = acquisitionCsvTable(
      { ...REPORT, sources: [{ ...SOURCE, conversions: null, convertingVisits: null }] },
      'sources',
    );

    expect(table).toEqual({
      columns: ['source', 'medium', 'channel', 'visits', 'ad_click_visits'],
      rows: [['instagram.com', 'social', 'social', 40, 0]],
    });
  });

  it('writes the visits of each day split by channel', () => {
    expect(acquisitionCsvTable(REPORT, 'channels')).toEqual({
      columns: ['date', 'paid', 'email', 'social', 'campaign', 'organic', 'referral', 'direct'],
      rows: [['2026-10-05', 3, 1, 7, 0, 12, 2, 20]],
    });
  });
});
