import type { ReactNode } from 'react';
import { OverviewReportView } from '@/components/overview/overview-report-view';
import { chosenGoal } from '@/domain/goals';
import { goalsSummaryResponseSchema } from '@/domain/goals.schema';
import { hasActivity, overviewKpis, plottableKpis } from '@/domain/overview';
import { chartMetric } from '@/domain/overview-chart';
import { overviewResponseSchema } from '@/domain/overview.schema';
import { daysBetween, todayIn } from '@/domain/period';
import type { SharedRequest } from '@/domain/shared-project';
import { timeOfDayResponseSchema } from '@/domain/time-of-day.schema';
import { sharedRowFilters } from '@/lib/row-filters';
import {
  type SharedAnswers,
  type SharedContext,
  sharedEmptyState,
  sharedPeriodLabel,
  sharedReport,
  sharedScopeOf,
} from './shared-context';

export function sharedOverviewRequests(context: SharedContext): readonly SharedRequest[] {
  const { scope } = sharedScopeOf(context);
  const chosen = chosenGoal(context.project.goals, context.search.goal, context.i18n);
  return [
    sharedReport(context, 'overview', 'overview', { ...scope, goal: chosen.askedId }),
    sharedReport(context, 'timeOfDay', 'time-of-day', scope),
    ...(context.project.goals.length === 0
      ? []
      : [sharedReport(context, 'summary', 'goals/summary', { ...scope, goal: null })]),
  ];
}

export function sharedOverviewView(context: SharedContext, answers: SharedAnswers): ReactNode {
  const { token, project, search, i18n, now } = context;
  const shared = sharedScopeOf(context);
  const report = overviewResponseSchema.parse(answers.overview);
  if (!hasActivity(report)) {
    return sharedEmptyState(context, 'overview', shared);
  }
  const chosen = chosenGoal(project.goals, search.goal, i18n);
  const summary =
    project.goals.length === 0 ? null : goalsSummaryResponseSchema.parse(answers.summary);
  const compared = {
    days: daysBetween(shared.period.from, shared.period.to),
    endsToday: shared.period.to === todayIn(project.timezone, now),
    filtered: shared.filtered,
  };
  const kpis = overviewKpis(report, compared, chosen.goal, project.currency, i18n);
  return (
    <OverviewReportView
      report={report}
      timeOfDay={timeOfDayResponseSchema.parse(answers.timeOfDay)}
      kpis={kpis}
      metric={chartMetric(search.metric, plottableKpis(kpis))}
      projectId={null}
      goals={project.goals}
      chosen={chosen}
      summary={summary}
      currency={project.currency}
      periodLabel={sharedPeriodLabel(context, shared)}
      endsToday={compared.endsToday}
      filteredHref={() => null}
      downloads={[]}
      rowFilter={sharedRowFilters(token, 'overview', search, shared.filters, i18n)}
      i18n={i18n}
    />
  );
}
