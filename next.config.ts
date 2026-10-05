import type { NextConfig } from 'next';
import { apiOriginFrom, buildSecurityHeaders } from './src/lib/security-headers';

const securityHeaders = buildSecurityHeaders({
  apiOrigin: apiOriginFrom(process.env.NEXT_PUBLIC_PYXIS_API_URL),
  isDev: process.env.NODE_ENV === 'development',
});

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  headers() {
    return Promise.resolve([{ source: '/:path*', headers: securityHeaders }]);
  },
};

export default nextConfig;
