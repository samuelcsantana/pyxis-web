import { describe, expect, it } from 'vitest';
import { hostnameOf, requestHostname } from './host-name';

describe('host name', () => {
  it('reads the host name without its port', () => {
    expect(hostnameOf('pyxis-analytics.dev')).toBe('pyxis-analytics.dev');
    expect(hostnameOf('pyxis-analytics.dev:3101')).toBe('pyxis-analytics.dev');
  });

  it('reads nothing from a missing, empty or malformed host', () => {
    expect(hostnameOf(null)).toBeUndefined();
    expect(hostnameOf('')).toBeUndefined();
    expect(hostnameOf('bad host')).toBeUndefined();
  });

  it('prefers the host the visitor asked for, as forwarded by the platform', () => {
    expect(
      requestHostname(
        new Headers({ 'x-forwarded-host': 'pyxis-analytics.dev', host: 'internal.vercel.app' }),
      ),
    ).toBe('pyxis-analytics.dev');
  });

  it('falls back to the host header, and to nothing without either', () => {
    expect(requestHostname(new Headers({ host: 'demo.pyxis-analytics.dev:443' }))).toBe(
      'demo.pyxis-analytics.dev',
    );
    expect(requestHostname(new Headers())).toBeUndefined();
  });
});
