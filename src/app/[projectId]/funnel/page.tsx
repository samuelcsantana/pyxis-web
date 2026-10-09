import { BuildAFunnel } from '@/components/funnel/build-a-funnel';
import { FunnelEditor } from '@/components/funnel/funnel-editor';
import { FunnelModes } from '@/components/funnel/funnel-modes';
import { FunnelSegmentsPanel } from '@/components/funnel/funnel-segments-panel';
import { FunnelSteps } from '@/components/funnel/funnel-steps';
import { FUNNEL_SUBJECTS_ID, FunnelSubjects } from '@/components/funnel/funnel-subjects';
import { MainContent } from '@/components/shell/main-content';
import { withKeptParameters } from '@/components/shell/period-selector';
import { linkWith, screenHref, screenLabelKey } from '@/components/shell/screens';
import { Topbar } from '@/components/shell/topbar';
import { StatCard } from '@/components/ui/stat-card';
import {
  biggestDropOff,
  countedSteps,
  FUNNEL_MODES,
  type FunnelMode,
  funnelModeOf,
  funnelRows,
  type FunnelSearch,
  type FunnelStep,
  overallConversion,
  serializeSteps,
  timeToFinish,
} from '@/domain/funnel';
import {
  drillHeading,
  drillParameters,
  type FunnelDrill,
  type FunnelDrillSearch,
  type FunnelOutcome,
  type FunnelSubjectsPage,
  funnelDrillOf,
  funnelSubjectsView,
  withDrillLinks,
} from '@/domain/funnel-subjects';
import { funnelStepsOf } from '@/domain/funnel.schema';
import {
  type FunnelSegmentDimension,
  funnelSegmentDimensionOf,
  SEGMENT_PARAMETER,
} from '@/domain/funnel-segments';
import {
  describePeriod,
  type PeriodSearch,
  periodQuery,
  resolvePeriod,
  todayIn,
} from '@/domain/period';
import { getI18n } from '@/i18n/get-messages';
import type { I18n } from '@/i18n/i18n';
import { isDemoMode } from '@/lib/api-config';
import { projectOrNotFound, readOrSignIn } from '@/lib/current-admin';
import { screenMetadata } from '@/lib/screen-metadata';
import { DEMO_FUNNEL_STEPS, demoExampleFunnel } from '@/services/funnel/demo-funnel';
import { createFunnelService } from '@/services/funnel/funnel-service.factory';

export const generateMetadata = screenMetadata('funnel');

export interface FunnelPageProps {
  readonly params: Promise<{ readonly projectId: string }>;
  readonly searchParams: Promise<
    PeriodSearch & FunnelSearch & FunnelDrillSearch & { readonly [SEGMENT_PARAMETER]?: string }
  >;
}

const NEW_FUNNEL: readonly FunnelStep[] = [
  { type: 'page', path: '/' },
  { type: 'event', name: '' },
];

type Parameters = Readonly<Record<string, string>>;

function stepsParameter(steps: readonly FunnelStep[] | null): Parameters {
  return steps === null ? {} : { steps: serializeSteps(steps) };
}

function segmentKept(by: FunnelSegmentDimension): Parameters {
  return by === 'device' ? {} : { [SEGMENT_PARAMETER]: by };
}

function drillKept(drill: FunnelDrill | null): Parameters {
  return drill === null ? {} : drillParameters(drill.step, drill.outcome);
}

export default async function FunnelPage({ params, searchParams }: FunnelPageProps) {
  const { project } = await projectOrNotFound((await params).projectId);
  const search = await searchParams;
  const now = new Date();
  const period = resolvePeriod(search, project.timezone, now);
  const mode = funnelModeOf(search);
  const steps = funnelStepsOf(search) ?? (isDemoMode() ? demoExampleFunnel(project.id) : null);
  const basePath = screenHref(project.id, 'funnel');
  const linkTo = (parameters: Readonly<Record<string, string>>) =>
    `${basePath}?${withKeptParameters(periodQuery(period), parameters)}`;
  const editorKeep = { ...Object.fromEntries(new URLSearchParams(periodQuery(period))), mode };
  const drill = steps === null ? null : funnelDrillOf(search, steps.length);
  const by = funnelSegmentDimensionOf(search[SEGMENT_PARAMETER]);
  const range = { from: period.from, to: period.to };
  const service = createFunnelService();
  const [report, drilled, segments] =
    steps === null
      ? [null, null, null]
      : await Promise.all([
          readOrSignIn(() => service.funnel(project.id, range, mode, steps)),
          drill === null
            ? null
            : readOrSignIn(() => service.subjects(project.id, range, mode, steps, drill)).then(
                (page) => ({ drill, page }),
              ),
          mode === 'visit'
            ? readOrSignIn(() => service.segments(project.id, range, steps, by))
            : null,
        ]);
  const kept = { mode, ...stepsParameter(steps), ...segmentKept(by) };
  const drillHref = (parameters: Parameters) =>
    `${linkTo({ ...kept, ...parameters })}#${FUNNEL_SUBJECTS_ID}`;
  const i18n = await getI18n();
  return (
    <>
      <Topbar
        title={i18n.t(screenLabelKey('funnel'))}
        subtitle={i18n.t('funnel.page.subtitle', { project: project.name })}
        basePath={basePath}
        period={period}
        today={todayIn(project.timezone, now)}
        keep={{ ...kept, ...drillKept(drill) }}
        i18n={i18n}
      />
      <MainContent className="flex w-full max-w-310 flex-col gap-3.5 p-4 sm:gap-5 sm:px-8 sm:pt-7 sm:pb-12">
        <FunnelModes
          current={mode}
          label={i18n.t('funnel.page.countBy')}
          links={FUNNEL_MODES.map((target) => ({
            mode: target,
            label: i18n.t(`funnel.page.modes.${target}`),
            href: linkTo({ ...kept, mode: target, ...drillKept(drill) }),
          }))}
        />
        {steps === null || report === null ? (
          <>
            <BuildAFunnel
              exampleHref={linkTo({ mode, steps: serializeSteps(DEMO_FUNNEL_STEPS) })}
              i18n={i18n}
            />
            <FunnelEditor initialSteps={NEW_FUNNEL} action={basePath} keep={editorKeep} startOpen />
          </>
        ) : (
          <>
            <FunnelReportView
              counted={countedSteps(steps, report)}
              secondsToFinish={report.medianSecondsOverall}
              mode={mode}
              i18n={i18n}
              drill={drill}
              drillHref={(step, outcome) => drillHref(drillParameters(step, outcome))}
              subjects={
                drilled === null ? null : (
                  <FunnelSubjects
                    view={funnelSubjectsView(
                      drilled.page,
                      drillHeading(
                        countedSteps(steps, report).map((step) => step.count),
                        drilled.drill,
                        mode,
                        i18n,
                      ),
                      mode,
                      project.timezone,
                      (lookup) =>
                        linkWith(screenHref(project.id, 'timeline', periodQuery(period)), lookup),
                      i18n,
                    )}
                    olderHref={olderHref(drilled.page, drilled.drill, drillHref)}
                    newestHref={newestHref(drilled.drill, drillHref)}
                    closeHref={linkTo(kept)}
                  />
                )
              }
              editor={
                <FunnelEditor
                  key={serializeSteps(steps)}
                  initialSteps={steps}
                  action={basePath}
                  keep={editorKeep}
                  startOpen={false}
                />
              }
            />
            <FunnelSegmentsPanel
              by={by}
              report={segments}
              stepCount={steps.length}
              periodLabel={describePeriod(period, i18n)}
              hrefOf={(target) =>
                `${linkTo({ mode, ...stepsParameter(steps), ...segmentKept(target), ...drillKept(drill) })}#funnel-segments-heading`
              }
              i18n={i18n}
            />
          </>
        )}
      </MainContent>
    </>
  );
}

function olderHref(
  page: FunnelSubjectsPage,
  drill: FunnelDrill,
  drillHref: (parameters: Parameters) => string,
): string | null {
  return page.nextCursor === null
    ? null
    : drillHref({ ...drillParameters(drill.step, drill.outcome), cursor: page.nextCursor });
}

function newestHref(
  drill: FunnelDrill,
  drillHref: (parameters: Parameters) => string,
): string | null {
  return drill.cursor === null ? null : drillHref(drillParameters(drill.step, drill.outcome));
}

interface FunnelReportViewProps {
  readonly counted: ReturnType<typeof countedSteps>;
  readonly secondsToFinish: number | null;
  readonly mode: FunnelMode;
  readonly editor: React.ReactNode;
  readonly subjects: React.ReactNode;
  readonly drill: FunnelDrill | null;
  readonly drillHref: (step: number, outcome: FunnelOutcome) => string;
  readonly i18n: I18n;
}

function FunnelReportView({
  counted,
  secondsToFinish,
  mode,
  editor,
  subjects,
  drill,
  drillHref,
  i18n,
}: FunnelReportViewProps) {
  const overall = overallConversion(counted, mode, i18n);
  const drop = biggestDropOff(counted, i18n);
  const finish = timeToFinish(secondsToFinish, counted.length, i18n);
  return (
    <>
      {editor}
      <div className="grid gap-2.5 sm:grid-cols-[repeat(auto-fit,minmax(13.75rem,1fr))] sm:gap-4">
        <StatCard
          id="overall-conversion"
          label={i18n.t('funnel.page.overallConversion')}
          value={overall.value}
          note={overall.note}
        />
        <StatCard
          id="biggest-drop-off"
          label={i18n.t('funnel.page.biggestDropOff')}
          value={drop.value}
          note={drop.note}
        />
        {finish === null ? null : (
          <StatCard
            id="time-to-finish"
            label={i18n.t('funnel.timeToFinish')}
            value={finish.value}
            note={finish.note}
          />
        )}
      </div>
      <FunnelSteps
        rows={withDrillLinks(
          funnelRows(counted, i18n),
          counted.map((step) => step.count),
          drill,
          drillHref,
          i18n,
        )}
        mode={mode}
        i18n={i18n}
      />
      {subjects}
    </>
  );
}
