import type { I18n } from '@/i18n/i18n';
import { formatCount } from './metrics';
import type { PropertySummaryReport, PropertySummaryWire } from './property-summary.schema';

export type { PropertySummaryReport, PropertySummaryWire };

const NUMBER_TEXT = /^-?\d+(\.\d+)?([eE][+-]?\d+)?$/;

export function isNumberText(value: string): boolean {
  return NUMBER_TEXT.test(value) && Number.isFinite(Number(value));
}

export function isNumericKey(values: readonly string[]): boolean {
  return values.length > 0 && values.every(isNumberText);
}

export interface NumericFigures {
  readonly median: string;
  readonly middleHalf: string;
  readonly events: string;
}

export interface SummaryGroupRow extends NumericFigures {
  readonly value: string;
}

export interface PropertySummaryView {
  readonly overall: NumericFigures | null;
  readonly groups: readonly SummaryGroupRow[];
  readonly other: string | null;
}

interface Figures {
  readonly events: number;
  readonly median: number | null;
  readonly p25: number | null;
  readonly p75: number | null;
}

function numberOf(value: number, i18n: I18n): string {
  return Number.isInteger(value) ? formatCount(value, i18n) : i18n.format.decimal(value);
}

function figuresOf(figures: Figures, i18n: I18n): NumericFigures | null {
  if (figures.median === null || figures.p25 === null || figures.p75 === null) {
    return null;
  }
  return {
    median: numberOf(figures.median, i18n),
    middleHalf: i18n.t('propertySummary.range', {
      low: numberOf(figures.p25, i18n),
      high: numberOf(figures.p75, i18n),
    }),
    events: i18n.t('counts.event', { count: figures.events }),
  };
}

export function propertySummaryView(
  report: PropertySummaryReport,
  i18n: I18n,
): PropertySummaryView {
  return {
    overall: figuresOf(report.overall, i18n),
    groups: report.groups.flatMap((group) => {
      const figures = figuresOf(group, i18n);
      return figures === null ? [] : [{ value: group.value, ...figures }];
    }),
    other: report.otherCount === 0 ? null : formatCount(report.otherCount, i18n),
  };
}
