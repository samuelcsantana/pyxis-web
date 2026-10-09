import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Admin } from '@/domain/admin';
import type { EmailPreferences } from '@/domain/email-preferences';
import { UnauthenticatedError } from '@/domain/errors';
import type { IEmailPreferencesService } from '@/services/preferences/email-preferences-service.interface';
import { chooseEmailPreferences } from './actions';

const state = vi.hoisted<{ admin: unknown; choose: IEmailPreferencesService['choose'] }>(() => ({
  admin: undefined,
  choose: () => Promise.reject(new Error('choose not set')),
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
}));

vi.mock('@/services/projects/projects-service.factory', () => ({
  createProjectsService: () => ({ currentAdmin: () => Promise.resolve(state.admin) }),
}));

vi.mock('@/services/preferences/email-preferences-service.factory', () => ({
  createEmailPreferencesService: (): Pick<IEmailPreferencesService, 'choose'> => ({
    choose: (projectId, preferences) => state.choose(projectId, preferences),
  }),
}));

const ADMIN: Admin = {
  email: 'owner@demo-store.example',
  projects: [{ id: 'p-store', name: 'Demo Store', timezone: 'UTC', conversionEvent: null }],
};

beforeEach(() => {
  state.admin = ADMIN;
  state.choose = (_projectId, preferences) => Promise.resolve(preferences);
});

describe('chooseEmailPreferences', () => {
  it("saves the admin's choice for a project they can read and answers what was stored", async () => {
    const choose = vi.fn<IEmailPreferencesService['choose']>(() =>
      Promise.resolve({ weeklyDigest: false }),
    );
    state.choose = choose;

    await expect(chooseEmailPreferences('p-store', { weeklyDigest: false })).resolves.toEqual({
      weeklyDigest: false,
    });
    expect(choose).toHaveBeenCalledWith('p-store', { weeklyDigest: false });
  });

  it('answers not found for a project the admin cannot read, without saving', async () => {
    const choose = vi.fn<IEmailPreferencesService['choose']>();
    state.choose = choose;

    await expect(chooseEmailPreferences('p-other', { weeklyDigest: false })).rejects.toThrow(
      'not-found',
    );
    expect(choose).not.toHaveBeenCalled();
  });

  it('refuses a choice that is not a weekly digest on or off, since it comes from the browser', async () => {
    const choose = vi.fn<IEmailPreferencesService['choose']>();
    state.choose = choose;
    const forged = { weeklyDigest: 'yes', monthly: true } as unknown as EmailPreferences;

    await expect(chooseEmailPreferences('p-store', forged)).rejects.toThrow(
      'E-mail preferences need a weekly digest choice, on or off.',
    );
    expect(choose).not.toHaveBeenCalled();
  });

  it('sends an expired session back to sign-in', async () => {
    state.choose = () => Promise.reject(new UnauthenticatedError());

    await expect(chooseEmailPreferences('p-store', { weeklyDigest: true })).rejects.toThrow(
      /^redirect:\/sign-in\?expired=1/,
    );
  });
});
