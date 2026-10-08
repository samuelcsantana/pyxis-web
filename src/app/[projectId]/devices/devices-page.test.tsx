import { render, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Admin } from '@/domain/admin';
import type { DevicesReport } from '@/domain/devices';
import { UnauthenticatedError } from '@/domain/errors';
import { MockDevicesService } from '@/services/devices/mock-devices-service';
import type { IDevicesService } from '@/services/devices/devices-service.interface';
import DevicesPage from './page';

const state = vi.hoisted<{ admin: unknown; devices: IDevicesService['devices'] }>(() => ({
  admin: undefined,
  devices: () => Promise.reject(new Error('devices not set')),
}));

vi.mock('next/headers', () => ({
  cookies: () => Promise.resolve({ get: () => undefined }),
  headers: () => Promise.resolve(new Headers()),
}));

vi.mock('next/navigation', () => ({
  redirect: (path: string) => {
    throw new Error(`redirect:${path}`);
  },
  notFound: () => {
    throw new Error('not-found');
  },
  useRouter: () => ({ replace: vi.fn(), refresh: vi.fn() }),
  usePathname: () => '/p-store/devices',
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock('@/services/projects/projects-service.factory', () => ({
  createProjectsService: () => ({ currentAdmin: () => Promise.resolve(state.admin) }),
}));

vi.mock('@/services/devices/devices-service.factory', () => ({
  createDevicesService: (): IDevicesService => ({
    devices: (projectId, range) => state.devices(projectId, range),
  }),
}));

const STORE = {
  id: 'p-store',
  name: 'Demo Store',
  timezone: 'America/Sao_Paulo',
  conversionEvent: 'signup_completed',
};
const DOCS = { id: 'p-docs', name: 'Demo Docs', timezone: 'UTC', conversionEvent: null };
const ADMIN: Admin = { email: 'owner@demo-store.example', projects: [STORE, DOCS] };

function renderDevices(projectId = 'p-store') {
  return DevicesPage({
    params: Promise.resolve({ projectId }),
    searchParams: Promise.resolve({ range: '30d' }),
  });
}

beforeEach(() => {
  state.admin = ADMIN;
  state.devices = (projectId, range) => new MockDevicesService().devices(projectId, range);
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date('2026-10-06T02:30:00.000Z'));
});

describe('DevicesPage', () => {
  it('asks the breakdown of the period in the project time zone', async () => {
    const devices = vi.fn<IDevicesService['devices']>((projectId, range) =>
      new MockDevicesService().devices(projectId, range),
    );
    state.devices = devices;

    render(await renderDevices());

    expect(devices).toHaveBeenCalledWith('p-store', { from: '2026-09-06', to: '2026-10-05' });
    expect(screen.getByRole('heading', { level: 1, name: 'Devices' })).toBeInTheDocument();
    expect(screen.getByText('What people use to reach Demo Store')).toBeInTheDocument();
  });

  it('shows the three donuts, conversion by device and the countries', async () => {
    render(await renderDevices());

    for (const name of ['Device type', 'Browser', 'Operating system', 'Countries']) {
      expect(screen.getByRole('table', { name })).toBeInTheDocument();
    }
    expect(screen.getByRole('heading', { name: 'Conversion by device' })).toBeInTheDocument();
    expect(screen.getByText('Brazil')).toBeInTheDocument();
    expect(screen.getByRole('table', { name: 'Countries' }).closest('.grid')).toHaveClass(
      'xl:grid-cols-2',
    );
  });

  it('gives the conversion rate of each browser, system and country, not again per device type', async () => {
    render(await renderDevices());

    for (const name of ['Browser', 'Operating system', 'Countries']) {
      expect(
        within(screen.getByRole('table', { name })).getByRole('columnheader', {
          name: 'Conversion rate',
        }),
      ).toBeInTheDocument();
    }
    expect(
      within(screen.getByRole('table', { name: 'Device type' })).queryByRole('columnheader', {
        name: 'Conversion rate',
      }),
    ).toBeNull();
  });

  it('leaves conversion by device out for a project without a conversion event', async () => {
    render(await renderDevices('p-docs'));

    expect(screen.queryByRole('columnheader', { name: 'Conversion rate' })).toBeNull();

    expect(screen.getByRole('table', { name: 'Device type' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Conversion by device' })).not.toBeInTheDocument();
    expect(screen.getByText(/No conversion event is set for this project/)).toBeInTheDocument();
    expect(screen.getByRole('table', { name: 'Countries' }).closest('.grid')).not.toHaveClass(
      'xl:grid-cols-2',
    );
  });

  it('leaves conversion by device out when the API counted none', async () => {
    const report = await new MockDevicesService().devices('p-store', {
      from: '2026-09-06',
      to: '2026-10-05',
    });
    const counted: DevicesReport = {
      ...report,
      deviceTypes: report.deviceTypes.map((share) => ({ ...share, conversions: null })),
    };
    state.devices = (): Promise<DevicesReport> => Promise.resolve(counted);

    render(await renderDevices('p-store'));

    expect(screen.queryByRole('heading', { name: 'Conversion by device' })).not.toBeInTheDocument();
    expect(screen.queryByText(/No conversion event is set/)).not.toBeInTheDocument();
    expect(screen.getByRole('table', { name: 'Countries' }).closest('.grid')).not.toHaveClass(
      'xl:grid-cols-2',
    );
  });

  it('shows how to install the SDK when nobody visited in the period', async () => {
    state.devices = (): Promise<DevicesReport> =>
      Promise.resolve({ deviceTypes: [], browsers: [], operatingSystems: [], countries: [] });

    render(await renderDevices());

    expect(
      screen.getByRole('heading', { name: 'No events in this period yet' }),
    ).toBeInTheDocument();
  });

  it('calls an empty period quiet once the project has received events', async () => {
    state.devices = (): Promise<DevicesReport> =>
      Promise.resolve({ deviceTypes: [], browsers: [], operatingSystems: [], countries: [] });
    state.admin = {
      ...ADMIN,
      projects: [
        {
          ...STORE,
          firstEventAt: '2026-03-02T12:00:00.000Z',
          lastEventAt: '2026-09-20T01:30:00.000Z',
        },
        DOCS,
      ],
    };

    render(await renderDevices());

    expect(screen.getByRole('heading', { name: 'Nothing in this period' })).toBeInTheDocument();
    expect(screen.getByText(/The latest one arrived on Sep 19, 2026, 22:30\./)).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'See the last 30 days' })).not.toBeInTheDocument();
  });

  it('sends an expired session back to the sign-in page', async () => {
    state.devices = () => Promise.reject(new UnauthenticatedError());

    await expect(renderDevices()).rejects.toThrow('redirect:/sign-in?expired=1');
  });
});
