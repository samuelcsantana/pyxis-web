import { describe, expect, it, vi } from 'vitest';
import { apiBaseUrl, isDemoMode } from './api-config';

describe('apiBaseUrl', () => {
  it('is undefined when the API URL is unset or blank, which means demo mode', () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '  ');

    expect(apiBaseUrl()).toBeUndefined();
    expect(isDemoMode()).toBe(true);
  });

  it('is undefined when the variable does not exist', () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', undefined);

    expect(apiBaseUrl()).toBeUndefined();
  });

  it('drops a trailing slash so paths can be appended', () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', 'https://api.pyxis.example.com/');

    expect(apiBaseUrl()).toBe('https://api.pyxis.example.com');
    expect(isDemoMode()).toBe(false);
  });

  it('keeps a URL without a trailing slash as it is', () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', 'http://localhost:3040');

    expect(apiBaseUrl()).toBe('http://localhost:3040');
  });
});
