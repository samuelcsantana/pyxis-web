import type { ReactNode } from 'react';
import { AcquisitionReportView } from '@/components/acquisition/acquisition-report-view';
import { visitsTotal } from '@/domain/acquisition';
import { acquisitionResponseSchema } from '@/domain/acquisition.schema';
import type { SharedRequest } from '@/domain/shared-project';
import { sharedRowFilters } from '@/lib/row-filters';
import {
  type SharedAnswers,
  type SharedContext,
  sharedEmptyState,
  sharedPeriodLabel,
  sharedReport,
  sharedScopeOf,
} from './shared-context';

export function sharedAcquisitionRequests(context: SharedContext): readonly SharedRequest[] {
  return [sharedReport(context, 'acquisition', 'acquisition', sharedScopeOf(context).scope)];
}

export function sharedAcquisitionView(context: SharedContext, answers: SharedAnswers): ReactNode {
  const shared = sharedScopeOf(context);
  const report = acquisitionResponseSchema.parse(answers.acquisition);
  if (visitsTotal(report.days) === 0) {
    return sharedEmptyState(context, 'acquisition', shared);
  }
  return (
    <AcquisitionReportView
      report={report}
      currency={context.project.currency}
      periodLabel={sharedPeriodLabel(context, shared)}
      downloads={[]}
      channelVisitsHref={() => null}
      sourceVisitsHref={() => null}
      campaignVisitsHref={() => null}
      rowFilter={sharedRowFilters(
        context.token,
        'acquisition',
        context.search,
        shared.filters,
        context.i18n,
      )}
      i18n={context.i18n}
    />
  );
}
