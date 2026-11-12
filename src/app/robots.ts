import type { MetadataRoute } from 'next';
import { isDemoMode } from '@/lib/api-config';
import { liveDemoUrlOf } from '@/lib/demo-canonical';
import { isOnLandingHost } from '@/lib/request-host';
import { LANDING_ORIGIN } from '@/lib/site';

const EVERY_CRAWLER = '*';
const SITEMAP_PATH = '/sitemap.xml';
const ANY_ADDRESS_WITH_A_QUERY = '/*?';
const ANY_CSV_EXPORT = '/*/export';
const DEMO_CRAWL_TRAPS = [ANY_ADDRESS_WITH_A_QUERY, ANY_CSV_EXPORT];

export default async function robots(): Promise<MetadataRoute.Robots> {
  if (!isDemoMode()) {
    return { rules: { userAgent: EVERY_CRAWLER, disallow: '/' } };
  }
  if (await isOnLandingHost()) {
    return {
      rules: { userAgent: EVERY_CRAWLER, allow: '/' },
      sitemap: new URL(SITEMAP_PATH, LANDING_ORIGIN).toString(),
    };
  }
  return {
    rules: { userAgent: EVERY_CRAWLER, allow: '/', disallow: DEMO_CRAWL_TRAPS },
    sitemap: liveDemoUrlOf(SITEMAP_PATH),
  };
}
