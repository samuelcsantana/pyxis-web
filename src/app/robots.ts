import type { MetadataRoute } from 'next';
import { isDemoMode } from '@/lib/api-config';

const EVERY_CRAWLER = '*';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: isDemoMode()
      ? { userAgent: EVERY_CRAWLER, allow: '/' }
      : { userAgent: EVERY_CRAWLER, disallow: '/' },
  };
}
