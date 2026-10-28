import { DASHBOARD_FILTER_PARAMETERS } from '@/domain/dashboard-filter-parameters';
import type { RequestsSearch } from '@/domain/requests';
import type { VisitsSearch } from '@/domain/visits';
import type { KeptParameters } from './kept-parameters';
import type { ScreenSlug } from './screens';

export type ScreenSearch = Readonly<Record<string, string | string[]>>;

export interface SearchSource {
  keys(): Iterable<string>;
  getAll(name: string): string[];
}

function searchValueOf(values: readonly string[]): string | string[] {
  return values.length === 1 ? String(values[0]) : [...values];
}

export function screenSearchOf(parameters: SearchSource): ScreenSearch {
  return Object.fromEntries(
    [...new Set(parameters.keys())].map((name) => [name, searchValueOf(parameters.getAll(name))]),
  );
}

const REQUESTS_CARRIED = [
  'kind',
  'show',
  'screen',
] as const satisfies readonly (keyof RequestsSearch)[];

const VISITS_CARRIED = [
  ...DASHBOARD_FILTER_PARAMETERS,
  'route',
] as const satisfies readonly (keyof VisitsSearch)[];

export const CARRIED_PARAMETERS: Readonly<Record<ScreenSlug, readonly string[]>> = {
  overview: ['metric', ...DASHBOARD_FILTER_PARAMETERS],
  funnel: ['mode', 'steps', 'by', 'step', 'outcome', ...DASHBOARD_FILTER_PARAMETERS],
  features: ['kind', 'q', ...DASHBOARD_FILTER_PARAMETERS],
  requests: [...REQUESTS_CARRIED, ...DASHBOARD_FILTER_PARAMETERS],
  timeline: [],
  visits: VISITS_CARRIED,
  devices: DASHBOARD_FILTER_PARAMETERS,
  acquisition: DASHBOARD_FILTER_PARAMETERS,
};

export function carriedParameters(screen: ScreenSlug, search: ScreenSearch): KeptParameters {
  return Object.fromEntries(
    CARRIED_PARAMETERS[screen].flatMap((name) => {
      const value = search[name];
      return typeof value === 'string' && value !== '' ? [[name, value]] : [];
    }),
  );
}
