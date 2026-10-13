import { act, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { english } from '@/test-utils/english';
import { fakeSdk, SAMPLE_BATCH, startedMeasurement } from '@/test-utils/fake-measurement';
import { createMeasurement } from './landing-measurement';
import { LandingMeasurementBoot } from './landing-measurement-boot';
import { measurementLabelsOf, recordedLabelsOf } from './measurement-labels';
import { MeasurementNote } from './measurement-note';
import { RecordedDrawer } from './recorded-drawer';

const RECORDED = recordedLabelsOf(english);
const NOTE = measurementLabelsOf(english);

describe('RecordedDrawer', () => {
  it('shows nothing until measuring is on', () => {
    const { container } = render(
      <RecordedDrawer
        labels={RECORDED}
        locale="en-US"
        measurement={createMeasurement(fakeSdk())}
      />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('opens on a list of what this visit sent, newest first, and what never leaves', async () => {
    const sdk = fakeSdk();
    const measurement = startedMeasurement(sdk);
    render(<RecordedDrawer labels={RECORDED} locale="en-US" measurement={measurement} />);
    act(() => {
      sdk.sendBatch(SAMPLE_BATCH);
    });

    await userEvent.click(screen.getByRole('button', { name: 'What this page recorded 2' }));

    const panel = screen.getByRole('region', { name: 'What this page recorded' });
    expect(panel).toHaveTextContent('Visit 9ec8bf39… · this tab only');
    const items = within(panel).getAllByRole('listitem');
    expect(items[0]).toHaveTextContent('demo_opened/ · from: hero');
    expect(items[1]).toHaveTextContent('page_view/ · referrer: none');
    expect(within(panel).getByText('Never sent:').tagName).toBe('STRONG');
    expect(screen.getByRole('button', { name: /What this page recorded/ })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });

  it('names where the visit came from when it came from another site', async () => {
    const sdk = fakeSdk();
    const measurement = startedMeasurement(sdk);
    render(<RecordedDrawer labels={RECORDED} locale="en-US" measurement={measurement} />);
    act(() => {
      sdk.sendBatch({
        ...SAMPLE_BATCH,
        events: [
          {
            ...SAMPLE_BATCH.events[0],
            id: 'from-linkedin',
            name: 'page_view',
            occurred_at: '2026-10-13T18:00:00.000Z',
            session_id: 'abc',
            path: '/',
            attribution: { from_ad_click: false, referrer_host: 'www.linkedin.com' },
          },
        ],
      });
    });

    await userEvent.click(screen.getByRole('button', { name: /What this page recorded/ }));

    expect(screen.getByRole('listitem')).toHaveTextContent('referrer: www.linkedin.com');
  });

  it('says nothing was sent yet, then closes by its button or Escape, back on the toggle', async () => {
    const measurement = startedMeasurement(fakeSdk());
    render(<RecordedDrawer labels={RECORDED} locale="en-US" measurement={measurement} />);
    const toggle = screen.getByRole('button', { name: 'What this page recorded 0' });

    await userEvent.click(toggle);
    expect(screen.getByText(RECORDED.empty)).toBeInTheDocument();
    expect(screen.queryByText(/Visit/)).toBeNull();
    await userEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(screen.queryByRole('region')).toBeNull();
    expect(toggle).toHaveFocus();

    await userEvent.click(toggle);
    fireEvent.keyDown(document, { key: 'Tab' });
    expect(screen.getByRole('region')).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('region')).toBeNull();
    expect(toggle).toHaveFocus();
  });
});

describe('MeasurementNote', () => {
  it('says the page is measured, opens the recorded list and lets the visitor opt out', async () => {
    const sdk = fakeSdk();
    const measurement = startedMeasurement(sdk);
    render(<MeasurementNote labels={NOTE} measurement={measurement} />);

    expect(screen.getByText(/measured by Pyxis itself/)).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'See what it recorded' }));
    expect(measurement.drawerOpen()).toBe(true);

    await userEvent.click(screen.getByRole('button', { name: 'Don’t measure my visits' }));
    expect(screen.getByText('Measurement is off in this browser.')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Measure again' }));
    expect(screen.getByText(/measured by Pyxis itself/)).toBeInTheDocument();
    expect([sdk.calls.optOut, sdk.calls.optIn]).toEqual([1, 1]);
  });

  it('explains that the browser’s own signal turned measuring off', () => {
    render(
      <MeasurementNote
        labels={NOTE}
        measurement={startedMeasurement(fakeSdk('blocked-by-browser'))}
      />,
    );

    expect(
      screen.getByText('Measurement is off by your browser’s “do not track”.'),
    ).toBeInTheDocument();
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('says nothing before measuring starts', () => {
    const { container } = render(
      <MeasurementNote labels={NOTE} measurement={createMeasurement(fakeSdk())} />,
    );

    expect(container).toBeEmptyDOMElement();
  });
});

describe('on the server', () => {
  it('renders neither the note nor the recorded list, which only the browser knows', () => {
    const measurement = startedMeasurement(fakeSdk());

    expect(
      renderToString(
        <>
          <MeasurementNote labels={NOTE} measurement={measurement} />
          <RecordedDrawer labels={RECORDED} locale="en-US" measurement={measurement} />
        </>,
      ),
    ).toBe('');
  });
});

describe('LandingMeasurementBoot', () => {
  it('starts measuring with the page key and records clicks on tracked elements only', async () => {
    const sdk = fakeSdk();
    const measurement = createMeasurement(sdk);
    render(
      <>
        <a href="#demo" data-track="demo_opened" data-track-from="hero">
          <span>Open the live demo</span>
        </a>
        <a href="#plain">Plain</a>
        <LandingMeasurementBoot
          trackingKey="pyxis_pk_home"
          endpoint="https://api.pyxis-analytics.dev"
          labels={RECORDED}
          locale="en-US"
          measurement={measurement}
        />
      </>,
    );

    await userEvent.click(screen.getByText('Open the live demo'));
    await userEvent.click(screen.getByText('Plain'));
    fireEvent.click(document);

    expect(sdk.calls.init[0]).toMatchObject({ key: 'pyxis_pk_home' });
    expect(sdk.calls.track).toEqual([['demo_opened', { from: 'hero' }]]);
    expect(screen.getByRole('button', { name: /What this page recorded/ })).toBeInTheDocument();
  });

  it('stops listening for clicks when it leaves the page', async () => {
    const sdk = fakeSdk();
    const { unmount } = render(
      <>
        <button type="button" data-track="snippet_copied">
          Copy
        </button>
        <LandingMeasurementBoot
          trackingKey="pyxis_pk_home"
          endpoint="https://api.pyxis-analytics.dev"
          labels={RECORDED}
          locale="en-US"
          measurement={createMeasurement(sdk)}
        />
      </>,
    );
    const copy = screen.getByRole('button', { name: 'Copy' });
    unmount();
    document.body.append(copy);

    await userEvent.click(copy);

    expect(sdk.calls.track).toEqual([]);
    copy.remove();
  });
});
