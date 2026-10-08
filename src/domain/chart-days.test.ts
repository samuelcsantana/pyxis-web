import { describe, expect, it } from 'vitest';
import {
  BAR_SHARE,
  DATE_LABEL_GAP,
  DATE_LABEL_WIDTH,
  dayAt,
  type DayLabel,
  type DayLayout,
  dayLabels,
  dayLabelSets,
  daySpan,
  labelBox,
  NARROW_PLOT_WIDTH,
  WIDE_PLOT_WIDTH,
} from './chart-days';

const LAYOUTS: readonly DayLayout[] = ['points', 'bars'];
const WIDTHS = [NARROW_PLOT_WIDTH, WIDE_PLOT_WIDTH] as const;
const LONGEST_PERIOD = 400;

function datesOf(count: number): readonly string[] {
  return Array.from({ length: count }, (_, index) => `day ${String(index)}`);
}

function rounded(labels: readonly DayLabel[]): readonly Omit<DayLabel, 'date'>[] {
  return labels.map(({ index, at, anchor }) => ({
    index,
    at: Math.round(at * 10_000) / 10_000,
    anchor,
  }));
}

describe('daySpan', () => {
  it('spreads the points of a line from the left edge to the right edge', () => {
    expect(daySpan(0, 3, 'points')).toEqual({ start: 0, center: 0, end: 0 });
    expect(daySpan(1, 3, 'points')).toEqual({ start: 0.5, center: 0.5, end: 0.5 });
    expect(daySpan(2, 3, 'points')).toEqual({ start: 1, center: 1, end: 1 });
  });

  it('puts the point of a single day in the middle', () => {
    expect(daySpan(0, 1, 'points')).toEqual({ start: 0.5, center: 0.5, end: 0.5 });
  });

  it('gives each bar its share of the day it stands in, centred', () => {
    const span = daySpan(1, 4, 'bars');
    expect(span.center).toBeCloseTo(0.375);
    expect(span.start).toBeCloseTo(0.275);
    expect(span.end).toBeCloseTo(0.475);
    expect(span.end - span.start).toBeCloseTo(BAR_SHARE / 4);
  });
});

describe('dayAt', () => {
  it('finds the nearest point of a line under the pointer', () => {
    expect(dayAt(0, 3, 'points')).toBe(0);
    expect(dayAt(0.24, 3, 'points')).toBe(0);
    expect(dayAt(0.26, 3, 'points')).toBe(1);
    expect(dayAt(1, 3, 'points')).toBe(2);
  });

  it('finds the day whose band the pointer is in for bars', () => {
    expect(dayAt(0.24, 4, 'bars')).toBe(0);
    expect(dayAt(0.26, 4, 'bars')).toBe(1);
    expect(dayAt(1, 4, 'bars')).toBe(3);
  });

  it('keeps a pointer past an edge on the first or the last day', () => {
    expect(dayAt(-0.2, 5, 'points')).toBe(0);
    expect(dayAt(1.3, 5, 'bars')).toBe(4);
  });

  it('finds the only day of a single-day chart, and none without days', () => {
    expect(dayAt(0.9, 1, 'points')).toBe(0);
    expect(dayAt(0.5, 0, 'bars')).toBeNull();
  });
});

describe('labelBox', () => {
  it('starts, centres or ends the label on its position', () => {
    expect(labelBox({ date: 'day 0', index: 0, at: 0, anchor: 'start' }, 200)).toEqual({
      left: 0,
      right: DATE_LABEL_WIDTH,
    });
    expect(labelBox({ date: 'day 3', index: 3, at: 0.5, anchor: 'middle' }, 200)).toEqual({
      left: 100 - DATE_LABEL_WIDTH / 2,
      right: 100 + DATE_LABEL_WIDTH / 2,
    });
    expect(labelBox({ date: 'day 6', index: 6, at: 1, anchor: 'end' }, 200)).toEqual({
      left: 200 - DATE_LABEL_WIDTH,
      right: 200,
    });
  });
});

describe('dayLabels', () => {
  it('labels nothing without days', () => {
    expect(dayLabels([], 'points', NARROW_PLOT_WIDTH)).toEqual([]);
  });

  it('centres the label of a single day', () => {
    expect(dayLabels(['2026-10-05'], 'points', NARROW_PLOT_WIDTH)).toEqual([
      { date: '2026-10-05', index: 0, at: 0.5, anchor: 'middle' },
    ]);
    expect(dayLabels(['2026-10-05'], 'bars', NARROW_PLOT_WIDTH)).toEqual([
      { date: '2026-10-05', index: 0, at: 0.5, anchor: 'middle' },
    ]);
  });

  it('labels every day when there is room, and every third day on a phone', () => {
    expect(dayLabels(datesOf(7), 'points', WIDE_PLOT_WIDTH)).toHaveLength(7);
    expect(rounded(dayLabels(datesOf(7), 'points', NARROW_PLOT_WIDTH))).toEqual([
      { index: 0, at: 0, anchor: 'start' },
      { index: 3, at: 0.5, anchor: 'middle' },
      { index: 6, at: 1, anchor: 'end' },
    ]);
  });

  it('keeps the last day and counts back from it', () => {
    expect(dayLabels(datesOf(30), 'points', NARROW_PLOT_WIDTH).map((label) => label.date)).toEqual([
      'day 9',
      'day 19',
      'day 29',
    ]);
    expect(rounded(dayLabels(datesOf(30), 'points', NARROW_PLOT_WIDTH))).toEqual([
      { index: 9, at: 0.3103, anchor: 'middle' },
      { index: 19, at: 0.6552, anchor: 'middle' },
      { index: 29, at: 1, anchor: 'end' },
    ]);
  });

  it('aligns a bar label at an edge with the side of its bar', () => {
    expect(rounded(dayLabels(datesOf(7), 'bars', NARROW_PLOT_WIDTH))).toEqual([
      { index: 0, at: 0.0143, anchor: 'start' },
      { index: 2, at: 0.3571, anchor: 'middle' },
      { index: 4, at: 0.6429, anchor: 'middle' },
      { index: 6, at: 0.9857, anchor: 'end' },
    ]);
  });

  describe.each(LAYOUTS)('as %s, for every period up to 400 days', (layout) => {
    it.each(WIDTHS)('never overlaps two labels nor leaves the plot at %i px', (width) => {
      for (const count of Array.from({ length: LONGEST_PERIOD }, (_, index) => index + 1)) {
        const labels = dayLabels(datesOf(count), layout, width);
        const boxes = labels.map((label) => labelBox(label, width));
        expect(labels.at(-1)?.index).toBe(count - 1);
        expect(boxes.every((box) => box.left >= 0 && box.right <= width)).toBe(true);
        expect(
          boxes.slice(1).every((box, position) => {
            const previous = boxes.at(position);
            return previous !== undefined && box.left - previous.right >= DATE_LABEL_GAP;
          }),
        ).toBe(true);
      }
    });
  });
});

describe('dayLabelSets', () => {
  it('labels at least as many days on a wide plot as on a phone', () => {
    for (const layout of LAYOUTS) {
      for (const count of [2, 7, 14, 30, 90, 365]) {
        const sets = dayLabelSets(datesOf(count), layout);
        expect(sets.wide.length).toBeGreaterThanOrEqual(sets.narrow.length);
      }
    }
    const week = datesOf(7);
    expect(dayLabelSets(week, 'points').narrow).toEqual(
      dayLabels(week, 'points', NARROW_PLOT_WIDTH),
    );
    expect(dayLabelSets(week, 'points').wide).toEqual(dayLabels(week, 'points', WIDE_PLOT_WIDTH));
  });
});
