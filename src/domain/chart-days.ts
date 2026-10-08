export type DayLayout = 'points' | 'bars';

export type LabelAnchor = 'start' | 'middle' | 'end';

export interface DaySpan {
  readonly start: number;
  readonly center: number;
  readonly end: number;
}

export interface DayLabel {
  readonly date: string;
  readonly index: number;
  readonly at: number;
  readonly anchor: LabelAnchor;
}

export interface DayLabelSets {
  readonly narrow: readonly DayLabel[];
  readonly wide: readonly DayLabel[];
}

export const BAR_SHARE = 0.8;
export const NARROW_PLOT_WIDTH = 200;
export const WIDE_PLOT_WIDTH = 448;
export const DATE_LABEL_WIDTH = 40;
export const DATE_LABEL_GAP = 8;

const MIDDLE = 0.5;
const ANCHOR_SHIFT: Readonly<Record<LabelAnchor, number>> = { start: 0, middle: -MIDDLE, end: -1 };

export function daySpan(index: number, count: number, layout: DayLayout): DaySpan {
  if (layout === 'points') {
    const at = count > 1 ? index / (count - 1) : MIDDLE;
    return { start: at, center: at, end: at };
  }
  const band = 1 / count;
  const margin = (band * (1 - BAR_SHARE)) / 2;
  return {
    start: index * band + margin,
    center: (index + MIDDLE) * band,
    end: (index + 1) * band - margin,
  };
}

function placed(date: string, index: number, span: DaySpan, width: number): DayLabel {
  const halfLabel = DATE_LABEL_WIDTH * MIDDLE;
  if (span.center * width < halfLabel) {
    return { date, index, at: span.start, anchor: 'start' };
  }
  if (span.center * width + halfLabel > width) {
    return { date, index, at: span.end, anchor: 'end' };
  }
  return { date, index, at: span.center, anchor: 'middle' };
}

export function dayAt(fraction: number, count: number, layout: DayLayout): number | null {
  if (count === 0) {
    return null;
  }
  const inside = Math.min(Math.max(fraction, 0), 1);
  if (layout === 'points') {
    return Math.round(inside * (count - 1));
  }
  return Math.min(Math.floor(inside * count), count - 1);
}

export interface LabelBox {
  readonly left: number;
  readonly right: number;
}

export function labelBox(label: DayLabel, width: number): LabelBox {
  const left = label.at * width + ANCHOR_SHIFT[label.anchor] * DATE_LABEL_WIDTH;
  return { left, right: left + DATE_LABEL_WIDTH };
}

function labelsEvery(
  step: number,
  dates: readonly string[],
  layout: DayLayout,
  width: number,
): readonly DayLabel[] {
  const last = dates.length - 1;
  return dates.flatMap((date, index) =>
    (last - index) % step === 0
      ? [placed(date, index, daySpan(index, dates.length, layout), width)]
      : [],
  );
}

function apart(labels: readonly DayLabel[], width: number): boolean {
  return labels.reduce(
    (scan, label) => {
      const box = labelBox(label, width);
      return { right: box.right, apart: scan.apart && box.left - scan.right >= DATE_LABEL_GAP };
    },
    { right: Number.NEGATIVE_INFINITY, apart: true },
  ).apart;
}

function labelsFrom(
  step: number,
  dates: readonly string[],
  layout: DayLayout,
  width: number,
): readonly DayLabel[] {
  const labels = labelsEvery(step, dates, layout, width);
  return step >= dates.length || apart(labels, width)
    ? labels
    : labelsFrom(step + 1, dates, layout, width);
}

export function dayLabels(
  dates: readonly string[],
  layout: DayLayout,
  width: number,
): readonly DayLabel[] {
  return labelsFrom(1, dates, layout, width);
}

export function dayLabelSets(dates: readonly string[], layout: DayLayout): DayLabelSets {
  return {
    narrow: dayLabels(dates, layout, NARROW_PLOT_WIDTH),
    wide: dayLabels(dates, layout, WIDE_PLOT_WIDTH),
  };
}
