import { beforeEach, describe, expect, it, vi } from 'vitest';
import { UnauthenticatedError } from '@/domain/errors';
import { readOrSignIn, sessionExpiredPath } from './current-admin';
import { REQUESTED_PATH_HEADER } from './requested-path';

const request = vi.hoisted(() => ({ headers: new Headers() }));

vi.mock('next/headers', () => ({
  headers: () => Promise.resolve(request.headers),
}));

vi.mock('next/navigation', () => ({
  redirect: (path: string) => {
    throw new Error(`redirect:${path}`);
  },
  notFound: () => {
    throw new Error('not-found');
  },
}));

beforeEach(() => {
  request.headers = new Headers();
});

describe('sessionExpiredPath', () => {
  it('adds the screen to come back to, when there is one', () => {
    expect(sessionExpiredPath(undefined)).toBe('/sign-in?expired=1');
    expect(sessionExpiredPath('/p1/requests?show=failing')).toBe(
      '/sign-in?expired=1&next=%2Fp1%2Frequests%3Fshow%3Dfailing',
    );
  });
});

describe('readOrSignIn', () => {
  it('sends an ended session to sign in, then back to the screen that was asked', async () => {
    request.headers.set(REQUESTED_PATH_HEADER, '/p1/visits?range=7d');

    await expect(readOrSignIn(() => Promise.reject(new UnauthenticatedError()))).rejects.toThrow(
      'redirect:/sign-in?expired=1&next=%2Fp1%2Fvisits%3Frange%3D7d',
    );
  });

  it('never sends anyone back to an address that is not a screen', async () => {
    request.headers.set(REQUESTED_PATH_HEADER, '//evil.example/p1/overview');

    await expect(readOrSignIn(() => Promise.reject(new UnauthenticatedError()))).rejects.toThrow(
      'redirect:/sign-in?expired=1',
    );
  });
});
