import { render, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { SettingsWindowHost } from './settings-window-host';

vi.mock('next/navigation', () => ({
  usePathname: () => '/p-store/overview',
  useSelectedLayoutSegments: () => [],
}));

vi.mock('./settings-dialog', () => {
  throw new TypeError('Failed to fetch dynamically imported module');
});

describe('SettingsWindowHost when the dialog cannot be preloaded', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('keeps showing what the slot holds and says why in the console', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    const { container } = render(
      <SettingsWindowHost closeLabel="Close">
        <p>Overview</p>
      </SettingsWindowHost>,
    );

    await waitFor(() => {
      expect(warn).toHaveBeenCalledWith(
        'settings window: could not preload the dialog',
        expect.any(Error),
      );
    });
    expect(container).toHaveTextContent('Overview');
  });
});
