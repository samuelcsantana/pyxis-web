import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { DemoBanner } from './demo-banner';
import { EmptyPeriod } from './empty-period';
import { EmptyState } from './empty-state';
import { ErrorPanel } from './error-panel';
import { ENGLISH_ERROR_TEXTS, englishErrorTexts } from './english-error-texts';
import { errorTexts } from './error-screen';
import { english } from '@/test-utils/english';
import { installSnippet, NoActivityYet, PLACEHOLDER_ENDPOINT } from './no-activity-yet';
import { NoConversionEvent } from './no-conversion-event';

describe('EmptyState', () => {
  it('shows its title and explanation', () => {
    render(
      <EmptyState title="No projects yet">
        <p>Ask the operator to grant you one.</p>
      </EmptyState>,
    );

    expect(screen.getByRole('heading', { level: 2, name: 'No projects yet' })).toBeInTheDocument();
    expect(screen.getByText('Ask the operator to grant you one.')).toBeInTheDocument();
  });

  it('heads a whole page when asked to', () => {
    render(
      <EmptyState headingLevel="h1" title="Page not found">
        <p>This page does not exist.</p>
      </EmptyState>,
    );

    expect(screen.getByRole('heading', { level: 1, name: 'Page not found' })).toBeInTheDocument();
  });
});

const TEXTS = errorTexts(new Error('boom'), english.t);

describe('ErrorPanel', () => {
  it('is announced, shows the request detail and retries on demand', async () => {
    const retry = vi.fn();
    render(<ErrorPanel texts={{ ...TEXTS, detail: 'GET /v1/me · 503' }} onRetry={retry} />);

    await userEvent.click(screen.getByRole('button', { name: 'Try again' }));

    expect(screen.getByRole('alert')).toHaveTextContent('Could not load this data');
    expect(screen.getByText('GET /v1/me · 503')).toBeInTheDocument();
    expect(retry).toHaveBeenCalledOnce();
  });

  it('promises nothing it cannot know about the events being collected', () => {
    render(<ErrorPanel texts={TEXTS} />);

    expect(screen.getByRole('alert')).toHaveTextContent(
      'The dashboard could not read this data. Try again in a moment.',
    );
    expect(screen.getByRole('alert')).not.toHaveTextContent(/still being collected/);
  });

  it('heads a section by default and a whole page when asked to', () => {
    const { unmount } = render(<ErrorPanel texts={TEXTS} />);
    expect(
      screen.getByRole('heading', { level: 2, name: 'Could not load this data' }),
    ).toBeInTheDocument();
    unmount();

    render(<ErrorPanel headingLevel="h1" texts={TEXTS} />);

    expect(
      screen.getByRole('heading', { level: 1, name: 'Could not load this data' }),
    ).toBeInTheDocument();
  });

  it('shows neither detail nor retry when it has none', () => {
    render(<ErrorPanel texts={TEXTS} />);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.getByRole('alert').querySelectorAll('p')).toHaveLength(1);
  });
});

describe('error texts', () => {
  it('names the failure and gives its id only when it has one', () => {
    expect(errorTexts(new Error('boom'), english.t)).toEqual({
      title: 'Could not load this data',
      body: 'The dashboard could not read this data. Try again in a moment.',
      retry: 'Try again',
      detail: undefined,
    });
    expect(
      errorTexts(Object.assign(new Error('boom'), { digest: 'd1g35t' }), english.t).detail,
    ).toBe('error id d1g35t');
  });

  it('gives the page without a dictionary the same English text as the dictionary', () => {
    const withId = Object.assign(new Error('boom'), { digest: 'd1g35t' });

    expect(englishErrorTexts(withId)).toEqual(errorTexts(withId, english.t));
    expect(englishErrorTexts(new Error('boom'))).toEqual(errorTexts(new Error('boom'), english.t));
    expect(ENGLISH_ERROR_TEXTS.title).toBe(english.t('errorPanel.title'));
  });
});

describe('DemoBanner', () => {
  it('says the numbers are invented and links to the source code', () => {
    render(<DemoBanner i18n={english} />);

    expect(screen.getByRole('complementary', { name: 'Demo notice' })).toContainElement(
      screen.getByRole('note'),
    );
    expect(screen.getByRole('note')).toHaveTextContent('Demo data');
    expect(screen.getByRole('link', { name: 'Source on GitHub' })).toHaveAttribute(
      'href',
      'https://github.com/samuelcsantana/pyxis-web',
    );
  });
});

describe('NoActivityYet', () => {
  it('shows the install snippet for the API the dashboard talks to', () => {
    render(<NoActivityYet endpoint="https://api.pyxis.example.org" i18n={english} />);

    expect(screen.getByText(/endpoint: 'https:\/\/api\.pyxis\.example\.org'/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: "SDK's README" })).toHaveAttribute(
      'href',
      'https://github.com/samuelcsantana/pyxis-sdk#readme',
    );
  });

  it('shows a placeholder endpoint in demo mode', () => {
    render(<NoActivityYet endpoint={undefined} i18n={english} />);

    expect(screen.getByText(/npm install pyxis-analytics/).textContent).toBe(
      installSnippet(PLACEHOLDER_ENDPOINT),
    );
  });
});

describe('EmptyPeriod', () => {
  it('shows how to install the SDK on the first run', () => {
    render(
      <EmptyPeriod
        view={{ kind: 'first-run' }}
        widerPeriodHref="/p1/overview?range=30d"
        endpoint={undefined}
        i18n={english}
      />,
    );

    expect(screen.getByText(/npm install pyxis-analytics/)).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'See the last 30 days' })).not.toBeInTheDocument();
  });

  it('calls a quiet period quiet, says when the latest event arrived and offers 30 days', () => {
    render(
      <EmptyPeriod
        view={{ kind: 'quiet', latestEvent: 'Sep 19, 2026, 22:30', offersWiderPeriod: true }}
        widerPeriodHref="/p1/overview?range=30d"
        endpoint={undefined}
        i18n={english}
      />,
    );

    expect(
      screen.getByRole('heading', { level: 2, name: 'Nothing in this period' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'No event arrived in this period. The latest one arrived on Sep 19, 2026, 22:30.',
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'See the last 30 days' })).toHaveAttribute(
      'href',
      '/p1/overview?range=30d',
    );
    expect(screen.queryByText(/npm install/)).not.toBeInTheDocument();
  });

  it('offers no wider period from the last 30 days, and no time it does not know', () => {
    render(
      <EmptyPeriod
        view={{ kind: 'quiet', latestEvent: null, offersWiderPeriod: false }}
        widerPeriodHref="/p1/overview?range=30d"
        endpoint={undefined}
        i18n={english}
      />,
    );

    expect(screen.getByText('No event arrived in this period.')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'See the last 30 days' })).not.toBeInTheDocument();
  });
});

describe('NoConversionEvent', () => {
  it('names the command and the option that set a conversion event, as code', () => {
    const { container } = render(<NoConversionEvent i18n={english} />);

    expect(container).toHaveTextContent(
      "No conversion event is set for this project, so conversions are not shown. The operator sets one with the API's project:update command and its --conversion-event option.",
    );
    expect([...container.querySelectorAll('code')].map((code) => code.textContent)).toEqual([
      'project:update',
      '--conversion-event',
    ]);
  });
});
