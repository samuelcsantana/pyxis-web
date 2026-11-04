import { fireEvent, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderWithMessages } from '@/test-utils/render-with-messages';
import { OpenSettingsButton } from './open-settings-button';
import { closeSettings, forgetHowSettingsOpened, takeTheSettingsOpener } from './settings-location';

const prefetch = vi.hoisted(() => vi.fn(() => new Promise(() => undefined)));
const preload = vi.hoisted(() => vi.fn());

vi.mock('./settings-dialog-mount', () => ({ preloadTheSettingsDialog: preload }));

vi.mock('./settings-content-cache', () => ({
  settingsContentOf: prefetch,
  forgetSettingsContent: () => undefined,
}));

beforeEach(() => {
  prefetch.mockClear();
  preload.mockClear();
  window.history.replaceState(null, '', '/p1/overview');
});

afterEach(() => {
  takeTheSettingsOpener();
  forgetHowSettingsOpened();
  closeSettings();
  window.history.replaceState(null, '', '/p1/overview');
});

describe('OpenSettingsButton', () => {
  it('links the section, and starts loading the settings as soon as it is pointed at or focused', () => {
    renderWithMessages(
      <OpenSettingsButton projectId="p1" section="keys" className="row">
        Keys
      </OpenSettingsButton>,
    );
    const link = screen.getByRole('link', { name: 'Keys' });

    expect(link).toHaveAttribute('href', '#settings/keys');
    expect(link).toHaveClass('row');
    fireEvent.pointerEnter(link);
    fireEvent.focus(link);

    expect(prefetch).toHaveBeenCalledWith('p1', 'en');
    expect(prefetch).toHaveBeenCalledTimes(2);
    expect(preload).toHaveBeenCalledTimes(2);
  });

  it('opens the section in place, giving the focus back to itself later', () => {
    renderWithMessages(
      <OpenSettingsButton projectId="p1" section="install" className="row">
        Install
      </OpenSettingsButton>,
    );
    const link = screen.getByRole('link', { name: 'Install' });

    fireEvent.click(link);

    expect(window.location.hash).toBe('#settings/install');
    expect(takeTheSettingsOpener()).toBe(link);
  });

  it('closes the menu it sits in, giving the focus back to the menu button later', () => {
    renderWithMessages(
      <details open>
        <summary>Account menu</summary>
        <OpenSettingsButton projectId="p1" section="general" className="row">
          Settings
        </OpenSettingsButton>
      </details>,
    );
    const menu = screen.getByText('Account menu').closest('details');

    fireEvent.click(screen.getByRole('link', { name: 'Settings' }));

    expect(menu?.open).toBe(false);
    expect(takeTheSettingsOpener()).toBe(screen.getByText('Account menu'));
  });
});
