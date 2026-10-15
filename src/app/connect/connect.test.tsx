import { screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Admin } from '@/domain/admin';
import type { ConnectionRequest } from '@/domain/connection-requests';
import { UnauthenticatedError } from '@/domain/errors';
import type { IConnectionRequestsService } from '@/services/connection-requests/connection-requests-service.interface';
import {
  DEMO_CONNECTION_REQUEST_ID,
  MockConnectionRequestsService,
} from '@/services/connection-requests/mock-connection-requests-service';
import { renderWithMessages } from '@/test-utils/render-with-messages';
import { allowConnection, denyConnection } from './actions';
import ConnectPage, { generateMetadata } from './page';

const OTHER_REQUEST_ID = '0b1c2d3e-4f5a-4b6c-8d7e-9f0a1b2c3d4e';

const state = vi.hoisted<{ service: IConnectionRequestsService }>(() => ({
  service: {
    find: () => Promise.reject(new Error('find not set')),
    allow: () => Promise.reject(new Error('allow not set')),
    deny: () => Promise.reject(new Error('deny not set')),
  },
}));

vi.mock('@/services/connection-requests/connection-requests-service.factory', () => ({
  createConnectionRequestsService: () => state.service,
}));

vi.mock('@/services/projects/projects-service.factory', () => ({
  createProjectsService: () => ({
    currentAdmin: (): Promise<Admin> =>
      Promise.resolve({ email: 'owner@demo-store.example', projects: [] }),
  }),
}));

vi.mock('next/headers', () => ({
  cookies: () => Promise.resolve({ get: () => undefined }),
  headers: () =>
    Promise.resolve(
      new Headers({ 'x-pyxis-requested-path': `/connect?request=${DEMO_CONNECTION_REQUEST_ID}` }),
    ),
}));

vi.mock('next/navigation', () => ({
  redirect: (path: string) => {
    throw new Error(`redirect:${path}`);
  },
  notFound: () => {
    throw new Error('not-found');
  },
  useRouter: () => ({ refresh: vi.fn() }),
}));

function searchParamsOf(request?: string | string[]) {
  return Promise.resolve(request === undefined ? {} : { request });
}

function visit(request?: string | string[]) {
  return ConnectPage({ searchParams: searchParamsOf(request) });
}

describe('ConnectPage', () => {
  beforeEach(() => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', 'https://api.pyxis.example.com');
    state.service = new MockConnectionRequestsService();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('is titled for connecting an app', async () => {
    await expect(
      generateMetadata({ searchParams: searchParamsOf(DEMO_CONNECTION_REQUEST_ID) }),
    ).resolves.toEqual({ title: 'Connect an app' });
  });

  it('asks the signed-in admin whether to connect the app that sent the request', async () => {
    renderWithMessages(await visit(DEMO_CONNECTION_REQUEST_ID));

    expect(
      screen.getByRole('heading', { level: 1, name: 'Connect Claude Code to Pyxis?' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Signed in as owner@demo-store.example')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Allow' })).toBeEnabled();
  });

  it('says the request ended when the API no longer knows it', async () => {
    renderWithMessages(await visit(OTHER_REQUEST_ID));

    expect(
      screen.getByRole('heading', { level: 1, name: 'This connection request has ended' }),
    ).toBeInTheDocument();
  });

  it.each([
    ['no request', undefined],
    ['a request that is not an id', 'abc'],
    ['two requests', [DEMO_CONNECTION_REQUEST_ID, OTHER_REQUEST_ID]],
  ])('knows no page for %s, nor its title', async (_, request) => {
    await expect(visit(request)).rejects.toThrow('not-found');
    await expect(generateMetadata({ searchParams: searchParamsOf(request) })).rejects.toThrow(
      'not-found',
    );
  });

  it('knows no page in the demo, which has no API to connect to', async () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');

    await expect(visit(DEMO_CONNECTION_REQUEST_ID)).rejects.toThrow('not-found');
    await expect(
      generateMetadata({ searchParams: searchParamsOf(DEMO_CONNECTION_REQUEST_ID) }),
    ).rejects.toThrow('not-found');
  });

  it('sends an ended session to sign in, and back to this request after', async () => {
    state.service = {
      ...state.service,
      find: () => Promise.reject(new UnauthenticatedError()),
    };

    await expect(visit(DEMO_CONNECTION_REQUEST_ID)).rejects.toThrow(
      `redirect:/sign-in?expired=1&next=%2Fconnect%3Frequest%3D${DEMO_CONNECTION_REQUEST_ID}`,
    );
  });
});

describe('connect actions', () => {
  beforeEach(() => {
    state.service = new MockConnectionRequestsService();
  });

  it('allows and denies the request by its id', async () => {
    await expect(allowConnection(DEMO_CONNECTION_REQUEST_ID)).resolves.toMatchObject({
      kind: 'redirect',
    });
    await expect(denyConnection(DEMO_CONNECTION_REQUEST_ID)).resolves.toMatchObject({
      kind: 'redirect',
    });
  });

  it.each([allowConnection, denyConnection])('refuses anything but a request id', async (act) => {
    await expect(act('../../me/tokens')).rejects.toThrow(
      'A connection request is answered by its id.',
    );
  });

  it('sends an ended session to sign in', async () => {
    const ended = () => Promise.reject(new UnauthenticatedError());
    state.service = {
      find: () => Promise.resolve<ConnectionRequest | null>(null),
      allow: ended,
      deny: ended,
    };

    await expect(allowConnection(DEMO_CONNECTION_REQUEST_ID)).rejects.toThrow(/^redirect:/);
    await expect(denyConnection(DEMO_CONNECTION_REQUEST_ID)).rejects.toThrow(/^redirect:/);
  });
});
