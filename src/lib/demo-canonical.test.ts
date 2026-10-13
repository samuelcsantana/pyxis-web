import { describe, expect, it, vi } from 'vitest';
import { demoCanonical, liveDemoUrlOf } from './demo-canonical';

describe('liveDemoUrlOf', () => {
  it('places a path on the live demo address', () => {
    expect(liveDemoUrlOf('/p-store/overview')).toBe(
      'https://demo.pyxis-analytics.dev/p-store/overview',
    );
  });
});

describe('demoCanonical', () => {
  it('names the live demo address of the path as the canonical one in the demo', () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');

    expect(demoCanonical('/p-store/visits')).toEqual({
      alternates: { canonical: 'https://demo.pyxis-analytics.dev/p-store/visits' },
    });
  });

  it('adds nothing to a dashboard with a real API', () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', 'https://api.pyxis.example.com');

    expect(demoCanonical('/p-store/visits')).toEqual({});
  });
});
