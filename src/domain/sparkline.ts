export interface SparklineBox {
  readonly width: number;
  readonly height: number;
  readonly inset: number;
}

export type SparklineValue = number | null;

function rounded(value: number): number {
  return Math.round(value * 10) / 10;
}

function knownValues(values: readonly SparklineValue[]): readonly number[] {
  return values.filter((value): value is number => value !== null);
}

function segmentsOf(points: readonly (string | null)[]): readonly (readonly string[])[] {
  return points.reduce<readonly (readonly string[])[]>((segments, point) => {
    if (point === null) {
      return segments.at(-1)?.length === 0 ? segments : [...segments, []];
    }
    const last = segments.at(-1) ?? [];
    return [...segments.slice(0, -1), [...last, point]];
  }, []);
}

function drawable(segment: readonly string[]): string {
  return (segment.length === 1 ? [...segment, ...segment] : segment).join(' ');
}

export function sparklineSegments(
  values: readonly SparklineValue[],
  box: SparklineBox,
): readonly string[] {
  const series = values.length === 1 ? [...values, ...values] : values;
  const known = knownValues(series);
  const lowest = Math.min(...known);
  const span = Math.max(...known) - lowest;
  const height = box.height - 2 * box.inset;
  const step = box.width / Math.max(series.length - 1, 1);
  const points = series.map((value, index) => {
    if (value === null) {
      return null;
    }
    const y = span === 0 ? box.height / 2 : box.inset + (1 - (value - lowest) / span) * height;
    return [rounded(index * step), rounded(y)].join(',');
  });
  return segmentsOf(points)
    .filter((segment) => segment.length > 0)
    .map(drawable);
}
