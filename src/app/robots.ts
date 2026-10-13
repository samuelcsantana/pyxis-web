import type { MetadataRoute } from 'next';
import { isDemoMode } from '@/lib/api-config';
import { liveDemoUrlOf } from '@/lib/demo-canonical';

const EVERY_CRAWLER = '*';
const SITEMAP_PATH = '/sitemap.xml';

export default function robots(): MetadataRoute.Robots {
  if (!isDemoMode()) {
    return { rules: { userAgent: EVERY_CRAWLER, disallow: '/' } };
  }
  return {
    rules: { userAgent: EVERY_CRAWLER, allow: '/' },
    sitemap: liveDemoUrlOf(SITEMAP_PATH),
  };
}
