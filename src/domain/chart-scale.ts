export const PLOT_SIZE = 1000;

const TARGET_INTERVALS = 4;
const SMALLEST_TOP = 1;
const SMALLEST_STEP = 1;
const DECIMAL_BASE = 10;
const NICE_FACTORS = [1, 2, 5] as const;
const COORDINATE_PRECISION = 10;
const PERCENT = 100;
const PERCENT_PRECISION = 100;

export interface ValueAxis {
  readonly top: number;
  readonly ticks: readonly number[];
}

function niceStep(rough: number): number {
  if (rough <= SMALLEST_STEP) {
    return SMALLEST_STEP;
  }
  const magnitude = DECIMAL_BASE ** Math.floor(Math.log10(rough));
  const factor = NICE_FACTORS.find((candidate) => candidate * magnitude >= rough) ?? DECIMAL_BASE;
  return factor * magnitude;
}

export function valueAxis(values: readonly number[]): ValueAxis {
  const highest = Math.max(SMALLEST_TOP, ...values);
  const step = niceStep(highest / TARGET_INTERVALS);
  const top = Math.ceil(highest / step) * step;
  return {
    top,
    ticks: Array.from({ length: top / step + 1 }, (_, index) => index * step),
  };
}

export function roundCoordinate(value: number): number {
  return Math.round(value * COORDINATE_PRECISION) / COORDINATE_PRECISION;
}

export function plotY(value: number, top: number): number {
  return roundCoordinate(PLOT_SIZE * (1 - value / top));
}

export function cssPercent(fraction: number): string {
  return `${String(Math.round(fraction * PERCENT * PERCENT_PRECISION) / PERCENT_PRECISION)}%`;
}

export function offsetFromTop(value: number, top: number): string {
  return cssPercent(1 - value / top);
}

export function gridLines(axis: ValueAxis): string {
  return axis.ticks
    .map((tick) => `M0,${String(plotY(tick, axis.top))}H${String(PLOT_SIZE)}`)
    .join('');
}
