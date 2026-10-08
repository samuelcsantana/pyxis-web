import { daySpan } from './chart-days';
import { PLOT_SIZE, plotY, roundCoordinate } from './chart-scale';

export type LineValue = number | null;

function pointAt(value: number, index: number, count: number, top: number): string {
  const x = roundCoordinate(daySpan(index, count, 'points').center * PLOT_SIZE);
  return `${String(x)},${String(plotY(value, top))}`;
}

function flatAcross(value: LineValue | undefined, top: number): string {
  if (value === undefined || value === null) {
    return '';
  }
  const y = String(plotY(value, top));
  return `M0,${y}L${String(PLOT_SIZE)},${y}`;
}

function isGap(point: string | null | undefined): boolean {
  return point === null || point === undefined;
}

export function linePath(
  values: readonly LineValue[],
  top: number,
  count: number = values.length,
): string {
  if (count === 1) {
    return flatAcross(values[0], top);
  }
  const points = values
    .slice(0, count)
    .map((value, index) => (value === null ? null : pointAt(value, index, count, top)));
  return points
    .map((point, index) => {
      if (point === null) {
        return '';
      }
      const startsSegment = isGap(points[index - 1]);
      if (startsSegment && isGap(points[index + 1])) {
        return `M${point}L${point}`;
      }
      return `${startsSegment ? 'M' : 'L'}${point}`;
    })
    .join('');
}
