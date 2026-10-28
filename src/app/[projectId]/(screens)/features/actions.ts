'use server';

import { z } from 'zod';
import { dashboardFiltersOf } from '@/domain/dashboard-filters';
import { EVENT_NAME_PATTERN } from '@/domain/funnel';
import { PROPERTY_KEY_PATTERN } from '@/domain/visit-property';
import { type PropertyKeyView, propertyKeyViews } from '@/domain/property-breakdown';
import { type PropertySummaryView, propertySummaryView } from '@/domain/property-summary';
import { getI18n } from '@/i18n/get-messages';
import { projectOrNotFound, readOrSignIn } from '@/lib/current-admin';
import { createFeaturesService } from '@/services/features/features-service.factory';

const requestSchema = z.strictObject({
  from: z.iso.date(),
  to: z.iso.date(),
  name: z.string().regex(EVENT_NAME_PATTERN),
});

const filterParametersSchema = z.record(z.string(), z.string());

export async function loadPropertyBreakdown(
  projectId: string,
  range: { readonly from: string; readonly to: string },
  filterParameters: Readonly<Record<string, string>>,
  name: string,
): Promise<readonly PropertyKeyView[]> {
  const { project } = await projectOrNotFound(projectId);
  const parsed = requestSchema.safeParse({ ...range, name });
  const parameters = filterParametersSchema.safeParse(filterParameters);
  if (!parsed.success || !parameters.success) {
    throw new Error('A property breakdown needs a valid range, filters and event name.');
  }
  const { from, to } = parsed.data;
  const i18n = await getI18n();
  const { filters } = dashboardFiltersOf(parameters.data, i18n);
  const report = await readOrSignIn(() =>
    createFeaturesService().properties(project.id, { from, to, filters }, parsed.data.name),
  );
  return propertyKeyViews(report, i18n);
}

const summarySchema = z.strictObject({
  from: z.iso.date(),
  to: z.iso.date(),
  name: z.string().regex(EVENT_NAME_PATTERN),
  key: z.string().regex(PROPERTY_KEY_PATTERN),
  by: z.string().regex(PROPERTY_KEY_PATTERN).nullable(),
});

export async function loadPropertySummary(
  projectId: string,
  range: { readonly from: string; readonly to: string },
  filterParameters: Readonly<Record<string, string>>,
  name: string,
  key: string,
  by: string | null,
): Promise<PropertySummaryView> {
  const { project } = await projectOrNotFound(projectId);
  const parsed = summarySchema.safeParse({ ...range, name, key, by });
  const parameters = filterParametersSchema.safeParse(filterParameters);
  if (!parsed.success || !parameters.success) {
    throw new Error('A property summary needs a valid range, filters, event, key and split.');
  }
  const { from, to } = parsed.data;
  const i18n = await getI18n();
  const { filters } = dashboardFiltersOf(parameters.data, i18n);
  const report = await readOrSignIn(() =>
    createFeaturesService().summary(
      project.id,
      { from, to, filters },
      { name: parsed.data.name, key: parsed.data.key, by: parsed.data.by },
    ),
  );
  return propertySummaryView(report, i18n);
}
