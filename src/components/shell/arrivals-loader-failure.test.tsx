import { render, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ArrivalsLoader } from './arrivals-loader';

vi.mock('./arrivals-watcher', () => {
  throw new TypeError('Failed to fetch dynamically imported module');
});

describe('ArrivalsLoader when the watcher cannot be loaded', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('draws nothing and says why in the console', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    const { container } = render(
      <ArrivalsLoader projectId="p-store" timeZone="America/Sao_Paulo" serverNow={0} />,
    );

    await waitFor(() => {
      expect(warn).toHaveBeenCalledWith('arrivals: could not load the watcher', expect.any(Error));
    });
    expect(container).toBeEmptyDOMElement();
  });
});
