import type { I18n } from '@/i18n/i18n';
import { formatCount } from './metrics';
import { type KpiView, type OverviewReport, overviewKpis } from './overview';
import { daysBetween, type Period } from './period';

export const LANDING_PREVIEW_RANGE = '30d';
const TOP_PAGES_SHOWN = 3;
const DECIMALS = 1;

export interface LandingPreviewPage {
  readonly path: string;
  readonly views: string;
  readonly share: number;
}

export interface LandingPreviewView {
  readonly kpis: readonly KpiView[];
  readonly current: readonly number[];
  readonly previous: readonly number[];
  readonly topPages: readonly LandingPreviewPage[];
}

export interface PreviewChartBox {
  readonly width: number;
  readonly height: number;
  readonly top: number;
}

export interface PreviewPoint {
  readonly x: number;
  readonly y: number;
}

export interface PreviewChart {
  readonly current: string;
  readonly previous: string;
  readonly area: string;
  readonly end: PreviewPoint | null;
}

export function landingPreviewOf(
  report: OverviewReport,
  period: Period,
  today: string,
  conversionEvent: string | null,
  i18n: I18n,
): LandingPreviewView {
  const compared = { days: daysBetween(period.from, period.to), endsToday: period.to === today };
  const pages = report.topPages.slice(0, TOP_PAGES_SHOWN);
  const most = Math.max(1, ...pages.map((page) => page.views));
  return {
    kpis: overviewKpis(report, compared, conversionEvent, i18n),
    current: report.kpis.visits.daily,
    previous: report.previousDays?.map((day) => day.visits) ?? [],
    topPages: pages.map((page) => ({
      path: page.path,
      views: formatCount(page.views, i18n),
      share: page.views / most,
    })),
  };
}

function rounded(value: number): number {
  return Number(value.toFixed(DECIMALS));
}

function pointsOf(
  values: readonly number[],
  box: PreviewChartBox,
  highest: number,
): readonly PreviewPoint[] {
  const step = box.width / Math.max(1, values.length - 1);
  const drawable = box.height - box.top;
  return values.map((value, index) => ({
    x: rounded(index * step),
    y: rounded(box.top + drawable * (1 - value / highest)),
  }));
}

function polyline(points: readonly PreviewPoint[]): string {
  return points.map((point) => `${String(point.x)},${String(point.y)}`).join(' ');
}

export function previewChartOf(
  current: readonly number[],
  previous: readonly number[],
  box: PreviewChartBox,
): PreviewChart {
  const highest = Math.max(1, ...current, ...previous);
  const points = pointsOf(current, box, highest);
  const end = points.at(-1) ?? null;
  const area =
    end === null
      ? ''
      : `${polyline(points)} ${String(end.x)},${String(box.height)} 0,${String(box.height)}`;
  return {
    current: polyline(points),
    previous: polyline(pointsOf(previous, box, highest)),
    area,
    end,
  };
}
