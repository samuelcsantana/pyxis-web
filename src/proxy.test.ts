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

describe('proxy', () => {
  it('asks for nothing in demo mode', () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');

    expect(visit('/p1/overview').headers.get('location')).toBeNull();
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

    it('sends a signed-in visitor away from the sign-in page, to a known screen only', () => {
      vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', 'https://api.pyxis.example.com');

      expect(visit('/sign-in', 'pyxis_session=token').headers.get('location')).toBe(
        'https://pyxis.example.com/',
      );
      expect(
        visit('/sign-in?next=%2Fp1%2Ffunnel', 'pyxis_session=token').headers.get('location'),
      ).toBe('https://pyxis.example.com/p1/funnel');
      expect(
        visit('/sign-in?next=%2F%2Fevil.example', 'pyxis_session=token').headers.get('location'),
      ).toBe('https://pyxis.example.com/');
    });

    it('keeps a rejected session on the sign-in page, so nothing loops', () => {
      vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', 'https://api.pyxis.example.com');

      expect(visit('/sign-in?expired=1', 'pyxis_session=stale').headers.get('location')).toBeNull();
    });

    it('lets a visitor with a session through, telling the page which address was asked', () => {
      vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', 'https://api.pyxis.example.com');
      const response = visit('/p1/overview?range=7d', 'pyxis_session=token');

      expect(response.headers.get('location')).toBeNull();
      expect(response.headers.get('x-middleware-request-x-pyxis-requested-path')).toBe(
        '/p1/overview?range=7d',
      );
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

    it('serves the logo the sign-in email loads without asking for a session', () => {
      expect(matches('/email/pyxis-logo.png')).toBe(false);
      expect(matches('/email/pyxis-logo@2x.png')).toBe(false);
    });
  });
});
