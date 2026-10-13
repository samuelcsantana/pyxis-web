import { describe, expect, it, vi } from 'vitest';
import {
  landingIngestionUrl,
  landingTrackingKey,
  PYXIS_INGESTION_URL,
} from './landing-measurement-config';

describe('landing measurement config', () => {
  it('measures the home page only when a public key is configured', () => {
    vi.stubEnv('NEXT_PUBLIC_LANDING_PYXIS_KEY', ' pyxis_pk_home ');
    expect(landingTrackingKey()).toBe('pyxis_pk_home');

    vi.stubEnv('NEXT_PUBLIC_LANDING_PYXIS_KEY', '');
    expect(landingTrackingKey()).toBeUndefined();
  });

  it('sends to the production API unless another endpoint is configured', () => {
    vi.stubEnv('NEXT_PUBLIC_LANDING_PYXIS_ENDPOINT', '');
    expect(landingIngestionUrl()).toBe(PYXIS_INGESTION_URL);
    expect(PYXIS_INGESTION_URL).toBe('https://api.pyxis-analytics.dev');

    vi.stubEnv('NEXT_PUBLIC_LANDING_PYXIS_ENDPOINT', 'http://localhost:3101');
    expect(landingIngestionUrl()).toBe('http://localhost:3101');
  });
});
