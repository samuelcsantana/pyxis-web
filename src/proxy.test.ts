import { NextRequest } from 'next/server';
import { describe, expect, it, vi } from 'vitest';
import { config, proxy } from './proxy';

function visit(path: string, cookie?: string) {
  return proxy(
    new NextRequest(`https://pyxis.example.com${path}`, {
      headers: cookie === undefined ? {} : { cookie },
    }),
  );
}

function visitAt(url: string, headers: Readonly<Record<string, string>> = {}) {
  return proxy(new NextRequest(url, { headers }));
}

const FORWARDED_CSP_HEADER = 'x-middleware-request-content-security-policy';
const FORWARDED_LOCALE_HEADER = 'x-middleware-request-x-pyxis-path-locale';
const OVERRIDDEN_HEADERS = 'x-middleware-override-headers';

function forwardedHeaderNames(response: Response): string[] {
  return (response.headers.get(OVERRIDDEN_HEADERS) ?? '').split(',');
}

function nonceOf(policy: string | null): string | undefined {
  return /'nonce-([^']+)'/.exec(policy ?? '')?.[1];
}

describe('proxy', () => {
  it('asks for nothing in demo mode', () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');

    expect(visit('/p1/overview').headers.get('location')).toBeNull();
  });

  describe('content security policy', () => {
    it('sends a policy with a fresh nonce on every rendered page, in demo mode too', () => {
      vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');
      const first = visit('/p1/overview').headers.get('content-security-policy');
      const second = visit('/p1/overview').headers.get('content-security-policy');

      expect(first).toContain(`'nonce-${nonceOf(first) ?? ''}' 'strict-dynamic'`);
      expect(first).toContain("connect-src 'self';");
      expect(nonceOf(first)).toBeDefined();
      expect(nonceOf(second)).not.toBe(nonceOf(first));
    });

    it('hands the same policy to the renderer, so Next adds the nonce to its scripts', () => {
      vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', 'https://api.pyxis.example.com');
      const response = visit('/p1/overview', '__Host-pyxis_session=token');

      expect(response.headers.get(FORWARDED_CSP_HEADER)).toBe(
        response.headers.get('content-security-policy'),
      );
      expect(response.headers.get('content-security-policy')).toContain(
        "connect-src 'self' https://api.pyxis.example.com",
      );
    });

    it('sends no policy with a redirect, which renders nothing', () => {
      vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', 'https://api.pyxis.example.com');

      expect(visit('/p1/overview').headers.get('content-security-policy')).toBeNull();
    });
  });

  describe('with an API configured', () => {
    it('sends a visitor without a session to sign in, keeping the screen to come back to', () => {
      vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', 'https://api.pyxis.example.com');

      expect(visit('/p1/requests?show=failing&range=7d').headers.get('location')).toBe(
        'https://pyxis.example.com/sign-in?next=%2Fp1%2Frequests%3Fshow%3Dfailing%26range%3D7d',
      );
      expect(visit('/').headers.get('location')).toBe('https://pyxis.example.com/sign-in');
    });

    it('lets a visitor without a session reach the sign-in page', () => {
      vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', 'https://api.pyxis.example.com');

      expect(visit('/sign-in').headers.get('location')).toBeNull();
    });

    it('lets a visitor without a session reach the sign-up page, and a signed-in one too', () => {
      vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', 'https://api.pyxis.example.com');

      expect(visit('/sign-up').headers.get('location')).toBeNull();
      expect(
        visit('/sign-up?step=plan', '__Host-pyxis_session=token').headers.get('location'),
      ).toBeNull();
    });

    it('sends a signed-in visitor away from the sign-in page, to a known screen only', () => {
      vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', 'https://api.pyxis.example.com');

      expect(visit('/sign-in', '__Host-pyxis_session=token').headers.get('location')).toBe(
        'https://pyxis.example.com/',
      );
      expect(
        visit('/sign-in?next=%2Fp1%2Ffunnel', '__Host-pyxis_session=token').headers.get('location'),
      ).toBe('https://pyxis.example.com/p1/funnel');
      expect(
        visit('/sign-in?next=%2F%2Fevil.example', '__Host-pyxis_session=token').headers.get(
          'location',
        ),
      ).toBe('https://pyxis.example.com/');
    });

    it('ignores the parent-domain cookie the API used to set, so that visitor signs in again', () => {
      vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', 'https://api.pyxis.example.com');

      expect(visit('/p1/overview', 'pyxis_session=legacy').headers.get('location')).toBe(
        'https://pyxis.example.com/sign-in?next=%2Fp1%2Foverview',
      );
    });

    it('keeps a rejected session on the sign-in page, so nothing loops', () => {
      vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', 'https://api.pyxis.example.com');

      expect(
        visit('/sign-in?expired=1', '__Host-pyxis_session=stale').headers.get('location'),
      ).toBeNull();
    });

    it('lets a visitor with a session through, telling the page which address was asked', () => {
      vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', 'https://api.pyxis.example.com');
      const response = visit('/p1/overview?range=7d', '__Host-pyxis_session=token');

      expect(response.headers.get('location')).toBeNull();
      expect(response.headers.get('x-middleware-request-x-pyxis-requested-path')).toBe(
        '/p1/overview?range=7d',
      );
    });
  });

  describe('home page on the main domain, in demo mode', () => {
    it('renders the English page at the root of the main domain', () => {
      vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');
      const response = visitAt('https://pyxis-analytics.dev/');

      expect(response.headers.get('x-middleware-rewrite')).toBe(
        'https://pyxis-analytics.dev/landing/en',
      );
      expect(response.headers.get(FORWARDED_LOCALE_HEADER)).toBe('en');
      expect(response.headers.get('content-security-policy')).toContain("'strict-dynamic'");
      expect(response.headers.get('content-security-policy')).toContain(
        "connect-src 'self' https://api.pyxis-analytics.dev;",
      );
    });

    it('renders the Brazilian Portuguese page at /pt-br, keeping the campaign tags', () => {
      vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');
      const response = visitAt('https://pyxis-analytics.dev/pt-br?utm_source=linkedin');

      expect(response.headers.get('x-middleware-rewrite')).toBe(
        'https://pyxis-analytics.dev/landing/pt-br?utm_source=linkedin',
      );
      expect(response.headers.get(FORWARDED_LOCALE_HEADER)).toBe('pt-BR');
    });

    it('renders the Spanish page at /es', () => {
      vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');
      const response = visitAt('https://pyxis-analytics.dev/es');

      expect(response.headers.get('x-middleware-rewrite')).toBe(
        'https://pyxis-analytics.dev/landing/es',
      );
      expect(response.headers.get(FORWARDED_LOCALE_HEADER)).toBe('es');
    });

    it('knows the main domain by the Host header when the server calls itself localhost', () => {
      vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');
      const byHost = visitAt('http://localhost:3101/pt-br', { host: 'pyxis-analytics.dev:3101' });
      const byForwardedHost = visitAt('http://localhost:3101/', {
        host: 'localhost:3101',
        'x-forwarded-host': 'pyxis-analytics.dev',
      });

      expect(byHost.headers.get('x-middleware-rewrite')).toBe(
        'http://localhost:3101/landing/pt-br',
      );
      expect(byForwardedHost.headers.get(FORWARDED_LOCALE_HEADER)).toBe('en');
    });

    it('sends any other address on the main domain to the same address in the demo', () => {
      vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');

      const response = visitAt('https://pyxis-analytics.dev/p1/overview?range=7d');

      expect(response.status).toBe(308);
      expect(response.headers.get('location')).toBe(
        'https://demo.pyxis-analytics.dev/p1/overview?range=7d',
      );
    });

    it('sends the internal route to its public address, from any host', () => {
      vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');

      const fromDemo = visitAt('https://demo.pyxis-analytics.dev/landing/pt-br');
      const fromMain = visitAt('https://pyxis-analytics.dev/landing/en');

      expect(fromDemo.status).toBe(308);
      expect(fromDemo.headers.get('location')).toBe('https://pyxis-analytics.dev/pt-br');
      expect(fromMain.headers.get('location')).toBe('https://pyxis-analytics.dev/');
    });

    it('keeps the demo screens on the demo host, where nothing is measured', () => {
      vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');
      const response = visitAt('https://demo.pyxis-analytics.dev/');

      expect(response.headers.get('location')).toBeNull();
      expect(response.headers.get('x-middleware-rewrite')).toBeNull();
      expect(response.headers.get('content-security-policy')).toContain("connect-src 'self';");
    });

    it('drops a language header a visitor sends to any other page', () => {
      vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');
      const response = visitAt('https://demo.pyxis-analytics.dev/p1/overview', {
        'x-pyxis-path-locale': 'pt-BR',
      });

      expect(response.headers.get(FORWARDED_LOCALE_HEADER)).toBeNull();
      expect(forwardedHeaderNames(response)).not.toContain('x-pyxis-path-locale');
    });

    it('drops it on the dashboard too', () => {
      vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', 'https://api.pyxis.example.com');
      const response = visit('/p1/overview', '__Host-pyxis_session=token');
      const forged = visitAt('https://pyxis.example.com/p1/overview', {
        cookie: '__Host-pyxis_session=token',
        'x-pyxis-path-locale': 'pt-BR',
      });

      expect(response.headers.get(FORWARDED_LOCALE_HEADER)).toBeNull();
      expect(forwardedHeaderNames(forged)).not.toContain('x-pyxis-path-locale');
    });

    it('never serves the home page outside demo mode', () => {
      vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', 'https://api.pyxis.example.com');

      expect(visitAt('https://pyxis-analytics.dev/').headers.get('location')).toBe(
        'https://pyxis-analytics.dev/sign-in',
      );
    });
  });

  describe('preferences carried by a link from another Pyxis address', () => {
    it('remembers the language and the theme on the demo, then shows the clean address', () => {
      vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');
      const response = visitAt(
        'https://demo.pyxis-analytics.dev/p1/overview?range=7d&lang=pt-BR&theme=dark',
      );

      expect(response.status).toBe(307);
      expect(response.headers.get('location')).toBe(
        'https://demo.pyxis-analytics.dev/p1/overview?range=7d',
      );
      expect(response.cookies.get('pyxis_locale')).toMatchObject({
        value: 'pt-BR',
        httpOnly: true,
        path: '/',
      });
      expect(response.cookies.get('pyxis_theme')).toMatchObject({ value: 'dark', path: '/' });
      expect(response.cookies.get('pyxis_theme')?.httpOnly).toBeFalsy();
    });

    it('does it on the dashboard before asking for a session', () => {
      vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', 'https://api.pyxis.example.com');
      const response = visit('/sign-in?lang=en&theme=light');

      expect(response.headers.get('location')).toBe('https://pyxis.example.com/sign-in');
      expect(response.cookies.get('pyxis_locale')?.value).toBe('en');
      expect(response.cookies.get('pyxis_theme')?.value).toBe('light');
    });

    it('drops values it does not know without remembering them', () => {
      vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', 'https://api.pyxis.example.com');
      const response = visit('/sign-in?lang=fr&theme=neon');

      expect(response.headers.get('location')).toBe('https://pyxis.example.com/sign-in');
      expect(response.cookies.get('pyxis_locale')).toBeUndefined();
      expect(response.cookies.get('pyxis_theme')).toBeUndefined();
    });

    it('leaves them to the page on the main domain, which sets no cookie', () => {
      vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');
      const response = visitAt('https://pyxis-analytics.dev/pt-br?theme=dark');

      expect(response.headers.get('x-middleware-rewrite')).toBe(
        'https://pyxis-analytics.dev/landing/pt-br?theme=dark',
      );
      expect(response.cookies.getAll()).toEqual([]);
    });
  });

  describe('matcher', () => {
    const [pattern] = config.matcher;
    const matches = (path: string) => new RegExp(`^${pattern ?? ''}$`).test(path);

    it('never runs on static files or the app icons', () => {
      expect(matches('/p1/overview')).toBe(true);
      expect(matches('/icon.svg')).toBe(false);
      expect(matches('/apple-icon.png')).toBe(false);
      expect(matches('/manifest.webmanifest')).toBe(false);
      expect(matches('/_next/static/chunk.js')).toBe(false);
    });

    it('serves the crawler files without asking for a session', () => {
      expect(matches('/robots.txt')).toBe(false);
      expect(matches('/sitemap.xml')).toBe(false);
      expect(matches('/llms.txt')).toBe(false);
    });

    it('serves the logo the sign-in email loads without asking for a session', () => {
      expect(matches('/email/pyxis-logo.png')).toBe(false);
      expect(matches('/email/pyxis-logo@2x.png')).toBe(false);
    });
  });
});
