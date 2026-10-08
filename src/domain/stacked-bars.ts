import { daySpan } from './chart-days';
import { PLOT_SIZE, plotY, roundCoordinate } from './chart-scale';

export interface BarSegment<Key extends string> {
  readonly day: number;
  readonly key: Key;
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

export interface StackedBars<Key extends string> {
  readonly segments: readonly BarSegment<Key>[];
  readonly separators: string;
}

interface Stack<Key extends string> extends StackedBars<Key> {
  readonly below: number;
}

function stackOf<Key extends string>(
  day: Readonly<Record<Key, number>>,
  index: number,
  count: number,
  keys: readonly Key[],
  top: number,
): StackedBars<Key> {
  const span = daySpan(index, count, 'bars');
  const x = roundCoordinate(span.start * PLOT_SIZE);
  const right = roundCoordinate(span.end * PLOT_SIZE);
  return keys
    .filter((key) => day[key] > 0)
    .reduce<Stack<Key>>(
      (stack, key) => {
        const bottom = plotY(stack.below, top);
        const above = stack.below + day[key];
        const y = plotY(above, top);
        const segment = {
          day: index,
          key,
          x,
          y,
          width: roundCoordinate(right - x),
          height: roundCoordinate(bottom - y),
        };
        const separator =
          stack.segments.length > 0 ? `M${String(x)},${String(bottom)}H${String(right)}` : '';
        return {
          segments: [...stack.segments, segment],
          separators: `${stack.separators}${separator}`,
          below: above,
        };
      },
      { segments: [], separators: '', below: 0 },
    );
}

export function stackedBars<Key extends string>(
  days: readonly Readonly<Record<Key, number>>[],
  keys: readonly Key[],
  top: number,
): StackedBars<Key> {
  const stacks = days.map((day, index) => stackOf(day, index, days.length, keys, top));
  return {
    segments: stacks.flatMap((stack) => stack.segments),
    separators: stacks.map((stack) => stack.separators).join(''),
  };
}
