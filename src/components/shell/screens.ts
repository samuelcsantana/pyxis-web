export const SCREENS = [
  {
    slug: 'overview',
    label: 'Overview',
    icon: 'M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z',
  },
  {
    slug: 'funnel',
    label: 'Funnel',
    icon: 'M3 4h18l-7 8v6l-4 2v-8L3 4z',
  },
  {
    slug: 'features',
    label: 'Features',
    icon: 'M12 3l2.4 5.6 6 .9-4.4 3.9 1.3 5.8-5.3-2.9-5.3 2.9 1.3-5.8L3.6 9.5l6-.9L12 3z',
  },
  {
    slug: 'requests',
    label: 'Requests',
    icon: 'M4 7h13 M13 3l4 4-4 4 M20 17H7 M11 13l-4 4 4 4',
  },
  {
    slug: 'timeline',
    label: 'Timeline',
    icon: 'M12 3a9 9 0 1 1 0 18a9 9 0 1 1 0-18 M12 7v5l3 2',
  },
  {
    slug: 'visits',
    label: 'Visits',
    icon: 'M9 6h11 M9 12h11 M9 18h11 M4 5h2v2H4z M4 11h2v2H4z M4 17h2v2H4z',
  },
  {
    slug: 'devices',
    label: 'Devices',
    icon: 'M3 5h12v9H3z M7 18h4 M9 14v4 M17 8h4v12h-4z',
  },
  {
    slug: 'acquisition',
    label: 'Acquisition',
    icon: 'M12 3a9 9 0 1 1 0 18a9 9 0 1 1 0-18 M15.5 8.5l-2 5-5 2 2-5 5-2z',
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

const LINK_BASE = 'http://link.invalid';

export function linkWith(href: string, parameters: Readonly<Record<string, string>>): string {
  const url = new URL(href, LINK_BASE);
  for (const [name, value] of Object.entries(parameters)) {
    url.searchParams.set(name, value);
  }
  return `${url.pathname}${url.search}`;
}

const SCREEN_PATH_SEGMENTS = 3;

function isScreenSlug(value: string | undefined): boolean {
  return SCREENS.some((screen) => screen.slug === value);
}

export function returnPathOf(value: string | null | undefined): string | undefined {
  if (value === null || value === undefined || !value.startsWith('/') || value.startsWith('//')) {
    return undefined;
  }
  const url = new URL(value, LINK_BASE);
  const segments = url.pathname.split('/');
  const isScreen =
    url.origin === LINK_BASE &&
    segments.length === SCREEN_PATH_SEGMENTS &&
    segments[1] !== '' &&
    isScreenSlug(segments[2]);
  return isScreen ? `${url.pathname}${url.search}` : undefined;
}

export function screenOf(pathname: string): string | undefined {
  return pathname.split('/')[2];
}
