import type { ReactNode } from 'react';
import { FunnelEditor } from '@/components/funnel/funnel-editor';
import { FunnelModes } from '@/components/funnel/funnel-modes';
import { FunnelReportView } from '@/components/funnel/funnel-report-view';
import { FunnelSegmentsPanel } from '@/components/funnel/funnel-segments-panel';
import { withKeptParameters } from '@/components/shell/kept-parameters';
import { withDashboardFilters } from '@/domain/dashboard-filters';
import {
  countedSteps,
  FUNNEL_MODES,
  type FunnelStep,
  funnelModeOf,
  serializeSteps,
} from '@/domain/funnel';
import { funnelResponseSchema, funnelStepsOf } from '@/domain/funnel.schema';
import { funnelSegmentDimensionOf, SEGMENT_PARAMETER } from '@/domain/funnel-segments';
import { funnelSegmentsResponseSchema } from '@/domain/funnel-segments.schema';
import { periodQuery } from '@/domain/period';
import { type SharedRequest, sharedPageHref } from '@/domain/shared-project';
import { isDemoMode } from '@/lib/api-config';
import { DEMO_STORE } from '@/services/demo/demo-projects';
import { demoExampleFunnel } from '@/services/funnel/demo-funnel';
import {
  type SharedAnswers,
  type SharedContext,
  sharedPeriodLabel,
  sharedReport,
  sharedScopeOf,
} from './shared-context';

const NEW_FUNNEL: readonly FunnelStep[] = [
  { type: 'page', path: '/' },
  { type: 'event', name: '' },
];

type Parameters = Readonly<Record<string, string>>;

function sharedStepsOf(context: SharedContext): readonly FunnelStep[] | null {
  return funnelStepsOf(context.search) ?? (isDemoMode() ? demoExampleFunnel(DEMO_STORE.id) : null);
}

function funnelChoice(context: SharedContext) {
  const mode = funnelModeOf(context.search);
  const segment = context.search[SEGMENT_PARAMETER];
  const by = funnelSegmentDimensionOf(typeof segment === 'string' ? segment : undefined);
  return { mode, by, steps: sharedStepsOf(context) };
}

export function sharedFunnelRequests(context: SharedContext): readonly SharedRequest[] {
  const { mode, by, steps } = funnelChoice(context);
  if (steps === null) {
    return [];
  }
  const { scope } = sharedScopeOf(context);
  const serialized = serializeSteps(steps);
  return [
    sharedReport(context, 'funnel', 'funnel', scope, { mode, steps: serialized }),
    ...(mode === 'visit'
      ? [sharedReport(context, 'segments', 'funnel/segments', scope, { steps: serialized, by })]
      : []),
  ];
}

export function sharedFunnelView(context: SharedContext, answers: SharedAnswers): ReactNode {
  const { token, project, search, i18n } = context;
  const { mode, by, steps } = funnelChoice(context);
  const shared = sharedScopeOf(context);
  const basePath = sharedPageHref(token, 'funnel');
  const filteredQuery = withDashboardFilters(periodQuery(shared.period), shared.filters);
  const linkTo = (parameters: Parameters) =>
    `${basePath}?${withKeptParameters(filteredQuery, parameters)}`;
  const editorKeep = { ...Object.fromEntries(new URLSearchParams(filteredQuery)), mode };
  const addressSteps = funnelStepsOf(search);
  const funnelKept: Parameters = {
    ...(search.mode === undefined ? {} : { mode }),
    ...(addressSteps === null ? {} : { steps: serializeSteps(addressSteps) }),
  };
  const modes = (
    <FunnelModes
      current={mode}
      label={i18n.t('funnel.page.countBy')}
      links={FUNNEL_MODES.map((target) => ({
        mode: target,
        label: i18n.t(`funnel.page.modes.${target}`),
        href: linkTo({ ...funnelKept, mode: target }),
      }))}
    />
  );
  if (steps === null) {
    return (
      <>
        {modes}
        <FunnelEditor initialSteps={NEW_FUNNEL} action={basePath} keep={editorKeep} startOpen />
      </>
    );
  }
  const report = funnelResponseSchema.parse(answers.funnel);
  const counted = countedSteps(steps, report);
  return (
    <>
      {modes}
      <FunnelReportView
        counted={counted}
        secondsToFinish={report.medianSecondsOverall}
        currency={project.currency}
        mode={mode}
        i18n={i18n}
        drill={null}
        drillHref={null}
        subjects={null}
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
        report={mode === 'visit' ? funnelSegmentsResponseSchema.parse(answers.segments) : null}
        stepCount={steps.length}
        periodLabel={sharedPeriodLabel(context, shared)}
        hrefOf={(target) =>
          `${linkTo({ ...funnelKept, ...(target === 'device' ? {} : { [SEGMENT_PARAMETER]: target }) })}#funnel-segments-heading`
        }
        i18n={i18n}
      />
    </>
  );
}
