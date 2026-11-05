import type { DashboardFilters } from './dashboard-filters';
import type { Goal } from './goals';
import { SHARE_PAGE_PATH } from './share-page-path';

export const SHARE_TOKEN_PATTERN = /^pyxis_sh_[A-Za-z0-9]{32}$/;
export const SHARED_SCREENS = ['overview', 'acquisition', 'devices', 'features', 'funnel'] as const;

export type SharedScreen = (typeof SHARED_SCREENS)[number];

export interface SharedProject {
  readonly name: string;
  readonly timezone: string;
  readonly currency: string;
  readonly cityEnabled: boolean;
  readonly visitorsEnabled: boolean;
  readonly goals: readonly Goal[];
  readonly expiresAt: string | null;
}

export interface SharedRequest {
  readonly key: string;
  readonly path: string;
}

export function isShareToken(value: string): boolean {
  return SHARE_TOKEN_PATTERN.test(value);
}

export function isSharedScreen(value: string): value is SharedScreen {
  return SHARED_SCREENS.some((screen) => screen === value);
}

export function sharedFiltersOf(filters: DashboardFilters): DashboardFilters {
  return { ...filters, identity: null, property: null };
}

export function sharedApiPath(token: string, report?: string, query?: string): string {
  const base = `/v1/shared/${encodeURIComponent(token)}`;
  const path = report === undefined ? base : `${base}/${report}`;
  return query === undefined || query === '' ? path : `${path}?${query}`;
}

export function sharedPageHref(token: string, screen: SharedScreen = 'overview'): string {
  const base = `${SHARE_PAGE_PATH}/${encodeURIComponent(token)}`;
  return screen === 'overview' ? base : `${base}/${screen}`;
}
