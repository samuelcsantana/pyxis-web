import { render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { ArrivalsLoader } from './arrivals-loader';
import { noteScreenRead, takeScreenReads } from './arrival-news';
import { ScreenContent } from './screen-content';
import { ScreenRead } from './screen-read';

vi.mock('./arrivals-watcher', () => ({
  default: ({ projectId }: { readonly projectId: string }) => (
    <p data-testid="watcher">{projectId}</p>
  ),
}));

vi.mock('./refresh-when-stale', () => ({ RefreshWhenStale: () => null }));

vi.mock('./main-content', () => ({ MainContent: () => null }));

const PROPS = { projectId: 'p-store', timeZone: 'America/Sao_Paulo', serverNow: 0 };

describe('ArrivalsLoader', () => {
  it('loads the watcher only in the browser, after the page is shown', async () => {
    expect(renderToString(<ArrivalsLoader {...PROPS} />)).toBe('');

    render(<ArrivalsLoader {...PROPS} />);

    expect(await screen.findByTestId('watcher')).toHaveTextContent('p-store');
  });
});

describe('ScreenRead', () => {
  it('hands the moment the screen was read, with its address, to the watcher', () => {
    takeScreenReads();
    window.history.replaceState(null, '', '/p-store/funnel?range=7d');

    render(<ScreenRead readAt={1_000} />);

    expect(takeScreenReads()).toEqual([
      { path: '/p-store/funnel', search: '?range=7d', readAt: 1_000 },
    ]);
    noteScreenRead({ path: '/p-store/visits', search: '', readAt: 2_000 });
    expect(takeScreenReads()).toEqual([{ path: '/p-store/visits', search: '', readAt: 2_000 }]);
  });
});

describe('ScreenContent', () => {
  it('notes the read of an unfiltered screen and not of a filtered one, whose news are paused', () => {
    takeScreenReads();
    window.history.replaceState(null, '', '/p-store/overview?range=7d&os=ios');

    render(<ScreenContent readAt={3_000} filtered className="p-4" />);
    expect(takeScreenReads()).toEqual([]);

    render(<ScreenContent readAt={4_000} className="p-4" />);
    expect(takeScreenReads()).toHaveLength(1);
  });
});
