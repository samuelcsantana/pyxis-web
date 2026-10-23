import { screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Admin } from '@/domain/admin';
import type { DevicesReport } from '@/domain/devices';
import { UnauthenticatedError } from '@/domain/errors';
import { MockDevicesService } from '@/services/devices/mock-devices-service';
import type { IDevicesService } from '@/services/devices/devices-service.interface';
import DevicesPage from './page';
import { renderWithMessages } from '@/test-utils/render-with-messages';

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
const ADMIN: Admin = { email: 'owner@example.com', projects: [STORE, DOCS] };

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

    renderWithMessages(await renderDevices());

    expect(devices).toHaveBeenCalledWith('p-store', { from: '2026-09-06', to: '2026-10-05' });
    expect(screen.queryByRole('banner')).not.toBeInTheDocument();
  });

  it('shows the three donuts, conversion by device, the countries and the regions', async () => {
    renderWithMessages(await renderDevices());

    for (const name of ['Device type', 'Browser', 'Operating system', 'Countries', 'Regions']) {
      expect(screen.getByRole('table', { name })).toBeInTheDocument();
    }
    expect(screen.getByRole('heading', { name: 'Conversion by device' })).toBeInTheDocument();
    expect(screen.getByText('Brazil')).toBeInTheDocument();
    expect(screen.getByText('São Paulo')).toBeInTheDocument();
    const grid = screen.getByRole('table', { name: 'Countries' }).closest('.grid');
    expect(grid).toHaveClass('xl:grid-cols-2');
    expect(grid?.children).toHaveLength(3);
    expect(grid).toContainElement(screen.getByRole('table', { name: 'Regions' }));
  });

  it('links each device type Visits filters by to its visits, in the same period', async () => {
    state.devices = async (projectId, range) => {
      const report = await new MockDevicesService().devices(projectId, range);
      const watch = { value: 'watch', visits: 1, conversions: 0, convertingVisits: 0 };
      return { ...report, deviceTypes: [...report.deviceTypes, watch] };
    };

    renderWithMessages(await renderDevices());

    const deviceTypes = screen.getByRole('table', { name: 'Device type' });
    expect(
      within(deviceTypes).getByRole('link', { name: 'Mobile: see its visits' }),
    ).toHaveAttribute('href', '/p-store/visits?range=30d&device=mobile');
    expect(within(deviceTypes).getAllByRole('link')).toHaveLength(3);
    expect(within(deviceTypes).getByRole('rowheader', { name: 'watch' })).toBeInTheDocument();
    expect(within(screen.getByRole('table', { name: 'Browser' })).queryByRole('link')).toBeNull();
  });

  it('links each country to its visits, in the same period, and leaves the rest unlinked', async () => {
    state.devices = async (projectId, range) => {
      const report = await new MockDevicesService().devices(projectId, range);
      const other = { value: 'other', visits: 3, conversions: 0, convertingVisits: 0 };
      return { ...report, countries: [...report.countries, other] };
    };

    renderWithMessages(await renderDevices());

    const countries = within(screen.getByRole('table', { name: 'Countries' }));
    expect(countries.getByRole('link', { name: 'Brazil: see its visits' })).toHaveAttribute(
      'href',
      '/p-store/visits?range=30d&country=BR',
    );
    expect(countries.queryByRole('link', { name: /^Other/ })).not.toBeInTheDocument();
  });

  it('links each region to its visits, in the same period, and leaves the rest unlinked', async () => {
    renderWithMessages(await renderDevices());

    const regions = within(screen.getByRole('table', { name: 'Regions' }));
    expect(regions.getByRole('link', { name: 'São Paulo: see its visits' })).toHaveAttribute(
      'href',
      '/p-store/visits?range=30d&region=BR-SP',
    );
    expect(regions.getByRole('rowheader', { name: 'Other regions' })).toBeInTheDocument();
    expect(regions.getByRole('rowheader', { name: 'Unknown' })).toBeInTheDocument();
    expect(regions.queryByRole('link', { name: /^(Other regions|Unknown)/ })).toBeNull();
  });

  it('gives the conversion rate of each browser, system and country, not again per device type', async () => {
    renderWithMessages(await renderDevices());

    for (const name of ['Browser', 'Operating system', 'Countries', 'Regions']) {
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
    renderWithMessages(await renderDevices('p-docs'));

    expect(screen.queryByRole('columnheader', { name: 'Conversion rate' })).toBeNull();

    expect(screen.getByRole('table', { name: 'Device type' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Conversion by device' })).not.toBeInTheDocument();
    expect(screen.getByText(/No conversion event is set for this project/)).toBeInTheDocument();
    const grid = screen.getByRole('table', { name: 'Countries' }).closest('.grid');
    expect(grid?.children).toHaveLength(2);
    expect(grid).toContainElement(screen.getByRole('table', { name: 'Regions' }));
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

    renderWithMessages(await renderDevices('p-store'));

    expect(screen.queryByRole('heading', { name: 'Conversion by device' })).not.toBeInTheDocument();
    expect(screen.queryByText(/No conversion event is set/)).not.toBeInTheDocument();
    const grid = screen.getByRole('table', { name: 'Countries' }).closest('.grid');
    expect(grid?.children).toHaveLength(2);
    expect(grid).toContainElement(screen.getByRole('table', { name: 'Regions' }));
  });

  it('offers every breakdown as one CSV file of the period', async () => {
    renderWithMessages(await renderDevices());

    expect(
      screen.getByRole('link', {
        name: 'Device types, browsers, systems, countries and regions as CSV',
      }),
    ).toHaveAttribute('href', '/p-store/devices/export?range=30d');
  });

  it('shows how to install the SDK when nobody visited in the period', async () => {
    state.devices = (): Promise<DevicesReport> =>
      Promise.resolve({
        deviceTypes: [],
        browsers: [],
        operatingSystems: [],
        countries: [],
        regions: [],
      });

    renderWithMessages(await renderDevices());

    expect(
      screen.getByRole('heading', { name: 'No events in this period yet' }),
    ).toBeInTheDocument();
  });

  it('calls an empty period quiet once the project has received events', async () => {
    state.devices = (): Promise<DevicesReport> =>
      Promise.resolve({
        deviceTypes: [],
        browsers: [],
        operatingSystems: [],
        countries: [],
        regions: [],
      });
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

    renderWithMessages(await renderDevices());

    expect(screen.getByRole('heading', { name: 'Nothing in this period' })).toBeInTheDocument();
    expect(screen.getByText(/The latest one arrived on Sep 19, 2026, 22:30\./)).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'See the last 30 days' })).not.toBeInTheDocument();
  });

  it('sends an expired session back to the sign-in page', async () => {
    state.devices = () => Promise.reject(new UnauthenticatedError());

    await expect(renderDevices()).rejects.toThrow('redirect:/sign-in?expired=1');
  });
});
