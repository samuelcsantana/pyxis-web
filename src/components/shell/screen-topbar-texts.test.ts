import { describe, expect, it } from 'vitest';
import { english } from '@/test-utils/english';
import { portuguese } from '@/test-utils/portuguese';
import { screenTopbarTexts } from './screen-topbar-texts';

describe('screenTopbarTexts', () => {
  it('says why a range was not used, for each problem, in the language of the admin', () => {
    expect(screenTopbarTexts(english).rangeNotices).toEqual({
      'not-a-date':
        'That range was not used: one of its dates is not a calendar date. Showing the last 30 days instead.',
      inverted:
        'That range was not used: it ends before it starts. Showing the last 30 days instead.',
      future: 'That range was not used: it ends after today. Showing the last 30 days instead.',
      'too-long':
        'That range was not used: it is longer than 400 days. Showing the last 30 days instead.',
    });
    expect(screenTopbarTexts(portuguese).rangeNotices.future).toContain('termina depois de hoje');
  });
});
