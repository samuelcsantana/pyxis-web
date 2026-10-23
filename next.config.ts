import type { NextConfig } from 'next';
import { VISITED_SCREEN_CACHE_SECONDS } from './src/lib/client-cache';
import { buildSecurityHeaders } from './src/lib/security-headers';

const securityHeaders = buildSecurityHeaders();

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  experimental: {
    staleTimes: { dynamic: VISITED_SCREEN_CACHE_SECONDS },
  },
  outputFileTracingIncludes: {
    '/legal/*': ['./content/legal/**/*'],
  },
  headers() {
    return Promise.resolve([{ source: '/:path*', headers: securityHeaders }]);
  },
};

export default nextConfig;
