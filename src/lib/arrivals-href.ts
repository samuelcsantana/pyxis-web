export const ARRIVALS_SEGMENT = 'arrivals';
export const SINCE_PARAMETER = 'since';

export function arrivalsHref(projectId: string, query: URLSearchParams): string {
  return `/${encodeURIComponent(projectId)}/${ARRIVALS_SEGMENT}?${query.toString()}`;
}
