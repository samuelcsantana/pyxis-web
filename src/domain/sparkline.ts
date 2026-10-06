export interface SparklineBox {
  readonly width: number;
  readonly height: number;
  readonly inset: number;
}

function rounded(value: number): number {
  return Math.round(value * 10) / 10;
}

export function sparklinePoints(values: readonly number[], box: SparklineBox): string {
  const series = values.length === 1 ? [...values, ...values] : values;
  const lowest = Math.min(...series);
  const span = Math.max(...series) - lowest;
  const drawable = box.height - 2 * box.inset;
  const step = box.width / Math.max(series.length - 1, 1);
  return series
    .map((value, index) => {
      const y = span === 0 ? box.height / 2 : box.inset + (1 - (value - lowest) / span) * drawable;
      return [rounded(index * step), rounded(y)].join(',');
    })
    .join(' ');
}
