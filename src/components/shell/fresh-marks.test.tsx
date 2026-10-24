import type { ReactNode } from 'react';
import { act, cleanup, render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { FreshCount, FreshVisit } from '@/components/ui/fresh-slots';
import { CLIENT_NAMESPACES, pickNamespaces } from '@/i18n/messages';
import { en } from '@/i18n/messages/en';
import { MessagesProvider } from '@/i18n/messages-provider';
import { createShownNumbersStore, type ShownRequest, shownReadKey } from '@/lib/shown-numbers';
import { renderWithMessages } from '@/test-utils/render-with-messages';
import type { ScreenReadNote } from './arrival-news';
import { CONTENT_ID } from './content-id';
import { createFreshMarks, type FreshMarks, FreshMarksView } from './fresh-marks';

const TODAY = '2026-10-24';
const FROM = '2026-09-25';
const OVERVIEW = '/p-store/overview';
const SEARCH = '?range=30d';

function note(readAt: number, path = OVERVIEW, search = SEARCH): ScreenReadNote {
  return { path, search, readAt };
}

function Content({ visits, pages }: { readonly visits: number; readonly pages: number }) {
  return (
    <main id={CONTENT_ID}>
      <p>
        Visits {visits}
        <FreshCount item="kpi:visits" value={visits} />
      </p>
      <p>
        Pages <FreshCount item="page:/" value={pages} />
      </p>
      <p>
        Unreadable <FreshCount item="broken" value={Number.NaN} />
        <span data-fresh-started="soon" />
        <span data-fresh-item="no-value" />
      </p>
      <p>
        Older visit <FreshVisit startedAt={500} />
      </p>
      <p>
        Newer visit <FreshVisit startedAt={1_500} />
      </p>
    </main>
  );
}

function show(source: FreshMarks, content: ReactNode) {
  return renderWithMessages(
    <>
      {content}
      <FreshMarksView source={source} />
    </>,
  );
}

describe('createFreshMarks', () => {
  let source: FreshMarks;

  beforeEach(() => {
    window.history.pushState(null, '', `${OVERVIEW}${SEARCH}`);
    source = createFreshMarks(createShownNumbersStore('p-store'));
  });

  afterEach(() => {
    cleanup();
    window.localStorage.clear();
    window.history.pushState(null, '', '/');
  });

  it('marks nothing on the first read, then what went up and the visits that started since', () => {
    const view = show(source, <Content visits={10} pages={4} />);
    act(() => {
      source.read(note(1_000), TODAY);
    });
    expect(source.marks()).toEqual([]);

    view.rerender(
      <>
        <Content visits={13} pages={4} />
        <FreshMarksView source={source} />
      </>,
    );
    act(() => {
      source.read(note(2_000), TODAY);
    });

    expect(source.marks().map(({ kind, arrived }) => [kind, arrived])).toEqual([
      ['count', true],
      ['visit', true],
    ]);
    expect(screen.getByText('+3')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByText('3 more since you last looked')).toHaveClass('sr-only');
    expect(screen.getByText('New')).toHaveAttribute('data-fresh-shown', 'arrived');
    expect(
      screen.getByText('Newer visit').querySelector('[data-fresh-started]'),
    ).not.toBeEmptyDOMElement();
    expect(
      screen.getByText('Older visit').querySelector('[data-fresh-started]'),
    ).toBeEmptyDOMElement();
  });

  it('shows the same marks again without an arrival when the same read comes back', () => {
    const view = show(source, <Content visits={10} pages={4} />);
    act(() => {
      source.read(note(1_000), TODAY);
    });
    view.rerender(
      <>
        <Content visits={1_250} pages={4} />
        <FreshMarksView source={source} />
      </>,
    );
    act(() => {
      source.read(note(2_000), TODAY);
    });

    act(() => {
      source.read(note(2_000), TODAY);
    });

    expect(screen.getByText('+1,240').parentElement).toHaveAttribute('data-fresh-shown', 'kept');
  });

  it('names a read by what changes its numbers, leaving out what only changes the display', () => {
    const asked: ShownRequest[] = [];
    const recording = createFreshMarks({
      compare(request) {
        asked.push(request);
        return undefined;
      },
    });
    show(recording, <Content visits={10} pages={4} />);
    const reads = [
      ['/p-store/overview', '?range=30d&metric=visits'],
      ['/p-store/funnel', '?range=30d&mode=user&by=channel&step=2&outcome=dropped&cursor=c1'],
      ['/p-store/requests', '?range=30d&kind=writes&route=POST+%2Forders'],
      ['/p-store/visits', '?range=30d&device=mobile'],
    ] as const;

    for (const [path, search] of reads) {
      window.history.pushState(null, '', `${path}${search}`);
      act(() => {
        recording.read(note(1_000, path, search), TODAY);
      });
    }

    expect(asked.map(({ key }) => key)).toEqual([
      shownReadKey('overview', FROM, TODAY, 'range=30d'),
      shownReadKey('funnel', FROM, TODAY, 'range=30d&mode=user'),
      shownReadKey('requests', FROM, TODAY, 'range=30d&kind=writes'),
      shownReadKey('visits', FROM, TODAY, 'range=30d&device=mobile'),
    ]);
    expect(asked[0]?.visitStarts).toEqual([500, 1_500]);
  });

  it('ignores a read of an address that is no longer shown', () => {
    show(source, <Content visits={10} pages={4} />);
    act(() => {
      source.read(note(1_000), TODAY);
    });
    const before = source.marks();

    act(() => {
      source.read(note(2_000, OVERVIEW, '?range=7d'), TODAY);
    });

    expect(source.marks()).toBe(before);
  });

  it('clears the marks on a page that is not a screen, or a screen with nothing to compare', () => {
    show(source, <Content visits={10} pages={4} />);
    act(() => {
      source.read(note(1_000), TODAY);
    });
    window.history.pushState(null, '', '/p-store/settings');

    act(() => {
      source.read(note(2_000, '/p-store/settings', ''), TODAY);
    });
    expect(source.marks()).toEqual([]);
    cleanup();

    window.history.pushState(null, '', '/p-store/timeline');
    render(<main id={CONTENT_ID}>Nothing counted here</main>);
    act(() => {
      source.read(note(3_000, '/p-store/timeline', ''), TODAY);
    });
    expect(source.marks()).toEqual([]);
    cleanup();

    window.history.pushState(null, '', `${OVERVIEW}${SEARCH}`);
    act(() => {
      source.read(note(4_000), TODAY);
    });
    expect(source.marks()).toEqual([]);
  });

  it('stops telling a view that is gone', () => {
    const view = show(source, <Content visits={10} pages={4} />);
    view.unmount();

    expect(() => {
      source.read(note(1_000), TODAY);
    }).not.toThrow();
  });

  it('draws nothing on the server', () => {
    expect(
      renderToString(
        <MessagesProvider locale="en" messages={pickNamespaces(en, CLIENT_NAMESPACES)}>
          <FreshMarksView source={source} />
        </MessagesProvider>,
      ),
    ).toBe('');
  });
});
