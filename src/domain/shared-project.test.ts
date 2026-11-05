import { describe, expect, it } from 'vitest';
import { NO_DASHBOARD_FILTERS } from './dashboard-filters';
import {
  isSharedScreen,
  isShareToken,
  sharedApiPath,
  sharedFiltersOf,
  sharedPageHref,
} from './shared-project';
import { sharedProjectResponseSchema } from './shared-project.schema';

const TOKEN = `pyxis_sh_${'a1B2'.repeat(8)}`;

describe('isShareToken', () => {
  it('takes pyxis_sh_ and 32 letters and digits, nothing else', () => {
    expect(isShareToken(TOKEN)).toBe(true);
    expect(isShareToken(`${TOKEN}x`)).toBe(false);
    expect(isShareToken(`pyxis_pk_${'a'.repeat(32)}`)).toBe(false);
    expect(isShareToken('../overview')).toBe(false);
  });
});

describe('isSharedScreen', () => {
  it('shares only the screens of summed reports', () => {
    expect(isSharedScreen('funnel')).toBe(true);
    expect(isSharedScreen('visits')).toBe(false);
    expect(isSharedScreen('timeline')).toBe(false);
  });
});

describe('sharedFiltersOf', () => {
  it('drops the identity and property filters, which would narrow a sum to a person', () => {
    expect(
      sharedFiltersOf({
        ...NO_DASHBOARD_FILTERS,
        identity: 'identified',
        property: 'plan=pro',
        channel: 'paid',
      }),
    ).toEqual({ ...NO_DASHBOARD_FILTERS, channel: 'paid' });
  });
});

describe('the shared addresses', () => {
  it('build the API path of the card and of a report, with or without a query', () => {
    expect(sharedApiPath(TOKEN)).toBe(`/v1/shared/${TOKEN}`);
    expect(sharedApiPath(TOKEN, 'funnel/segments', '')).toBe(`/v1/shared/${TOKEN}/funnel/segments`);
    expect(sharedApiPath(TOKEN, 'overview', 'from=a')).toBe(`/v1/shared/${TOKEN}/overview?from=a`);
  });

  it('give the overview the address of the link itself and each other screen its own', () => {
    expect(sharedPageHref(TOKEN)).toBe(`/share/${TOKEN}`);
    expect(sharedPageHref(TOKEN, 'devices')).toBe(`/share/${TOKEN}/devices`);
  });
});

describe('sharedProjectResponseSchema', () => {
  it('reads the project card the link opens, its goals included', () => {
    expect(
      sharedProjectResponseSchema.parse({
        project: {
          name: 'Shop',
          timezone: 'America/Sao_Paulo',
          currency: 'BRL',
          city_enabled: false,
          visitors_enabled: true,
        },
        goals: [
          {
            id: 'g1',
            name: 'Sign-up',
            type: 'event',
            event: 'signup_completed',
            path: null,
            position: 1,
            created_at: '2026-11-01T00:00:00.000Z',
          },
        ],
        expires_at: '2026-12-01T00:00:00.000Z',
      }),
    ).toEqual({
      name: 'Shop',
      timezone: 'America/Sao_Paulo',
      currency: 'BRL',
      cityEnabled: false,
      visitorsEnabled: true,
      goals: [
        { id: 'g1', name: 'Sign-up', kind: 'event', target: 'signup_completed', position: 1 },
      ],
      expiresAt: '2026-12-01T00:00:00.000Z',
    });
  });
});
