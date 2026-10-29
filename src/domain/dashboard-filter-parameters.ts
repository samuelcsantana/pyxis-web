export const PAGE_FILTER_PARAMETERS = ['path', 'path2', 'path3'] as const;

export const DASHBOARD_FILTER_PARAMETERS = [
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
  'failed',
] as const;

export type DashboardFilterParameter = (typeof DASHBOARD_FILTER_PARAMETERS)[number];

export function hasDashboardFilterIn(search: { get(name: string): string | null }): boolean {
  return DASHBOARD_FILTER_PARAMETERS.some((name) => (search.get(name) ?? '').trim() !== '');
}
