import { describe, expect, it } from 'vitest';
import {
  barWidth,
  eventLabel,
  formatChange,
  formatCount,
  formatPercent,
  formatPointChange,
  formatQuantity,
  NO_VALUE,
  percentChange,
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
    expect(formatChange(-0.05)).toBe('−5%');
    expect(formatChange(0)).toBe('0%');
    expect(formatChange(null)).toBe(NO_VALUE);
  });

  it('show a change that rounds to zero as no change, without a sign', () => {
    expect(formatChange(0.0004)).toBe('0%');
    expect(formatChange(-0.0004)).toBe('0%');
    expect(formatPointChange(0.03001, 0.03)).toBe('0 pt');
    expect(formatPointChange(0.03, 0.03004)).toBe('0 pt');
  });

  it('give a change of rates in percentage points', () => {
    expect(formatPointChange(0.024, 0.027)).toBe('−0.3 pt');
    expect(formatPointChange(0.03, 0.01)).toBe('+2 pt');
    expect(formatPointChange(0.02, 0.02)).toBe('0 pt');
    expect(formatPointChange(null, 0.02)).toBe(NO_VALUE);
    expect(formatPointChange(0.02, null)).toBe(NO_VALUE);
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
    expect(eventLabel('cta')).toBe('Cta');
  });
});
