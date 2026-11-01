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

export const ROW_FILTER_FIELDS = [
  'path',
  'event',
  'channel',
  'device',
  'browser',
  'os',
  'country',
  'region',
  'city',
  'source',
  'campaign',
] as const;

export type RowFilterField = (typeof ROW_FILTER_FIELDS)[number];

const EVENT_PROPERTY_PARAMETER = 'property';

function pathsIn(parameters: URLSearchParams): readonly string[] {
  return PAGE_FILTER_PARAMETERS.map((name) => (parameters.get(name) ?? '').trim()).filter(
    (path) => path !== '',
  );
}

function withAddedPath(paths: readonly string[], path: string): readonly string[] {
  if (paths.includes(path)) {
    return paths;
  }
  return paths.length < PAGE_FILTER_PARAMETERS.length
    ? [...paths, path]
    : [...paths.slice(0, -1), path];
}

export function withAddedFilter(query: string, field: RowFilterField, value: string): string {
  const parameters = new URLSearchParams(query);
  if (field === 'path') {
    const paths = withAddedPath(pathsIn(parameters), value);
    PAGE_FILTER_PARAMETERS.forEach((name, index) => {
      const path = paths[index];
      if (path === undefined) {
        parameters.delete(name);
      } else {
        parameters.set(name, path);
      }
    });
    return parameters.toString();
  }
  if (field === 'event') {
    parameters.delete(EVENT_PROPERTY_PARAMETER);
  }
  parameters.set(field, value);
  return parameters.toString();
}
