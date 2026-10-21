import type { I18n } from '@/i18n/i18n';
import {
  countedSteps,
  type FunnelReport,
  type FunnelStep,
  stepTarget,
  worstTransition,
} from './funnel';
import { formatPercent } from './metrics';
import { type KpiView, type OverviewReport, overviewKpis } from './overview';
import { daysBetween, type Period } from './period';
import type { RequestsReport, RouteReport } from './requests';

export const LANDING_PREVIEW_RANGE = '30d';

export interface PreviewMeter {
  readonly subject: string;
  readonly value: string;
  readonly share: number;
}

export interface LandingPreviewView {
  readonly kpis: readonly KpiView[];
  readonly current: readonly number[];
  readonly previous: readonly number[];
  readonly dropOff: PreviewMeter | null;
  readonly failingWrite: PreviewMeter | null;
}

export interface LandingPreviewReports {
  readonly overview: OverviewReport;
  readonly funnelSteps: readonly FunnelStep[];
  readonly funnel: FunnelReport;
  readonly writes: RequestsReport;
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

const DECIMALS = 1;

function dropOffOf(
  steps: readonly FunnelStep[],
  report: FunnelReport,
  i18n: I18n,
): PreviewMeter | null {
  const worst = worstTransition(countedSteps(steps, report));
  if (worst === undefined || worst.continued === null) {
    return null;
  }
  return {
    subject: `${stepTarget(worst.from)} → ${stepTarget(worst.to)}`,
    value: i18n.t('funnel.continued', { share: formatPercent(worst.continued, i18n) }),
    share: worst.continued,
  };
}

function failureShare(route: RouteReport): number {
  return route.failed / route.total;
}

export function mostFailingWrite(routes: readonly RouteReport[]): RouteReport | undefined {
  const [most] = routes
    .filter((route) => route.failed > 0)
    .toSorted(
      (left, right) =>
        failureShare(right) - failureShare(left) ||
        right.failed - left.failed ||
        `${left.method} ${left.route}`.localeCompare(`${right.method} ${right.route}`),
    );
  return most;
}

function failingWriteOf(writes: RequestsReport, i18n: I18n): PreviewMeter | null {
  const most = mostFailingWrite(writes.routes);
  if (most === undefined) {
    return null;
  }
  const share = failureShare(most);
  return {
    subject: `${most.method} ${most.route}`,
    value: i18n.t('landing.preview.failed', { share: formatPercent(share, i18n) }),
    share,
  };
}

export function landingPreviewOf(
  reports: LandingPreviewReports,
  period: Period,
  today: string,
  conversionEvent: string | null,
  i18n: I18n,
): LandingPreviewView {
  const { overview } = reports;
  const compared = { days: daysBetween(period.from, period.to), endsToday: period.to === today };
  return {
    kpis: overviewKpis(overview, compared, conversionEvent, i18n),
    current: overview.kpis.visits.daily,
    previous: overview.previousDays?.map((day) => day.visits) ?? [],
    dropOff: dropOffOf(reports.funnelSteps, reports.funnel, i18n),
    failingWrite: failingWriteOf(reports.writes, i18n),
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
