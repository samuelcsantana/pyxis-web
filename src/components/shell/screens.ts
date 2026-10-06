export const SCREENS = [
  {
    slug: 'overview',
    label: 'Overview',
    icon: 'M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z',
    available: true,
  },
  {
    slug: 'funnel',
    label: 'Funnel',
    icon: 'M3 4h18l-7 8v6l-4 2v-8L3 4z',
    available: false,
  },
  {
    slug: 'features',
    label: 'Features',
    icon: 'M12 3l2.4 5.6 6 .9-4.4 3.9 1.3 5.8-5.3-2.9-5.3 2.9 1.3-5.8L3.6 9.5l6-.9L12 3z',
    available: false,
  },
  {
    slug: 'requests',
    label: 'Requests',
    icon: 'M4 7h13 M13 3l4 4-4 4 M20 17H7 M11 13l-4 4 4 4',
    available: false,
  },
  {
    slug: 'timeline',
    label: 'Timeline',
    icon: 'M12 3a9 9 0 1 1 0 18a9 9 0 1 1 0-18 M12 7v5l3 2',
    available: false,
  },
  {
    slug: 'devices',
    label: 'Devices',
    icon: 'M3 5h12v9H3z M7 18h4 M9 14v4 M17 8h4v12h-4z',
    available: false,
  },
  {
    slug: 'acquisition',
    label: 'Acquisition',
    icon: 'M12 3a9 9 0 1 1 0 18a9 9 0 1 1 0-18 M15.5 8.5l-2 5-5 2 2-5 5-2z',
    available: false,
  },
] as const;

export type ScreenSlug = (typeof SCREENS)[number]['slug'];

export const FIRST_SCREEN: ScreenSlug = 'overview';

const PERIOD_PARAMETERS = ['range', 'from', 'to'] as const;

export interface SearchReader {
  get(name: string): string | null;
}

export function periodParameters(search: SearchReader): string {
  const kept = new URLSearchParams();
  for (const name of PERIOD_PARAMETERS) {
    const value = search.get(name);
    if (value !== null) {
      kept.set(name, value);
    }
  }
  return kept.toString();
}

export function screenHref(projectId: string, slug: ScreenSlug, query = ''): string {
  const path = `/${encodeURIComponent(projectId)}/${slug}`;
  return query === '' ? path : `${path}?${query}`;
}

export function screenOf(pathname: string): string | undefined {
  return pathname.split('/')[2];
}
