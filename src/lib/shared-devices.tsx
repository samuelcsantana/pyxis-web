import type { ReactNode } from 'react';
import { DevicesReportView, devicesLinksOf } from '@/components/devices/devices-report-view';
import { hasVisits } from '@/domain/devices';
import { devicesResponseSchema } from '@/domain/devices.schema';
import type { SharedRequest } from '@/domain/shared-project';
import { sharedRowFilters } from '@/lib/row-filters';
import {
  type SharedAnswers,
  type SharedContext,
  sharedEmptyState,
  sharedReport,
  sharedScopeOf,
} from './shared-context';

export function sharedDevicesRequests(context: SharedContext): readonly SharedRequest[] {
  return [sharedReport(context, 'devices', 'devices', sharedScopeOf(context).scope)];
}

export function sharedDevicesView(context: SharedContext, answers: SharedAnswers): ReactNode {
  const { token, project, search, i18n } = context;
  const shared = sharedScopeOf(context);
  const report = devicesResponseSchema.parse(answers.devices);
  if (!hasVisits(report)) {
    return sharedEmptyState(context, 'devices', shared);
  }
  return (
    <DevicesReportView
      report={report}
      projectId={null}
      countedGoal={project.goals[0] ?? null}
      cityEnabled={project.cityEnabled}
      exportPath={null}
      links={devicesLinksOf(
        null,
        sharedRowFilters(token, 'devices', search, shared.filters, i18n),
        i18n,
      )}
      i18n={i18n}
    />
  );
}
