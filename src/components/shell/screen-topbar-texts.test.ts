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

  it('says the project waits for its first event, in the language of the admin', () => {
    expect(screenTopbarTexts(english).waitingForTheFirstEvent).toBe('Waiting for the first event');
    expect(screenTopbarTexts(portuguese).waitingForTheFirstEvent).toBe(
      'Aguardando o primeiro evento',
    );
  });

  it('names every field the bar can filter by, with its values, hints and rules', () => {
    const fields = screenTopbarTexts(english).filterFields;

    expect(fields.map((field) => field.label)).toEqual([
      'Country',
      'Region',
      'City',
      'Device',
      'Browser',
      'System',
      'Channel',
      'Source',
      'Campaign',
      'Viewed page',
      'Had event',
    ]);
    expect(fields.find((field) => field.field === 'region')).toMatchObject({
      hint: 'Country and region code',
      placeholder: 'BR-SP',
      pattern: '([A-Z]{2})-([A-Z0-9]{1,3})',
      upperCase: true,
    });
    expect(fields.find((field) => field.field === 'event')?.pattern).toBe('[a-z][a-z0-9_]{0,63}');
    expect(fields.find((field) => field.field === 'path')).toMatchObject({
      pattern: '/.*',
      maxLength: 256,
    });
    expect(fields.find((field) => field.field === 'os')?.options?.[0]).toEqual({
      value: 'android',
      label: 'Android',
    });
    expect(fields.find((field) => field.field === 'channel')?.options).toHaveLength(7);
    expect(
      screenTopbarTexts(portuguese).filterFields.find((field) => field.field === 'device')
        ?.options?.[0],
    ).toEqual({ value: 'mobile', label: 'Celular' });
  });
});
