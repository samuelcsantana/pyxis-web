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
    it('sends a visitor without a session to sign in', () => {
      vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', 'https://api.pyxis.example.com');

      expect(visit('/p1/overview').headers.get('location')).toBe(
        'https://pyxis.example.com/sign-in',
      );
    });

    it('lets a visitor without a session reach the sign-in page', () => {
      vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', 'https://api.pyxis.example.com');

      expect(visit('/sign-in').headers.get('location')).toBeNull();
    });

    it('sends a signed-in visitor away from the sign-in page', () => {
      vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', 'https://api.pyxis.example.com');

      expect(visit('/sign-in', 'pyxis_session=token').headers.get('location')).toBe(
        'https://pyxis.example.com/',
      );
    });

    it('keeps a rejected session on the sign-in page, so nothing loops', () => {
      vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', 'https://api.pyxis.example.com');

      expect(visit('/sign-in?expired=1', 'pyxis_session=stale').headers.get('location')).toBeNull();
    });

    it('lets a visitor with a session through', () => {
      vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', 'https://api.pyxis.example.com');

      expect(visit('/p1/overview', 'pyxis_session=token').headers.get('location')).toBeNull();
    });
  });

  it('never runs on static files or the app icons', () => {
    const [pattern] = config.matcher;
    const matches = (path: string) => new RegExp(`^${pattern ?? ''}$`).test(path);

    expect(matches('/p1/overview')).toBe(true);
    expect(matches('/icon.svg')).toBe(false);
    expect(matches('/apple-icon.png')).toBe(false);
    expect(matches('/_next/static/chunk.js')).toBe(false);
  });
});
