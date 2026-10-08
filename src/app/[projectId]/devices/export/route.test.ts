import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Admin } from '@/domain/admin';
import type { IDevicesService } from '@/services/devices/devices-service.interface';
import { MockDevicesService } from '@/services/devices/mock-devices-service';
import { GET } from './route';

const state = vi.hoisted<{ devices: IDevicesService['devices'] }>(() => ({
  devices: () => Promise.reject(new Error('devices not set')),
}));

vi.mock('next/headers', () => ({
  headers: () => Promise.resolve(new Headers()),
}));

vi.mock('next/navigation', () => ({
  redirect: (path: string) => {
    throw new Error(`redirect:${path}`);
  },
  notFound: () => {
    throw new Error('not-found');
  },
}));

vi.mock('@/services/devices/devices-service.factory', () => ({
  createDevicesService: (): IDevicesService => ({
    devices: (projectId, range) => state.devices(projectId, range),
  }),
}));

const ADMIN: Admin = {
  email: 'owner@demo-store.example',
  projects: [
    {
      id: 'p-store',
      name: 'Demo Store',
      timezone: 'America/Sao_Paulo',
      conversionEvent: 'signup_completed',
    },
  ],
};

vi.mock('@/services/projects/projects-service.factory', () => ({
  createProjectsService: () => ({ currentAdmin: () => Promise.resolve(ADMIN) }),
}));

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date('2026-10-06T15:00:00.000Z'));
});

describe('GET /[projectId]/devices/export', () => {
  it('sends every breakdown of the period in one file', async () => {
    const devices = vi.fn<IDevicesService['devices']>((projectId, range) =>
      new MockDevicesService().devices(projectId, range),
    );
    state.devices = devices;
    const report = await new MockDevicesService().devices('p-store', {
      from: '2026-09-07',
      to: '2026-10-06',
    });

    const response = await GET(
      new NextRequest('https://pyxis.example.com/p-store/devices/export?range=30d'),
      { params: Promise.resolve({ projectId: 'p-store' }) },
    );

    expect(devices).toHaveBeenCalledWith('p-store', { from: '2026-09-07', to: '2026-10-06' });
    expect(response.headers.get('content-disposition')).toBe(
      'attachment; filename="pyxis-devices-2026-09-07-2026-10-06.csv"',
    );
    const rows = (await response.text()).trimEnd().split('\r\n');
    expect(rows[0]).toBe('dimension,value,visits,conversion_events,converting_visits');
    expect(rows).toHaveLength(
      1 +
        report.deviceTypes.length +
        report.browsers.length +
        report.operatingSystems.length +
        report.countries.length,
    );
  });
});
