import type { Arrivals, ArrivalsReport } from '@/domain/arrivals';

export type ArrivalsAnswer =
  | { readonly kind: 'report'; readonly report: ArrivalsReport }
  | { readonly kind: 'signed-out' }
  | { readonly kind: 'refused'; readonly status: number };

const STATUS_UNAUTHORIZED = 401;

type Fields = Readonly<Record<string, unknown>>;

function isObject(value: unknown): value is Fields {
  return typeof value === 'object' && value !== null;
}

function arrivalsOf(value: unknown): Arrivals | undefined {
  if (
    !isObject(value) ||
    typeof value.more !== 'boolean' ||
    !Array.isArray(value.times) ||
    !value.times.every((time) => typeof time === 'number')
  ) {
    return undefined;
  }
  return { times: value.times, more: value.more };
}

export function arrivalsReportOf(value: unknown): ArrivalsReport | undefined {
  if (
    !isObject(value) ||
    typeof value.asOf !== 'number' ||
    typeof value.activeVisits !== 'number'
  ) {
    return undefined;
  }
  const visits = arrivalsOf(value.visits);
  const conversions = value.conversions === null ? null : arrivalsOf(value.conversions);
  const namedEvents = arrivalsOf(value.namedEvents);
  const failedRequests = arrivalsOf(value.failedRequests);
  if (
    visits === undefined ||
    conversions === undefined ||
    namedEvents === undefined ||
    failedRequests === undefined
  ) {
    return undefined;
  }
  return {
    asOf: value.asOf,
    activeVisits: value.activeVisits,
    visits,
    conversions,
    namedEvents,
    failedRequests,
  };
}

export async function readArrivalsAnswer(response: Response): Promise<ArrivalsAnswer> {
  if (response.type === 'opaqueredirect' || response.status === STATUS_UNAUTHORIZED) {
    return { kind: 'signed-out' };
  }
  if (!response.ok) {
    return { kind: 'refused', status: response.status };
  }
  const report = arrivalsReportOf(await response.json());
  return report === undefined
    ? { kind: 'refused', status: response.status }
    : { kind: 'report', report };
}
