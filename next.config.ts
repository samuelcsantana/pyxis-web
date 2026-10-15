import type { NextConfig } from 'next';
import { buildSecurityHeaders } from './src/lib/security-headers';

const securityHeaders = buildSecurityHeaders();

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  outputFileTracingIncludes: {
    '/legal/*': ['./content/legal/**/*'],
  },
  headers() {
    return Promise.resolve([{ source: '/:path*', headers: securityHeaders }]);
  },
};

export default nextConfig;
