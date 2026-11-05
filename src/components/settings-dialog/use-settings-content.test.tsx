import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { DEMO_STORE } from '@/services/demo/demo-projects';
import { MockProjectsService } from '@/services/projects/mock-projects-service';
import { englishTranslator } from '@/test-utils/english';
import { renderWithMessages } from '@/test-utils/render-with-messages';
import type { SettingsDialogData } from './settings-dialog-data';
import { loadSettingsContent } from './use-settings-content';

const asked = vi.hoisted(() => vi.fn<(projectId: string, locale: string) => void>());

vi.mock('./settings-content-cache', async () => {
  const { MockProjectsService: Projects } =
    await import('@/services/projects/mock-projects-service');
  const { englishTranslator: translator } = await import('@/test-utils/english');
  return {
    settingsContentOf: async (projectId: string, locale: string): Promise<SettingsDialogData> => {
      asked(projectId, locale);
      const settings = await new Projects(translator).settings(projectId);
      return {
        projectId,
        email: 'owner@example.com',
        theme: undefined,
        settings,
        owner: false,
        accounts: [],
        freePlan: 'closed',
        emailPreferences: {
          weeklyDigest: true,
          noEventsAlert: true,
          failedWritesAlert: true,
          conversionDropAlert: true,
        },
        sessions: [],
        accessTokens: [],
        connectedApps: { apps: [] },
        people: [],
      } as unknown as SettingsDialogData;
    },
    forgetSettingsContent: () => undefined,
  };
});

describe('loadSettingsContent', () => {
  it('reads the data of the project and draws each section in the language asked for', async () => {
    expect(await new MockProjectsService(englishTranslator).settings(DEMO_STORE.id)).toBeTruthy();

    const content = await loadSettingsContent(DEMO_STORE.id, 'pt-BR');

    expect(asked).toHaveBeenCalledWith(DEMO_STORE.id, 'pt-BR');
    expect(content.sections).not.toContain('data');
    renderWithMessages(<>{content.content.general}</>, 'pt-BR');
    expect(screen.getByText('Aparência')).toBeInTheDocument();
  });
});
