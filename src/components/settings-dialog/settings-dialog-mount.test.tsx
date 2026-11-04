import { act, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderWithMessages } from '@/test-utils/render-with-messages';
import { preloadTheSettingsDialog, SettingsDialogMount } from './settings-dialog-mount';
import { closeSettings, forgetHowSettingsOpened, openSettings } from './settings-location';

vi.mock('./settings-dialog', () => ({
  SettingsDialog: ({ projectName }: { readonly projectName: string }) => (
    <p>The settings of {projectName}</p>
  ),
}));

vi.mock('next/navigation', () => ({
  usePathname: () => '/p1/overview',
  useSearchParams: () => new URLSearchParams(),
}));

beforeEach(() => {
  window.history.replaceState(null, '', '/p1/overview');
});

afterEach(() => {
  forgetHowSettingsOpened();
  closeSettings();
  window.history.replaceState(null, '', '/p1/overview');
});

describe('SettingsDialogMount', () => {
  it('loads nothing until the settings are asked for, then keeps the dialog mounted', async () => {
    renderWithMessages(<SettingsDialogMount projectId="p1" projectName="Demo Store" />);
    expect(screen.queryByText('The settings of Demo Store')).toBeNull();

    act(() => {
      openSettings('general');
    });
    expect(await screen.findByText('The settings of Demo Store')).toBeInTheDocument();

    act(() => {
      forgetHowSettingsOpened();
      closeSettings();
    });
    expect(screen.getByText('The settings of Demo Store')).toBeInTheDocument();
  });

  it('mounts the dialog at once when the address already asks for it', async () => {
    window.history.replaceState(null, '', '/p1/overview#settings/keys');
    act(() => {
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });

    renderWithMessages(<SettingsDialogMount projectId="p1" projectName="Demo Store" />);

    expect(await screen.findByText('The settings of Demo Store')).toBeInTheDocument();
  });

  it('starts loading the dialog ahead of time when asked', async () => {
    preloadTheSettingsDialog();

    await expect(import('./settings-dialog')).resolves.toHaveProperty('SettingsDialog');
  });
});
