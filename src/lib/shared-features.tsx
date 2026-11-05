import type { ReactNode } from 'react';
import { FeaturesReportView } from '@/components/features/features-report-view';
import { withDashboardFilters } from '@/domain/dashboard-filters';
import { engagementResponseSchema } from '@/domain/engagement.schema';
import { featureKindOf, searchQueryOf } from '@/domain/features';
import { featuresResponseSchema } from '@/domain/features.schema';
import { periodQuery } from '@/domain/period';
import { type SharedRequest, sharedPageHref } from '@/domain/shared-project';
import { sharedRowFilters } from '@/lib/row-filters';
import {
  type SharedAnswers,
  type SharedContext,
  sharedPeriodLabel,
  sharedReport,
  sharedScopeOf,
} from './shared-context';

export function sharedFeaturesRequests(context: SharedContext): readonly SharedRequest[] {
  const { scope } = sharedScopeOf(context);
  const kind = featureKindOf(context.search);
  return [
    sharedReport(context, 'features', 'features', scope, { kind }),
    ...(kind === 'screens' ? [sharedReport(context, 'engagement', 'engagement', scope)] : []),
  ];
}

export function sharedFeaturesView(context: SharedContext, answers: SharedAnswers): ReactNode {
  const { token, search, i18n } = context;
  const shared = sharedScopeOf(context);
  const kind = featureKindOf(search);
  return (
    <FeaturesReportView
      kind={kind}
      query={searchQueryOf(search)}
      report={featuresResponseSchema.parse(answers.features)}
      engagement={kind === 'screens' ? engagementResponseSchema.parse(answers.engagement) : null}
      basePath={sharedPageHref(token, 'features')}
      filteredQuery={withDashboardFilters(periodQuery(shared.period), shared.filters)}
      periodLabel={sharedPeriodLabel(context, shared)}
      visitsHref={() => null}
      rowFilter={sharedRowFilters(token, 'features', search, shared.filters, i18n)}
      downloads={[]}
      i18n={i18n}
    />
  );
}
