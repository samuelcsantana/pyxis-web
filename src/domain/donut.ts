export interface DonutSegment {
  readonly dashArray: string;
  readonly dashOffset: string;
}

const DECIMALS = 2;

export function withDonutSegments<Item extends { readonly fraction: number }>(
  items: readonly Item[],
  circumference: number,
): readonly (Item & DonutSegment)[] {
  return items.reduce<{ readonly drawn: readonly (Item & DonutSegment)[]; readonly start: number }>(
    (progress, item) => {
      const length = item.fraction * circumference;
      const segment: DonutSegment = {
        dashArray: `${length.toFixed(DECIMALS)} ${(circumference - length).toFixed(DECIMALS)}`,
        dashOffset: (-progress.start).toFixed(DECIMALS),
      };
      return {
        drawn: [...progress.drawn, { ...item, ...segment }],
        start: progress.start + length,
      };
    },
    { drawn: [], start: 0 },
  ).drawn;
}
