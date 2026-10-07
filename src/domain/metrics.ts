const COUNT_FORMAT = new Intl.NumberFormat('en-US');
const PERCENT_FORMAT = new Intl.NumberFormat('en-US', {
  style: 'percent',
  maximumFractionDigits: 1,
});
const ONE_DECIMAL = new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 });
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

export function formatCount(value: number): string {
  return COUNT_FORMAT.format(value);
}

export function formatPercent(value: number | null): string {
  return value === null ? NO_VALUE : PERCENT_FORMAT.format(value);
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

export function formatChange(change: number | null): string {
  const shown = displayedChange(change);
  if (shown === null) {
    return NO_VALUE;
  }
  return signed(shown, PERCENT_FORMAT.format(Math.abs(shown)));
}

export function formatPointChange(current: number | null, previous: number | null): string {
  const points = displayedPointChange(current, previous);
  if (points === null) {
    return NO_VALUE;
  }
  if (points === 0) {
    return NO_CHANGE;
  }
  return `${signed(points, ONE_DECIMAL.format(Math.abs(points)))} pt`;
}

export function formatSignedCount(value: number): string {
  return signed(value, formatCount(Math.abs(value)));
}

export interface Change {
  readonly text: string;
  readonly trend: Trend;
}

export function countChange(current: number, previous: number): Change {
  const difference = current - previous;
  if (difference === 0) {
    return { text: NO_CHANGE, trend: 'flat' };
  }
  const absolute = formatSignedCount(difference);
  const shown = displayedChange(percentChange(current, previous));
  if (shown === null) {
    return { text: absolute, trend: 'flat' };
  }
  const meaningful = previous >= MIN_COMPARABLE_BASE && Math.abs(shown) >= MIN_MEANINGFUL_CHANGE;
  return {
    text: `${formatChange(shown)} (${absolute})`,
    trend: meaningful ? trendOf(shown) : 'flat',
  };
}

export function pointChange(current: number | null, previous: number | null, base: number): Change {
  const points = displayedPointChange(current, previous);
  const meaningful =
    points !== null && base >= MIN_COMPARABLE_BASE && Math.abs(points) >= MIN_MEANINGFUL_POINTS;
  return {
    text: formatPointChange(current, previous),
    trend: meaningful ? trendOf(points) : 'flat',
  };
}

export function formatQuantity(count: number, singular: string, plural: string): string {
  return `${formatCount(count)} ${count === 1 ? singular : plural}`;
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

export function eventLabel(name: string): string {
  const words = name.replaceAll('_', ' ');
  return words.charAt(0).toUpperCase() + words.slice(1);
}
