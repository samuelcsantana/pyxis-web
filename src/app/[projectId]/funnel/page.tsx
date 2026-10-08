import { BuildAFunnel } from '@/components/funnel/build-a-funnel';
import { FunnelEditor } from '@/components/funnel/funnel-editor';
import { FunnelModes } from '@/components/funnel/funnel-modes';
import { FunnelSteps } from '@/components/funnel/funnel-steps';
import { MainContent } from '@/components/shell/main-content';
import { withKeptParameters } from '@/components/shell/period-selector';
import { screenHref } from '@/components/shell/screens';
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
import { funnelStepsOf } from '@/domain/funnel.schema';
import { type PeriodSearch, periodQuery, resolvePeriod, todayIn } from '@/domain/period';
import { getI18n } from '@/i18n/get-messages';
import type { I18n } from '@/i18n/i18n';
import { isDemoMode } from '@/lib/api-config';
import { projectOrNotFound, readOrSignIn } from '@/lib/current-admin';
import { screenMetadata } from '@/lib/screen-metadata';
import { chosenTheme } from '@/lib/theme-cookie';
import { DEMO_FUNNEL_STEPS, demoExampleFunnel } from '@/services/funnel/demo-funnel';
import { createFunnelService } from '@/services/funnel/funnel-service.factory';

export const generateMetadata = screenMetadata('funnel');

export interface FunnelPageProps {
  readonly params: Promise<{ readonly projectId: string }>;
  readonly searchParams: Promise<PeriodSearch & FunnelSearch>;
}

const MODE_LABELS: Readonly<Record<FunnelMode, string>> = {
  visit: 'Per visit',
  user: 'Per person',
};

const NEW_FUNNEL: readonly FunnelStep[] = [
  { type: 'page', path: '/' },
  { type: 'event', name: '' },
];

function stepsParameter(steps: readonly FunnelStep[] | null): Readonly<Record<string, string>> {
  return steps === null ? {} : { steps: serializeSteps(steps) };
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
  const report =
    steps === null
      ? null
      : await readOrSignIn(() =>
          createFunnelService().funnel(
            project.id,
            { from: period.from, to: period.to },
            mode,
            steps,
          ),
        );
  const i18n = await getI18n();
  return (
    <>
      <Topbar
        title="Funnel"
        subtitle={`Where people continue and where they drop off in ${project.name}`}
        basePath={basePath}
        period={period}
        today={todayIn(project.timezone, now)}
        theme={await chosenTheme()}
        keep={{ mode, ...stepsParameter(steps) }}
        i18n={i18n}
      />
      <MainContent className="flex w-full max-w-310 flex-col gap-3.5 p-4 sm:gap-5 sm:px-8 sm:pt-7 sm:pb-12">
        <FunnelModes
          current={mode}
          links={FUNNEL_MODES.map((target) => ({
            mode: target,
            label: MODE_LABELS[target],
            href: linkTo({ mode: target, ...stepsParameter(steps) }),
          }))}
        />
        {steps === null || report === null ? (
          <>
            <BuildAFunnel
              exampleHref={linkTo({ mode, steps: serializeSteps(DEMO_FUNNEL_STEPS) })}
            />
            <FunnelEditor initialSteps={NEW_FUNNEL} action={basePath} keep={editorKeep} startOpen />
          </>
        ) : (
          <FunnelReportView
            counted={countedSteps(steps, report)}
            secondsToFinish={report.medianSecondsOverall}
            mode={mode}
            i18n={i18n}
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
        )}
      </MainContent>
    </>
  );
}

interface FunnelReportViewProps {
  readonly counted: ReturnType<typeof countedSteps>;
  readonly secondsToFinish: number | null;
  readonly mode: FunnelMode;
  readonly editor: React.ReactNode;
  readonly i18n: I18n;
}

function FunnelReportView({ counted, secondsToFinish, mode, editor, i18n }: FunnelReportViewProps) {
  const overall = overallConversion(counted, mode, i18n);
  const drop = biggestDropOff(counted, i18n);
  const finish = timeToFinish(secondsToFinish, counted.length, i18n);
  return (
    <>
      {editor}
      <div className="grid gap-2.5 sm:grid-cols-[repeat(auto-fit,minmax(13.75rem,1fr))] sm:gap-4">
        <StatCard
          id="overall-conversion"
          label="Overall conversion"
          value={overall.value}
          note={overall.note}
        />
        <StatCard
          id="biggest-drop-off"
          label="Biggest drop-off"
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
      <FunnelSteps rows={funnelRows(counted, i18n)} mode={mode} />
    </>
  );
}
