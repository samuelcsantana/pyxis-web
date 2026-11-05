import { PAGE_FILTER_PARAMETERS } from './dashboard-filter-parameters';

export const VISIT_FILTER_FIELDS = [
  ...PAGE_FILTER_PARAMETERS,
  'event',
  'property',
  'channel',
  'device',
  'browser',
  'os',
  'identity',
  'country',
  'region',
  'city',
  'source',
  'campaign',
  'route',
  'visitors',
  'reached_goal',
  'failed',
] as const;

export type VisitFilterField = (typeof VISIT_FILTER_FIELDS)[number];

const UPPERCASE_FIELDS: ReadonlySet<VisitFilterField> = new Set(['country', 'region']);

function entered(field: VisitFilterField, value: string): string {
  const trimmed = value.trim();
  return UPPERCASE_FIELDS.has(field) ? trimmed.toUpperCase() : trimmed;
}

export function changedVisitFilterFields(
  applied: Readonly<Partial<Record<string, string>>>,
  form: Readonly<Partial<Record<VisitFilterField, string>>>,
): readonly VisitFilterField[] {
  return VISIT_FILTER_FIELDS.filter(
    (field) => entered(field, form[field] ?? '') !== (applied[field] ?? ''),
  );
}
