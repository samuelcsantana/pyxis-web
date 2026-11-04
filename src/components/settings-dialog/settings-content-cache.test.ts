import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { SettingsDialogData } from './settings-dialog-data';

const load = vi.hoisted(() => vi.fn<(projectId: string) => Promise<SettingsDialogData>>());

vi.mock('@/app/[projectId]/settings/dialog-actions', () => ({ loadSettingsDialog: load }));

const CONTENT = { projectId: 'p1' } as unknown as SettingsDialogData;

type Cache = typeof import('./settings-content-cache');
let cache: Cache;

beforeEach(async () => {
  load.mockReset();
  vi.resetModules();
  cache = await import('./settings-content-cache');
});

describe('the settings content cache', () => {
  it('asks the server once per project and language, and again after it is forgotten', async () => {
    load.mockResolvedValue(CONTENT);

    const first = cache.settingsContentOf('p1', 'en');
    const again = cache.settingsContentOf('p1', 'en');

    expect(again).toBe(first);
    await expect(first).resolves.toBe(CONTENT);
    expect(load).toHaveBeenCalledTimes(1);

    void cache.settingsContentOf('p1', 'pt-BR');
    void cache.settingsContentOf('p2', 'pt-BR');
    expect(load).toHaveBeenCalledTimes(3);

    cache.forgetSettingsContent();
    void cache.settingsContentOf('p2', 'pt-BR');
    expect(load).toHaveBeenCalledTimes(4);
  });

  it('asks again after a failed answer', async () => {
    load.mockRejectedValueOnce(new Error('offline')).mockResolvedValueOnce(CONTENT);

    await expect(cache.settingsContentOf('p1', 'en')).rejects.toThrow('offline');
    await expect(cache.settingsContentOf('p1', 'en')).resolves.toBe(CONTENT);
    expect(load).toHaveBeenCalledTimes(2);
  });
});
