import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { entranceOf, InstallTabs, tabAfterKey } from './install-tabs';

const TABS = [
  { id: 'first', label: 'First', panel: <p>First panel</p> },
  { id: 'second', label: 'Second', panel: <p>Second panel</p> },
  { id: 'third', label: 'Third', panel: <p>Third panel</p> },
];

function renderTabs() {
  render(<InstallTabs label="How to install" tabs={TABS} />);
  return {
    tab: (name: string) => screen.getByRole('tab', { name }),
    panel: (name: string) => screen.getByRole('tabpanel', { name }),
  };
}

describe('tabAfterKey', () => {
  it.each([
    ['ArrowRight', 0, 1],
    ['ArrowRight', 2, 0],
    ['ArrowLeft', 1, 0],
    ['ArrowLeft', 0, 2],
    ['Home', 2, 0],
    ['End', 0, 2],
  ])('moves %s from tab %i to tab %i of three', (key, current, next) => {
    expect(tabAfterKey(key, current, 3)).toBe(next);
  });

  it('leaves every other key to the browser', () => {
    expect(tabAfterKey('Enter', 1, 3)).toBeUndefined();
  });
});

describe('entranceOf', () => {
  it.each([
    [0, 2, 'fromEnd'],
    [2, 1, 'fromStart'],
    [1, 1, 'still'],
  ])('slides the panel of tab %i to tab %i in %s', (previous, next, entrance) => {
    expect(entranceOf(previous, next)).toBe(entrance);
  });
});

describe('InstallTabs, measured by the browser', () => {
  beforeEach(() => {
    vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(120);
    vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(40);
    vi.spyOn(HTMLElement.prototype, 'offsetLeft', 'get').mockImplementation(function left(
      this: HTMLElement,
    ) {
      return Number(this.dataset.choice ?? 0) * 124;
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('lays a yellow thumb under the selected tab and slides it to the tab clicked', async () => {
    const { tab } = renderTabs();

    expect(screen.getByRole('tablist')).toHaveAttribute('data-sliding', '');
    expect(screen.getByTestId('sliding-indicator')).toHaveClass('bg-accent');
    expect(screen.getByTestId('sliding-indicator')).toHaveStyle({ translate: '0px 0px' });
    expect(tab('First')).toHaveClass('group-data-sliding/install-tabs:bg-transparent');

    await userEvent.click(tab('Third'));

    expect(screen.getByTestId('sliding-indicator')).toHaveStyle({ translate: '248px 0px' });
  });
});

describe('InstallTabs', () => {
  it('slides the next panel in from the side of the tab chosen', async () => {
    const { tab, panel } = renderTabs();
    expect(panel('First')).not.toHaveClass('motion-safe:animate-slide-from-end');

    await userEvent.click(tab('Third'));
    expect(panel('Third')).toHaveClass('motion-safe:animate-slide-from-end');

    await userEvent.click(tab('Second'));
    expect(panel('Second')).toHaveClass('motion-safe:animate-slide-from-start');
  });

  it('opens on the first tab, the only one reachable with Tab', () => {
    const { tab, panel } = renderTabs();

    expect(screen.getByRole('tablist', { name: 'How to install' })).toBeInTheDocument();
    expect(tab('First')).toHaveAttribute('aria-selected', 'true');
    expect(tab('First')).toHaveAttribute('tabindex', '0');
    expect(tab('Second')).toHaveAttribute('aria-selected', 'false');
    expect(tab('Second')).toHaveAttribute('tabindex', '-1');
    expect(tab('First')).toHaveAttribute('aria-controls', 'first-panel');
    expect(panel('First')).toHaveTextContent('First panel');
    expect(screen.queryByText('Second panel')).not.toBeVisible();
  });

  it('shows the panel of the tab clicked', async () => {
    const { tab, panel } = renderTabs();

    await userEvent.click(tab('Second'));

    expect(tab('Second')).toHaveAttribute('aria-selected', 'true');
    expect(panel('Second')).toHaveTextContent('Second panel');
    expect(screen.queryByText('First panel')).not.toBeVisible();
  });

  it('moves the selection and the focus with the arrow keys, Home and End', async () => {
    const { tab } = renderTabs();
    tab('First').focus();

    await userEvent.keyboard('{ArrowRight}');
    expect(tab('Second')).toHaveFocus();
    expect(tab('Second')).toHaveAttribute('aria-selected', 'true');

    await userEvent.keyboard('{End}');
    expect(tab('Third')).toHaveFocus();

    await userEvent.keyboard('{ArrowRight}');
    expect(tab('First')).toHaveFocus();

    await userEvent.keyboard('{ArrowLeft}');
    expect(tab('Third')).toHaveFocus();

    await userEvent.keyboard('{Home}');
    expect(tab('First')).toHaveFocus();
    expect(tab('First')).toHaveAttribute('aria-selected', 'true');
  });

  it('keeps the selection on any other key and lets the browser handle it', () => {
    const { tab } = renderTabs();

    const handled = !fireEvent.keyDown(tab('First'), { key: 'Enter' });

    expect(handled).toBe(false);
    expect(tab('First')).toHaveAttribute('aria-selected', 'true');
  });

  it('takes the arrow key from the browser so the page does not scroll', () => {
    const { tab } = renderTabs();

    const handled = !fireEvent.keyDown(tab('First'), { key: 'ArrowRight' });

    expect(handled).toBe(true);
  });
});
