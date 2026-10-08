import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DismissableDetails } from './dismissable-details';

function renderPopover({ defaultOpen = true }: { defaultOpen?: boolean } = {}) {
  const view = render(
    <>
      <DismissableDetails defaultOpen={defaultOpen} className="popover">
        <summary>Choose</summary>
        <a href="#first">First</a>
        <a href="#second">Second</a>
        <p>Plain text</p>
      </DismissableDetails>
      <button type="button">Outside</button>
    </>,
  );
  const details = view.container.querySelector('details');
  if (details === null) {
    throw new Error('no details element');
  }
  return { details, summary: screen.getByText('Choose'), unmount: view.unmount };
}

describe('DismissableDetails', () => {
  it('starts closed unless asked to start open, and keeps its own attributes', () => {
    const { details } = renderPopover({ defaultOpen: false });

    expect(details.open).toBe(false);
    expect(details).toHaveClass('popover');
  });

  it('starts open when asked to', () => {
    expect(renderPopover().details.open).toBe(true);
  });

  it('closes on Escape, gives the focus back to its summary and marks the key as handled', () => {
    const { details, summary } = renderPopover();
    const link = screen.getByRole('link', { name: 'First' });
    link.focus();

    const notCancelled = fireEvent.keyDown(link, { key: 'Escape' });

    expect(details.open).toBe(false);
    expect(summary).toHaveFocus();
    expect(notCancelled).toBe(false);
  });

  it('leaves Escape to others while closed', () => {
    const { details, summary } = renderPopover({ defaultOpen: false });

    const notCancelled = fireEvent.keyDown(summary, { key: 'Escape' });

    expect(details.open).toBe(false);
    expect(notCancelled).toBe(true);
  });

  it('stays open on any other key', () => {
    const { details } = renderPopover();

    fireEvent.keyDown(screen.getByRole('link', { name: 'First' }), { key: 'Enter' });

    expect(details.open).toBe(true);
  });

  it('closes on Escape even without a summary to focus', () => {
    const { container } = render(
      <DismissableDetails defaultOpen>
        <a href="#only">Only</a>
      </DismissableDetails>,
    );

    fireEvent.keyDown(screen.getByRole('link', { name: 'Only' }), { key: 'Escape' });

    expect(container.querySelector('details')?.open).toBe(false);
  });

  it('closes when the focus moves to an element outside it', () => {
    const { details } = renderPopover();

    fireEvent.blur(screen.getByRole('link', { name: 'Second' }), {
      relatedTarget: screen.getByRole('button', { name: 'Outside' }),
    });

    expect(details.open).toBe(false);
  });

  it('stays open while the focus moves between its own elements', () => {
    const { details } = renderPopover();

    fireEvent.blur(screen.getByRole('link', { name: 'First' }), {
      relatedTarget: screen.getByRole('link', { name: 'Second' }),
    });

    expect(details.open).toBe(true);
  });

  it('stays open when the focus goes nowhere, as when a date picker takes it', () => {
    const { details } = renderPopover();

    fireEvent.blur(screen.getByRole('link', { name: 'First' }), { relatedTarget: null });

    expect(details.open).toBe(true);
  });

  it('closes on a pointer pressed outside it', () => {
    const { details } = renderPopover();

    fireEvent.pointerDown(screen.getByRole('button', { name: 'Outside' }));

    expect(details.open).toBe(false);
  });

  it('stays open on a pointer pressed inside it', () => {
    const { details } = renderPopover();

    fireEvent.pointerDown(screen.getByText('Plain text'));

    expect(details.open).toBe(true);
  });

  it('ignores a pointer pressed outside while closed', () => {
    const { details } = renderPopover({ defaultOpen: false });

    fireEvent.pointerDown(screen.getByRole('button', { name: 'Outside' }));

    expect(details.open).toBe(false);
  });

  it('stops listening to the page once it is gone', () => {
    const { details, unmount } = renderPopover();
    unmount();
    details.open = true;

    fireEvent.pointerDown(document.body);

    expect(details.open).toBe(true);
  });
});
