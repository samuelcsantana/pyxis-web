import { describe, expect, it } from 'vitest';
import {
  barWidth,
  countChange,
  eventLabel,
  formatChange,
  formatCount,
  formatPercent,
  formatPointChange,
  formatQuantity,
  formatSignedCount,
  MIN_COMPARABLE_BASE,
  NO_CHANGE,
  NO_VALUE,
  percentChange,
  pointChange,
  rate,
  toneOf,
  trendOf,
} from './metrics';

describe('rate and percentChange', () => {
  it('divide when there is something to divide by', () => {
    expect(rate(61, 2524)).toBeCloseTo(0.0242, 4);
    expect(percentChange(4758, 4233)).toBeCloseTo(0.124, 3);
  });

  it('answer null on a zero denominator instead of NaN or Infinity', () => {
    expect(rate(0, 0)).toBeNull();
    expect(percentChange(12, 0)).toBeNull();
  });
});

describe('formatters', () => {
  it('group thousands', () => {
    expect(formatCount(4758)).toBe('4,758');
  });

  it('show a percentage with one decimal at most, and a dash for nothing', () => {
    expect(formatPercent(0.0242)).toBe('2.4%');
    expect(formatPercent(null)).toBe(NO_VALUE);
  });

  it('sign a change with a plus, a true minus or nothing', () => {
    expect(formatChange(0.124)).toBe('+12.4%');
    expect(formatChange(-0.05)).toBe('−5.0%');
    expect(formatChange(0)).toBe('0.0%');
    expect(formatChange(null)).toBe(NO_VALUE);
  });

  it('show a change that rounds to zero as no change, without a sign', () => {
    expect(formatChange(0.0004)).toBe('0.0%');
    expect(formatChange(-0.0004)).toBe('0.0%');
    expect(formatPointChange(0.03001, 0.03)).toBe(NO_CHANGE);
    expect(formatPointChange(0.03, 0.03004)).toBe(NO_CHANGE);
  });

  it('give a change of rates in percentage points', () => {
    expect(formatPointChange(0.024, 0.027)).toBe('−0.3 pt');
    expect(formatPointChange(0.03, 0.01)).toBe('+2.0 pt');
    expect(formatPointChange(0.02, 0.02)).toBe(NO_CHANGE);
    expect(formatPointChange(null, 0.02)).toBe(NO_VALUE);
    expect(formatPointChange(0.02, null)).toBe(NO_VALUE);
  });
});

describe('formatSignedCount', () => {
  it('signs a difference of counts and groups its thousands', () => {
    expect(formatSignedCount(1525)).toBe('+1,525');
    expect(formatSignedCount(-3)).toBe('−3');
  });
});

describe('countChange', () => {
  it('gives the percentage and the difference, judged when the base is large enough', () => {
    expect(countChange(4758, 4233)).toEqual({ text: '+12.4% (+525)', trend: 'up' });
    expect(countChange(90, 100)).toEqual({ text: '−10.0% (−10)', trend: 'down' });
  });

  it('says no change when the counts are equal', () => {
    expect(countChange(0, 0)).toEqual({ text: NO_CHANGE, trend: 'flat' });
    expect(countChange(42, 42)).toEqual({ text: NO_CHANGE, trend: 'flat' });
  });

  it('gives only the difference when there was nothing before', () => {
    expect(countChange(3, 0)).toEqual({ text: '+3', trend: 'flat' });
  });

  it(`does not judge a change over fewer than ${String(MIN_COMPARABLE_BASE)} before`, () => {
    expect(countChange(5, 4)).toEqual({ text: '+25.0% (+1)', trend: 'flat' });
    expect(countChange(MIN_COMPARABLE_BASE + 5, MIN_COMPARABLE_BASE)).toEqual({
      text: '+25.0% (+5)',
      trend: 'up',
    });
  });

  it('does not judge a change under one percent', () => {
    expect(countChange(1009, 1000)).toEqual({ text: '+0.9% (+9)', trend: 'flat' });
    expect(countChange(1010, 1000)).toEqual({ text: '+1.0% (+10)', trend: 'up' });
    expect(countChange(10001, 10000)).toEqual({ text: '0.0% (+1)', trend: 'flat' });
  });
});

describe('pointChange', () => {
  it('judges a move of half a point or more over enough writes', () => {
    expect(pointChange(0.03, 0.025, 100)).toEqual({ text: '+0.5 pt', trend: 'up' });
    expect(pointChange(0.02, 0.03, 100)).toEqual({ text: '−1.0 pt', trend: 'down' });
  });

  it('does not judge a move under half a point', () => {
    expect(pointChange(0.024, 0.027, 2500)).toEqual({ text: '−0.3 pt', trend: 'flat' });
  });

  it(`does not judge rates over fewer than ${String(MIN_COMPARABLE_BASE)} writes`, () => {
    expect(pointChange(0.1, 0, MIN_COMPARABLE_BASE - 1)).toEqual({
      text: '+10.0 pt',
      trend: 'flat',
    });
  });

  it('says no change, or nothing, when there is no move or nothing to compare', () => {
    expect(pointChange(0.02, 0.02, 100)).toEqual({ text: NO_CHANGE, trend: 'flat' });
    expect(pointChange(null, 0.02, 0)).toEqual({ text: NO_VALUE, trend: 'flat' });
  });
});

describe('formatQuantity', () => {
  it('names one thing in the singular and any other count in the plural', () => {
    expect(formatQuantity(1, 'day', 'days')).toBe('1 day');
    expect(formatQuantity(30, 'day', 'days')).toBe('30 days');
    expect(formatQuantity(1200, 'visit', 'visits')).toBe('1,200 visits');
  });
});

describe('barWidth', () => {
  it('measures a value against the largest one, as a CSS width', () => {
    expect(barWidth(50, 200)).toBe('25.0%');
    expect(barWidth(0, 0)).toBe('0.0%');
  });
});

describe('toneOf', () => {
  it('is good when the figure moves the way that is better', () => {
    expect(toneOf('up', 'up')).toBe('good');
    expect(toneOf('down', 'down')).toBe('good');
  });

  it('is bad when it moves the other way, and neutral when it holds', () => {
    expect(toneOf('down', 'up')).toBe('bad');
    expect(toneOf('up', 'down')).toBe('bad');
    expect(toneOf('flat', 'up')).toBe('neutral');
  });
});

describe('trendOf', () => {
  it('reads up, down or flat', () => {
    expect(trendOf(0.1)).toBe('up');
    expect(trendOf(-0.1)).toBe('down');
    expect(trendOf(0)).toBe('flat');
    expect(trendOf(null)).toBe('flat');
  });
});

describe('eventLabel', () => {
  it('turns an event name into a sentence-case label', () => {
    expect(eventLabel('calculator_result_shown')).toBe('Calculator result shown');
    expect(eventLabel('signup')).toBe('Signup');
  });

  it('writes the usual acronyms in capitals wherever they sit in the name', () => {
    expect(eventLabel('cta_clicked')).toBe('CTA clicked');
    expect(eventLabel('cta')).toBe('CTA');
    expect(eventLabel('export_csv')).toBe('Export CSV');
    expect(eventLabel('user_id_set')).toBe('User ID set');
    expect(eventLabel('Api_Key_created')).toBe('API Key created');
  });

  it('leaves words that only contain an acronym alone', () => {
    expect(eventLabel('identify_failed')).toBe('Identify failed');
    expect(eventLabel('apiary_opened')).toBe('Apiary opened');
  });
});
