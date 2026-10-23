import { describe, expect, it } from 'vitest';
import { english } from '@/test-utils/english';
import { portuguese } from '@/test-utils/portuguese';
import { screenTopbarTexts } from './screen-topbar-texts';

describe('screenTopbarTexts', () => {
  it('translates the subtitle of every screen with the name of the project', () => {
    const texts = screenTopbarTexts('Demo Store', english);

    expect(texts.subtitles).toEqual({
      overview: 'How Demo Store was used in the period',
      funnel: 'Where people continue and where they drop off in Demo Store',
      features: 'What people use the most in Demo Store',
      timeline: 'Everything one person or one visit did in Demo Store, in order',
      visits: 'Every visit to Demo Store in the period, newest first',
      devices: 'What people use to reach Demo Store',
      acquisition: 'Where visits to Demo Store come from',
    });
    expect(texts.requestsSubtitles).toEqual({
      writes: 'Every write Demo Store made, and how it ended',
      reads: 'The reads Demo Store made that failed',
    });
  });

  it('says why a range was not used, for each problem, in the language of the admin', () => {
    expect(screenTopbarTexts('Demo Store', english).rangeNotices).toEqual({
      'not-a-date':
        'That range was not used: one of its dates is not a calendar date. Showing the last 30 days instead.',
      inverted:
        'That range was not used: it ends before it starts. Showing the last 30 days instead.',
      future: 'That range was not used: it ends after today. Showing the last 30 days instead.',
      'too-long':
        'That range was not used: it is longer than 400 days. Showing the last 30 days instead.',
    });
    expect(screenTopbarTexts('Loja', portuguese).subtitles.overview).toContain('Loja');
  });
});
