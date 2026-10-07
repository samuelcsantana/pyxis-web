import type { MetadataRoute } from 'next';
import { APP_DESCRIPTION, APP_NAME } from '@/lib/site';
import { THEME_BACKGROUNDS } from '@/lib/theme';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: APP_NAME,
    short_name: APP_NAME,
    description: APP_DESCRIPTION,
    start_url: '/',
    display: 'standalone',
    background_color: THEME_BACKGROUNDS.light,
    theme_color: THEME_BACKGROUNDS.light,
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
      { src: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  };
}
