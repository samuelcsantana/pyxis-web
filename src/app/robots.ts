import type { MetadataRoute } from 'next';
import { isDemoMode } from '@/lib/api-config';
import { liveDemoUrlOf } from '@/lib/demo-canonical';
import { isOnLandingHost } from '@/lib/request-host';
import { LANDING_ORIGIN } from '@/lib/site';

const EVERY_CRAWLER = '*';
const SITEMAP_PATH = '/sitemap.xml';

export default async function robots(): Promise<MetadataRoute.Robots> {
  if (!isDemoMode()) {
    return { rules: { userAgent: EVERY_CRAWLER, disallow: '/' } };
  }
  const sitemap = (await isOnLandingHost())
    ? new URL(SITEMAP_PATH, LANDING_ORIGIN).toString()
    : liveDemoUrlOf(SITEMAP_PATH);
  return { rules: { userAgent: EVERY_CRAWLER, allow: '/' }, sitemap };
}
