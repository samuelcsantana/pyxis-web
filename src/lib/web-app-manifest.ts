import type { MetadataRoute } from 'next';
import { APP_DESCRIPTION, APP_NAME } from '@/lib/site';
import { THEME_BACKGROUNDS } from '@/lib/theme';

export const WEB_APP_MANIFEST_PATH = '/manifest.webmanifest';
export const WEB_APP_MANIFEST_CONTENT_TYPE = 'application/manifest+json';

const DASHBOARD_ROOT = '/';

export function dashboardManifest(): MetadataRoute.Manifest {
  return {
    id: DASHBOARD_ROOT,
    name: APP_NAME,
    short_name: APP_NAME,
    description: APP_DESCRIPTION,
    start_url: DASHBOARD_ROOT,
    display: 'standalone',
    background_color: THEME_BACKGROUNDS.light,
    theme_color: THEME_BACKGROUNDS.light,
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
      { src: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  };
}
