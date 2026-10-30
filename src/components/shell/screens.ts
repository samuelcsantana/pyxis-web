import { DASHBOARD_FILTER_PARAMETERS } from '@/domain/dashboard-filter-parameters';
import { EXPORTS_SEGMENT } from '@/domain/exports';

export const SCREENS = [
  {
    slug: 'overview',
    icon: 'M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z',
  },
  {
    slug: 'funnel',
    icon: 'M3 4h18l-7 8v6l-4 2v-8L3 4z',
  },
  {
    slug: 'features',
    icon: 'M12 3l2.4 5.6 6 .9-4.4 3.9 1.3 5.8-5.3-2.9-5.3 2.9 1.3-5.8L3.6 9.5l6-.9L12 3z',
  },
  {
    slug: 'requests',
    icon: 'M4 7h13 M13 3l4 4-4 4 M20 17H7 M11 13l-4 4 4 4',
  },
  {
    slug: 'timeline',
    icon: 'M12 3a9 9 0 1 1 0 18a9 9 0 1 1 0-18 M12 7v5l3 2',
  },
  {
    slug: 'visits',
    icon: 'M9 6h11 M9 12h11 M9 18h11 M4 5h2v2H4z M4 11h2v2H4z M4 17h2v2H4z',
  },
  {
    slug: 'devices',
    icon: 'M3 5h12v9H3z M7 18h4 M9 14v4 M17 8h4v12h-4z',
  },
  {
    slug: 'acquisition',
    icon: 'M12 3a9 9 0 1 1 0 18a9 9 0 1 1 0-18 M15.5 8.5l-2 5-5 2 2-5 5-2z',
  },
] as const;

export type ScreenSlug = (typeof SCREENS)[number]['slug'];

export const NAVIGATION_ORDER: readonly ScreenSlug[] = [
  'overview',
  'acquisition',
  'devices',
  'features',
  'funnel',
  'visits',
  'timeline',
  'requests',
];

export const SCREENS_IN_NAVIGATION_ORDER = [...SCREENS].sort(
  (first, second) => NAVIGATION_ORDER.indexOf(first.slug) - NAVIGATION_ORDER.indexOf(second.slug),
);

export const SCREENS_WITHOUT_PERIOD: ReadonlySet<ScreenSlug> = new Set(['timeline']);

export const SCREENS_WITHOUT_FILTERS: ReadonlySet<ScreenSlug> = new Set(['timeline']);

export function screenLabelKey(slug: ScreenSlug): `screens.${ScreenSlug}` {
  return `screens.${slug}`;
}

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

export function viewParameters(search: SearchReader): string {
  const kept = new URLSearchParams(periodParameters(search));
  for (const name of DASHBOARD_FILTER_PARAMETERS) {
    const value = search.get(name);
    if (value !== null && value !== '') {
      kept.set(name, value);
    }
  }
  return kept.toString();
}

export function screenParameters(search: SearchReader, slug: ScreenSlug): string {
  return SCREENS_WITHOUT_FILTERS.has(slug) ? periodParameters(search) : viewParameters(search);
}

export function screenHref(projectId: string, slug: ScreenSlug, query = ''): string {
  const path = `/${encodeURIComponent(projectId)}/${slug}`;
  return query === '' ? path : `${path}?${query}`;
}

export const SETTINGS_SEGMENT = 'settings';

export const SETTINGS_ICON =
  'M12 9a3 3 0 1 1 0 6a3 3 0 1 1 0-6 M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z';

export function settingsHref(projectId: string): string {
  return `/${encodeURIComponent(projectId)}/${SETTINGS_SEGMENT}`;
}

export const INSTALL_SEGMENT = 'install';

export function installHref(projectId: string): string {
  return `/${encodeURIComponent(projectId)}/${INSTALL_SEGMENT}`;
}

export const HELP_SEGMENT = 'help';

export function helpHref(projectId: string): string {
  return `/${encodeURIComponent(projectId)}/${HELP_SEGMENT}`;
}

export const SETTINGS_KEYS_PANEL = 'settings-keys';

export function settingsKeysHref(projectId: string): string {
  return `${settingsHref(projectId)}#${SETTINGS_KEYS_PANEL}-heading`;
}

export const SETTINGS_CONNECTIONS_PANEL = 'settings-connections';

export function settingsConnectionsHref(projectId: string): string {
  return `${settingsHref(projectId)}#${SETTINGS_CONNECTIONS_PANEL}-heading`;
}

const LINK_BASE = 'http://link.invalid';

export function linkWith(href: string, parameters: Readonly<Record<string, string>>): string {
  const url = new URL(href, LINK_BASE);
  for (const [name, value] of Object.entries(parameters)) {
    url.searchParams.set(name, value);
  }
  return `${url.pathname}${url.search}`;
}

export function hrefKeepingView(href: string, search: SearchReader): string {
  const url = new URL(href, LINK_BASE);
  for (const [name, value] of new URLSearchParams(viewParameters(search))) {
    url.searchParams.set(name, value);
  }
  return `${url.pathname}${url.search}${url.hash}`;
}

const SCREEN_PATH_SEGMENTS = 3;
export const CONNECT_PAGE = '/connect';
const ACCOUNT_LEVEL_PATHS: ReadonlySet<string> = new Set(['/account', CONNECT_PAGE]);

export function isScreenSlug(value: string | undefined): value is ScreenSlug {
  return SCREENS.some((screen) => screen.slug === value);
}

export function screenSlugOf(pathname: string): ScreenSlug | undefined {
  const segments = pathname.split('/');
  const slug = segments[2];
  return segments.length === SCREEN_PATH_SEGMENTS && segments[1] !== '' && isScreenSlug(slug)
    ? slug
    : undefined;
}

export const SETTINGS_ITEM = 'settings';
export const INSTALL_ITEM = 'install';
export const HELP_ITEM = 'help';

export type NavigationItem =
  ScreenSlug | typeof SETTINGS_ITEM | typeof INSTALL_ITEM | typeof HELP_ITEM;

interface ProjectPage {
  readonly item: NavigationItem;
  readonly segmentsAfter: number;
}

const PROJECT_PAGES: ReadonlyMap<string, ProjectPage> = new Map<string, ProjectPage>([
  [SETTINGS_SEGMENT, { item: SETTINGS_ITEM, segmentsAfter: 0 }],
  [INSTALL_SEGMENT, { item: INSTALL_ITEM, segmentsAfter: 0 }],
  [EXPORTS_SEGMENT, { item: SETTINGS_ITEM, segmentsAfter: 1 }],
  [HELP_SEGMENT, { item: HELP_ITEM, segmentsAfter: 0 }],
]);

export function navigationItemOf(pathname: string): NavigationItem | undefined {
  const screen = screenSlugOf(pathname);
  if (screen !== undefined) {
    return screen;
  }
  const [, projectId = '', segment = '', ...after] = pathname.split('/');
  const page = PROJECT_PAGES.get(segment);
  if (projectId === '' || after.length !== page?.segmentsAfter || after.includes('')) {
    return undefined;
  }
  return page.item;
}

export function returnPathOf(value: string | null | undefined): string | undefined {
  if (value === null || value === undefined || !value.startsWith('/') || value.startsWith('//')) {
    return undefined;
  }
  const url = new URL(value, LINK_BASE);
  const isScreen = screenSlugOf(url.pathname) !== undefined;
  return url.origin === LINK_BASE && (isScreen || ACCOUNT_LEVEL_PATHS.has(url.pathname))
    ? `${url.pathname}${url.search}`
    : undefined;
}

export function screenOf(pathname: string): string | undefined {
  return pathname.split('/')[2];
}
