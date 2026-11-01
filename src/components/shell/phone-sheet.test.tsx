import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { PhoneSheet, type SheetTone } from './phone-sheet';

function renderSheet(open: boolean, onClose = vi.fn(), tone: SheetTone = 'nav') {
  const view = render(
    <PhoneSheet tone={tone} title="Screens" open={open} onClose={onClose}>
      <a href="#funnel">Funnel</a>
    </PhoneSheet>,
  );
  return { ...view, onClose };
}

function dialogOf(container: HTMLElement): HTMLDialogElement {
  const dialog = container.querySelector('dialog');
  if (dialog === null) {
    throw new Error('no sheet');
  }
  return dialog;
}

describe('PhoneSheet', () => {
  it('opens as a modal named by its title, and closes when it is told to', () => {
    const { container, rerender, onClose } = renderSheet(false);
    const dialog = dialogOf(container);
    expect(dialog.open).toBe(false);

    rerender(
      <PhoneSheet tone="nav" title="Screens" open onClose={onClose}>
        <a href="#funnel">Funnel</a>
      </PhoneSheet>,
    );
    expect(dialog.open).toBe(true);
    expect(screen.getByRole('dialog', { name: 'Screens' })).toBe(dialog);

    rerender(
      <PhoneSheet tone="nav" title="Screens" open={false} onClose={onClose}>
        <a href="#funnel">Funnel</a>
      </PhoneSheet>,
    );
    expect(dialog.open).toBe(false);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('gives the focus back to what opened it once closed, unless that was no HTML element', () => {
    const opener = document.createElement('button');
    document.body.append(opener);
    opener.focus();
    const { container, rerender, onClose } = renderSheet(true);
    opener.blur();

    rerender(
      <PhoneSheet tone="nav" title="Screens" open={false} onClose={onClose}>
        <a href="#funnel">Funnel</a>
      </PhoneSheet>,
    );
    expect(opener).toHaveFocus();

    const drawing = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    drawing.setAttribute('tabindex', '0');
    document.body.append(drawing);
    drawing.focus();
    rerender(
      <PhoneSheet tone="nav" title="Screens" open onClose={onClose}>
        <a href="#funnel">Funnel</a>
      </PhoneSheet>,
    );
    rerender(
      <PhoneSheet tone="nav" title="Screens" open={false} onClose={onClose}>
        <a href="#funnel">Funnel</a>
      </PhoneSheet>,
    );
    expect(dialogOf(container).open).toBe(false);
    expect(opener).not.toHaveFocus();
    opener.remove();
    drawing.remove();
  });

  it('asks to close on Escape instead of closing by itself', () => {
    const { container, onClose } = renderSheet(true);
    const dialog = dialogOf(container);
    const cancel = new Event('cancel', { cancelable: true });

    fireEvent(dialog, cancel);

    expect(cancel.defaultPrevented).toBe(true);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('asks to close on a tap outside, never on a tap or a drag that starts inside', () => {
    const { container, onClose } = renderSheet(true);
    const dialog = dialogOf(container);
    const link = screen.getByRole('link', { name: 'Funnel' });

    fireEvent.pointerDown(link);
    fireEvent.click(dialog);
    fireEvent.pointerDown(dialog);
    fireEvent.click(link);
    expect(onClose).not.toHaveBeenCalled();

    fireEvent.pointerDown(dialog);
    fireEvent.click(dialog);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('takes the navy of the bar or the card of the page', () => {
    const navy = renderSheet(true, vi.fn(), 'nav');
    expect(dialogOf(navy.container)).toHaveClass('bg-nav', 'text-nav-text');
    navy.unmount();

    const card = renderSheet(true, vi.fn(), 'card');
    expect(dialogOf(card.container)).toHaveClass('bg-card', 'text-ink');
    expect(screen.getByRole('heading', { name: 'Screens' })).toHaveClass('text-ink');
  });
});
