import type { I18n } from '@/i18n/i18n';

const MINUS_SIGN = '−';
const CHANGE_PRECISION = 1000;
const POINT_PRECISION = 10;
const PERCENT_POINTS = 100;
export const NO_VALUE = '—';
export const NO_CHANGE = 'no change';
export const MIN_COMPARABLE_BASE = 20;
export const MIN_MEANINGFUL_CHANGE = 0.01;
export const MIN_MEANINGFUL_POINTS = 0.5;

export function rate(part: number, total: number): number | null {
  return total === 0 ? null : part / total;
}

export function percentChange(current: number, previous: number): number | null {
  return previous === 0 ? null : (current - previous) / previous;
}

export function formatCount(value: number, i18n: I18n): string {
  return i18n.format.count(value);
}

export function formatPercent(value: number | null, i18n: I18n): string {
  return value === null ? NO_VALUE : i18n.format.percent(value);
}

function signed(value: number, text: string): string {
  if (value > 0) {
    return `+${text}`;
  }
  return value < 0 ? `${MINUS_SIGN}${text}` : text;
}

function roundTo(value: number, precision: number): number {
  return Math.round(value * precision) / precision;
}

export function displayedChange(change: number | null): number | null {
  return change === null ? null : roundTo(change, CHANGE_PRECISION);
}

export function displayedPointChange(
  current: number | null,
  previous: number | null,
): number | null {
  if (current === null || previous === null) {
    return null;
  }
  return roundTo((current - previous) * PERCENT_POINTS, POINT_PRECISION);
}

export function formatChange(change: number | null, i18n: I18n): string {
  const shown = displayedChange(change);
  if (shown === null) {
    return NO_VALUE;
  }
  return signed(shown, i18n.format.percent(Math.abs(shown)));
}

export function formatPointChange(
  current: number | null,
  previous: number | null,
  i18n: I18n,
): string {
  const points = displayedPointChange(current, previous);
  if (points === null) {
    return NO_VALUE;
  }
  if (points === 0) {
    return NO_CHANGE;
  }
  return i18n.t('units.points', {
    points: signed(points, i18n.format.decimal(Math.abs(points))),
  });
}

export function formatSignedCount(value: number, i18n: I18n): string {
  return signed(value, formatCount(Math.abs(value), i18n));
}

export interface Change {
  readonly text: string;
  readonly trend: Trend;
}

export function countChange(current: number, previous: number, i18n: I18n): Change {
  const difference = current - previous;
  if (difference === 0) {
    return { text: NO_CHANGE, trend: 'flat' };
  }
  const absolute = formatSignedCount(difference, i18n);
  const shown = displayedChange(percentChange(current, previous));
  if (shown === null) {
    return { text: absolute, trend: 'flat' };
  }
  const meaningful = previous >= MIN_COMPARABLE_BASE && Math.abs(shown) >= MIN_MEANINGFUL_CHANGE;
  return {
    text: `${formatChange(shown, i18n)} (${absolute})`,
    trend: meaningful ? trendOf(shown) : 'flat',
  };
}

export function pointChange(
  current: number | null,
  previous: number | null,
  base: number,
  i18n: I18n,
): Change {
  const points = displayedPointChange(current, previous);
  const meaningful =
    points !== null && base >= MIN_COMPARABLE_BASE && Math.abs(points) >= MIN_MEANINGFUL_POINTS;
  return {
    text: formatPointChange(current, previous, i18n),
    trend: meaningful ? trendOf(points) : 'flat',
  };
}

export function barWidth(value: number, max: number): string {
  const percent = max === 0 ? 0 : (value / max) * 100;
  return `${percent.toFixed(1)}%`;
}

export type Trend = 'up' | 'down' | 'flat';

export function trendOf(change: number | null): Trend {
  if (change === null || change === 0) {
    return 'flat';
  }
  return change > 0 ? 'up' : 'down';
}

export type Tone = 'good' | 'bad' | 'neutral';

export function toneOf(trend: Trend, betterWhen: Exclude<Trend, 'flat'>): Tone {
  if (trend === 'flat') {
    return 'neutral';
  }
  return trend === betterWhen ? 'good' : 'bad';
}

const LABEL_ACRONYMS: ReadonlySet<string> = new Set([
  'api',
  'cta',
  'csv',
  'faq',
  'id',
  'pdf',
  'sms',
  'url',
]);

function labelWord(word: string, index: number): string {
  if (LABEL_ACRONYMS.has(word.toLowerCase())) {
    return word.toUpperCase();
  }
  return index === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word;
}

export function eventLabel(name: string): string {
  return name.split('_').map(labelWord).join(' ');
}
