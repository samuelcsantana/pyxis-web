import { daySpan } from './chart-days';
import { PLOT_SIZE, plotY, roundCoordinate } from './chart-scale';

export interface AreaShape {
  readonly line: string;
  readonly area: string;
}

const NO_SHAPE: AreaShape = { line: '', area: '' };

export function areaShape(values: readonly number[], top: number): AreaShape {
  if (values.length === 0) {
    return NO_SHAPE;
  }
  const series = values.length === 1 ? [...values, ...values] : values;
  const points = series.map((value, index) => {
    const x = roundCoordinate(daySpan(index, series.length, 'points').center * PLOT_SIZE);
    return `${String(x)},${String(plotY(value, top))}`;
  });
  const line = `M${points.join('L')}`;
  return {
    line,
    area: `${line}L${String(PLOT_SIZE)},${String(PLOT_SIZE)}L0,${String(PLOT_SIZE)}Z`,
  };
}
