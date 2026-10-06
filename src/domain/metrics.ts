const COUNT_FORMAT = new Intl.NumberFormat('en-US');
const PERCENT_FORMAT = new Intl.NumberFormat('en-US', {
  style: 'percent',
  maximumFractionDigits: 1,
});
const ONE_DECIMAL = new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 });
const MINUS_SIGN = '−';
export const NO_VALUE = '—';

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

export function formatChange(change: number | null): string {
  if (change === null) {
    return NO_VALUE;
  }
  return signed(change, PERCENT_FORMAT.format(Math.abs(change)));
}

export function formatPointChange(current: number | null, previous: number | null): string {
  if (current === null || previous === null) {
    return NO_VALUE;
  }
  const points = (current - previous) * 100;
  return `${signed(points, ONE_DECIMAL.format(Math.abs(points)))} pt`;
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
