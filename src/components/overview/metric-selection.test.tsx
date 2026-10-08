import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { use, useEffect, useState } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NavigationPendingProvider, NavigationRegion } from '@/components/shell/navigation-pending';
import type { KpiId } from '@/domain/overview';
import { MetricChartArea, MetricSelection, MetricToggle } from './metric-selection';

const replace = vi.hoisted(() =>
  vi.fn((url: string) => {
    window.history.replaceState(null, '', url);
  }),
);

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace }),
  usePathname: () => window.location.pathname,
  useSearchParams: () => new URLSearchParams(window.location.search),
}));

const AVAILABLE: readonly KpiId[] = ['visits', 'write-errors'];

function renderSelection() {
  return render(
    <MetricSelection available={AVAILABLE}>
      <p id="hint">Plots this figure per day on the chart below.</p>
      <MetricToggle metric="visits" label="Visits" describedBy="hint" />
      <MetricToggle metric="write-errors" label="Write error rate" describedBy="hint" />
      <MetricChartArea>
        <p>The chart</p>
      </MetricChartArea>
    </MetricSelection>,
  );
}

function toggle(name: string): HTMLElement {
  return screen.getByRole('button', { name, description: /per day on the chart/ });
}

beforeEach(() => {
  replace.mockClear();
  window.history.replaceState(null, '', '/p-store/overview?range=7d');
});

describe('MetricSelection', () => {
  it('presses no figure while the chart shows the activity', () => {
    renderSelection();

    expect(toggle('Visits')).toHaveAttribute('aria-pressed', 'false');
    expect(toggle('Write error rate')).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByText('The chart').parentElement).toHaveAttribute('aria-busy', 'false');
  });

  it('presses the figure the address names', () => {
    window.history.replaceState(null, '', '/p-store/overview?range=7d&metric=write-errors');
    renderSelection();

    expect(toggle('Write error rate')).toHaveAttribute('aria-pressed', 'true');
    expect(toggle('Visits')).toHaveAttribute('aria-pressed', 'false');
  });

  it('plots a figure on a click, writing it into the address without scrolling', async () => {
    renderSelection();

    await userEvent.click(toggle('Visits'));

    expect(replace).toHaveBeenCalledWith('/p-store/overview?range=7d&metric=visits', {
      scroll: false,
    });
    expect(toggle('Visits')).toHaveAttribute('aria-pressed', 'true');
    expect(toggle('Write error rate')).toHaveAttribute('aria-pressed', 'false');
  });

  it('moves the choice to another figure with the keyboard, keeping the focus', async () => {
    renderSelection();
    toggle('Visits').focus();

    await userEvent.keyboard(' ');
    await userEvent.tab();
    await userEvent.keyboard('{Enter}');

    expect(replace).toHaveBeenLastCalledWith('/p-store/overview?range=7d&metric=write-errors', {
      scroll: false,
    });
    expect(toggle('Write error rate')).toHaveAttribute('aria-pressed', 'true');
    expect(toggle('Write error rate')).toHaveFocus();
    expect(toggle('Visits')).toHaveAttribute('aria-pressed', 'false');
  });

  it('goes back to the activity when the pressed figure is pressed again', async () => {
    window.history.replaceState(null, '', '/p-store/overview?range=7d&metric=visits');
    renderSelection();

    await userEvent.click(toggle('Visits'));

    expect(replace).toHaveBeenCalledWith('/p-store/overview?range=7d', { scroll: false });
    expect(toggle('Visits')).toHaveAttribute('aria-pressed', 'false');
  });

  it('leaves the address without a query when the figure was all it named', async () => {
    window.history.replaceState(null, '', '/p-store/overview?metric=visits');
    renderSelection();

    await userEvent.click(toggle('Visits'));

    expect(replace).toHaveBeenCalledWith('/p-store/overview', { scroll: false });
  });

  it('marks the pressed figure and keeps the screen busy until its chart arrives', async () => {
    const arrival = Promise.withResolvers<undefined>();
    const destination: { open: (url: string) => void } = { open: () => undefined };
    function Destination() {
      const [opened, setOpened] = useState<string | null>(null);
      useEffect(() => {
        destination.open = setOpened;
      }, []);
      if (opened !== null) {
        use(arrival.promise);
      }
      return null;
    }
    replace.mockImplementationOnce((url: string) => {
      destination.open(url);
    });
    render(
      <NavigationPendingProvider>
        <NavigationRegion className="flex">
          <Destination />
          <MetricSelection available={AVAILABLE}>
            <p id="hint">Plots this figure per day on the chart below.</p>
            <MetricToggle metric="visits" label="Visits" describedBy="hint" />
            <MetricToggle metric="write-errors" label="Write error rate" describedBy="hint" />
          </MetricSelection>
        </NavigationRegion>
      </NavigationPendingProvider>,
    );
    const screenRegion = screen.getByText(
      'Plots this figure per day on the chart below.',
    ).parentElement;

    await act(async () => {
      await userEvent.click(toggle('Visits'));
    });

    expect(toggle('Visits').querySelector('[aria-hidden="true"]')).toHaveAttribute(
      'data-pending',
      '',
    );
    expect(toggle('Write error rate').querySelector('[aria-hidden="true"]')).not.toHaveAttribute(
      'data-pending',
    );
    expect(screenRegion).toHaveAttribute('aria-busy', 'true');

    await act(async () => {
      arrival.resolve(undefined);
      await arrival.promise;
    });

    expect(screenRegion).not.toHaveAttribute('aria-busy');
    expect(toggle('Visits').querySelector('[aria-hidden="true"]')).not.toHaveAttribute(
      'data-pending',
    );
  });

  it('refuses to render a toggle outside a selection', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);

    expect(() =>
      render(<MetricToggle metric="visits" label="Visits" describedBy="hint" />),
    ).toThrow('A metric toggle or chart area needs a MetricSelection around it.');
  });
});
