export interface CspOptions {
  readonly apiOrigin?: string;
  readonly isDev: boolean;
}

export interface SecurityHeader {
  readonly key: string;
  readonly value: string;
}

export function apiOriginFrom(apiUrl: string | undefined): string | undefined {
  if (!apiUrl) {
    return undefined;
  }
  try {
    return new URL(apiUrl).origin;
  } catch {
    return undefined;
  }
}

export function buildContentSecurityPolicy({ apiOrigin, isDev }: CspOptions): string {
  const self = "'self'";
  const api = apiOrigin ? ` ${apiOrigin}` : '';
  return [
    `default-src ${self}`,
    `script-src ${self} 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}`,
    `style-src ${self} 'unsafe-inline'`,
    `img-src ${self} data: blob:`,
    `font-src ${self}`,
    `connect-src ${self}${api}`,
    "object-src 'none'",
    `base-uri ${self}`,
    `form-action ${self}`,
    "frame-ancestors 'none'",
  ].join('; ');
}

export function buildSecurityHeaders(options: CspOptions): SecurityHeader[] {
  return [
    { key: 'Content-Security-Policy', value: buildContentSecurityPolicy(options) },
    { key: 'X-Frame-Options', value: 'DENY' },
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    {
      key: 'Permissions-Policy',
      value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()',
    },
    { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
  ];
}
