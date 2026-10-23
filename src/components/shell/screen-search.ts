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
  'path',
  'path2',
  'path3',
  'event',
  'property',
  'channel',
  'device',
  'identity',
  'country',
  'region',
  'source',
  'campaign',
  'route',
  'failed',
] as const satisfies readonly (keyof VisitsSearch)[];

export const CARRIED_PARAMETERS: Readonly<Record<ScreenSlug, readonly string[]>> = {
  overview: ['metric'],
  funnel: ['mode', 'steps', 'by', 'step', 'outcome'],
  features: ['kind', 'q'],
  requests: REQUESTS_CARRIED,
  timeline: [],
  visits: VISITS_CARRIED,
  devices: [],
  acquisition: [],
};

export function carriedParameters(screen: ScreenSlug, search: ScreenSearch): KeptParameters {
  return Object.fromEntries(
    CARRIED_PARAMETERS[screen].flatMap((name) => {
      const value = search[name];
      return typeof value === 'string' && value !== '' ? [[name, value]] : [];
    }),
  );
}
