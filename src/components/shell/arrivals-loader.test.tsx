import { render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { ArrivalsLoader } from './arrivals-loader';
import { noteScreenRead, takeScreenReads } from './arrival-news';
import { ScreenRead } from './screen-read';

vi.mock('./arrivals-watcher', () => ({
  default: ({ projectId }: { readonly projectId: string }) => (
    <p data-testid="watcher">{projectId}</p>
  ),
}));

const PROPS = { projectId: 'p-store', timeZone: 'America/Sao_Paulo', serverNow: 0 };

describe('ArrivalsLoader', () => {
  it('loads the watcher only in the browser, after the page is shown', async () => {
    expect(renderToString(<ArrivalsLoader {...PROPS} />)).toBe('');

    render(<ArrivalsLoader {...PROPS} />);

    expect(await screen.findByTestId('watcher')).toHaveTextContent('p-store');
  });
});

describe('ScreenRead', () => {
  it('hands the moment the screen was read, with its path, to the watcher', () => {
    takeScreenReads();
    window.history.replaceState(null, '', '/p-store/funnel?range=7d');

    render(<ScreenRead readAt={1_000} />);

    expect(takeScreenReads()).toEqual([{ path: '/p-store/funnel', readAt: 1_000 }]);
    noteScreenRead({ path: '/p-store/visits', readAt: 2_000 });
    expect(takeScreenReads()).toEqual([{ path: '/p-store/visits', readAt: 2_000 }]);
  });
});
