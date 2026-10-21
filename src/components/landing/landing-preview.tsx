import { projectInitials } from '@/domain/admin';
import {
  type LandingPreviewView,
  type PreviewMeter,
  previewChartOf,
} from '@/domain/landing-preview';
import type { Tone } from '@/domain/metrics';
import { displayTag, type I18n } from '@/i18n/i18n';
import { DEMO_STORE, demoProjectNameOf } from '@/services/demo/demo-projects';
import { PreviewCountUp } from './preview-count-up';

export interface LandingPreviewProps {
  readonly view: LandingPreviewView;
  readonly i18n: I18n;
}

export const PREVIEW_ID = 'landing-preview';
const CHART_BOX = { width: 320, height: 96, top: 8 } as const;
const GRID_LINES = [0.25, 0.5, 0.75];
const PERCENT = 100;

const TONE_TEXT: Readonly<Record<Tone, string>> = {
  good: 'text-ok',
  bad: 'text-bad',
  neutral: 'text-muted',
};

function PreviewChart({ view }: { readonly view: LandingPreviewView }) {
  const chart = previewChartOf(view.current, view.previous, CHART_BOX);
  return (
    <svg
      viewBox={`0 0 ${String(CHART_BOX.width)} ${String(CHART_BOX.height + 2)}`}
      aria-hidden="true"
      className="h-auto w-full overflow-visible"
    >
      {GRID_LINES.map((fraction) => (
        <line
          key={fraction}
          x1={0}
          x2={CHART_BOX.width}
          y1={CHART_BOX.height * fraction}
          y2={CHART_BOX.height * fraction}
          className="stroke-line"
          strokeWidth={1}
        />
      ))}
      <polygon points={chart.area} className="landing-preview-late fill-accent opacity-15" />
      <polyline
        points={chart.previous}
        fill="none"
        className="stroke-field"
        strokeWidth={1.5}
        strokeDasharray="4 3"
      />
      <polyline
        points={chart.current}
        pathLength={1}
        fill="none"
        className="landing-preview-line stroke-accent"
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {chart.end === null ? null : (
        <circle
          cx={chart.end.x}
          cy={chart.end.y}
          r={3.5}
          className="landing-preview-late fill-accent stroke-card"
          strokeWidth={1.5}
        />
      )}
    </svg>
  );
}

function PreviewMeterRow({
  label,
  meter,
}: {
  readonly label: string;
  readonly meter: PreviewMeter | null;
}) {
  if (meter === null) {
    return null;
  }
  return (
    <div className="flex flex-col gap-1.5">
      <dt className="font-mono text-micro font-medium tracking-[0.08em] text-muted uppercase">
        {label}
      </dt>
      <dd>
        <code className="font-mono text-caption wrap-anywhere">{meter.subject}</code>
      </dd>
      <dd className="flex items-center gap-3">
        <span aria-hidden="true" className="h-1.5 grow overflow-hidden rounded-pill bg-soft">
          <span
            className="landing-preview-bar block h-full rounded-pill bg-bad"
            style={{ width: `${String(meter.share * PERCENT)}%` }}
          />
        </span>
        <span className="font-mono text-caption whitespace-nowrap text-bad tabular-nums">
          {meter.value}
        </span>
      </dd>
    </div>
  );
}

export function LandingPreview({ view, i18n }: LandingPreviewProps) {
  const { t } = i18n;
  const projectName = demoProjectNameOf(DEMO_STORE, t);
  return (
    <>
      <figure
        id={PREVIEW_ID}
        aria-label={t('landing.preview.label')}
        className="landing-preview flex flex-col gap-3.5 rounded-panel border border-line-strong bg-card p-4.5 text-ink shadow-raised"
      >
        <div className="flex items-center gap-2.5 text-caption text-muted">
          <span className="flex items-center gap-2 font-semibold text-ink">
            <span
              aria-hidden="true"
              className="flex size-5.5 items-center justify-center rounded-chip bg-ink text-micro font-bold text-card"
            >
              {projectInitials(projectName)}
            </span>
            {projectName}
          </span>
          <span className="ml-auto rounded-control border border-line px-2 py-0.5 text-xs">
            {t('landing.preview.range')}
          </span>
        </div>
        <p className="text-lg font-semibold tracking-tight">{t('screens.overview')}</p>
        <dl className="grid grid-cols-2 gap-2">
          {view.kpis.map((kpi) => (
            <div key={kpi.id} className="rounded-input border border-line px-3 py-2.5">
              <dt className="text-xs text-muted">{kpi.label}</dt>
              <dd data-count className="font-mono text-xl font-semibold tabular-nums">
                {kpi.value}
              </dd>
              <dd className={`text-xs font-semibold tabular-nums ${TONE_TEXT[kpi.tone]}`}>
                {kpi.change}
              </dd>
            </div>
          ))}
        </dl>
        <PreviewChart view={view} />
        <div className="flex flex-wrap gap-x-3.5 gap-y-1 text-xs text-muted">
          <span className="flex items-center gap-1.5">
            <span aria-hidden="true" className="h-0.5 w-3.5 rounded-pill bg-accent" />
            {t('landing.preview.current')}
          </span>
          <span className="flex items-center gap-1.5">
            <span aria-hidden="true" className="h-0.5 w-3.5 rounded-pill bg-field" />
            {t('landing.preview.previous')}
          </span>
        </div>
        <dl className="grid gap-3.5">
          <PreviewMeterRow label={t('landing.preview.dropOff')} meter={view.dropOff} />
          <PreviewMeterRow label={t('landing.preview.failingWrite')} meter={view.failingWrite} />
        </dl>
        <figcaption className="text-xs text-muted">{t('landing.preview.invented')}</figcaption>
      </figure>
      <PreviewCountUp targetId={PREVIEW_ID} locale={displayTag(i18n.locale)} />
    </>
  );
}
