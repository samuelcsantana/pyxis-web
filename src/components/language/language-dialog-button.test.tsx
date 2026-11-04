import { act, fireEvent, screen, waitFor, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { renderWithMessages } from '@/test-utils/render-with-messages';
import { LanguageDialogButton } from './language-dialog-button';

function renderButton(choose = vi.fn(() => Promise.resolve()), locale: 'en' | 'pt-BR' = 'en') {
  const parentKeys = vi.fn();
  const parentCancel = vi.fn();
  const view = renderWithMessages(
    <dialog open onKeyDown={parentKeys} onCancel={parentCancel} aria-label="Settings">
      <details open>
        <summary>Account menu</summary>
        <LanguageDialogButton choose={choose} className="row">
          Language
        </LanguageDialogButton>
      </details>
    </dialog>,
    locale,
  );
  return { ...view, choose, parentKeys, parentCancel };
}

function asDialog(element: HTMLElement): HTMLDialogElement {
  if (!(element instanceof HTMLDialogElement)) {
    throw new Error('not a dialog');
  }
  return element;
}

async function open(): Promise<HTMLDialogElement> {
  fireEvent.click(screen.getByRole('button', { name: 'Language' }));
  return asDialog(await screen.findByRole('dialog', { name: 'Language' }));
}

function search(): HTMLInputElement {
  return screen.getByRole('searchbox', { name: 'Search languages' });
}

describe('LanguageDialogButton', () => {
  it('opens a dialog over the page, closing the menu it sat in, with the search focused', async () => {
    renderButton();
    const menu = screen.getByText('Account menu').closest('details');

    const dialog = await open();

    expect(menu?.open).toBe(false);
    expect(dialog.open).toBe(true);
    expect(dialog.parentElement).toBe(document.body);
    expect(document.activeElement).toBe(search());
    expect(screen.getByRole('button', { name: 'Language' })).toHaveAttribute(
      'aria-haspopup',
      'dialog',
    );
  });

  it('lists every language in its own words, with its name in the language on screen', async () => {
    renderButton(undefined, 'pt-BR');
    fireEvent.click(screen.getByRole('button', { name: 'Language' }));
    const dialog = await screen.findByRole('dialog', { name: 'Idioma' });

    const choices = within(dialog).getAllByRole('button', { pressed: false });
    expect(choices.length + 1).toBe(7);
    const current = within(dialog).getByRole('button', { pressed: true });
    expect(current).toHaveTextContent('Português (Brasil)');
    expect(within(dialog).getByText('Deutsch')).toHaveAttribute('lang', 'de');
    expect(within(dialog).getByText('Alemão')).toBeInTheDocument();
  });

  it('gives a language no second name when it already reads the same', async () => {
    renderButton();
    const dialog = await open();

    const english = within(dialog).getByRole('button', { name: 'English' });
    expect(english).toHaveAttribute('aria-pressed', 'true');
    expect(within(dialog).getByText('Deutsch').closest('button')).toHaveAccessibleName(
      /^Deutsch, ?German$/,
    );
  });

  it('finds a language by any of its names or its code, accents aside', async () => {
    renderButton(undefined, 'pt-BR');
    fireEvent.click(screen.getByRole('button', { name: 'Language' }));
    const dialog = await screen.findByRole('dialog', { name: 'Idioma' });
    const field = within(dialog).getByRole('searchbox');

    for (const [query, found] of [
      ['alema', 'Deutsch'],
      ['ESPAN', 'Español'],
      ['dutch', 'Nederlands'],
      ['it', 'Italiano'],
    ] as const) {
      fireEvent.change(field, { target: { value: query } });
      expect(within(dialog).getByText(found)).toBeInTheDocument();
    }
    fireEvent.change(field, { target: { value: '   ' } });
    expect(within(dialog).getAllByRole('button', { pressed: false })).toHaveLength(6);
  });

  it('says when no language matches the search', async () => {
    renderButton();
    const dialog = await open();

    fireEvent.change(search(), { target: { value: ' klingon ' } });

    expect(within(dialog).getByRole('status')).toHaveTextContent('No language matches “klingon”.');
    fireEvent.keyDown(search(), { key: 'Enter' });
    expect(dialog.open).toBe(true);
  });

  it('chooses the first match on Enter, closes and gives the focus back to the menu', async () => {
    const { choose } = renderButton();
    const dialog = await open();
    fireEvent.change(search(), { target: { value: 'deu' } });

    fireEvent.keyDown(search(), { key: 'a' });
    expect(dialog.open).toBe(true);
    act(() => {
      fireEvent.keyDown(search(), { key: 'Enter' });
    });

    await waitFor(() => {
      expect(choose).toHaveBeenCalled();
    });
    const form = choose.mock.calls[0] as unknown as [FormData];
    expect(form[0].get('locale')).toBe('de');
    expect(screen.queryByRole('dialog', { name: 'Language' })).toBeNull();
    expect(document.activeElement).toBe(screen.getByText('Account menu'));
  });

  it('chooses the first match of what was typed even before the list caught up', async () => {
    const { choose } = renderButton();
    await open();
    const field = search();
    field.value = 'portu';

    act(() => {
      fireEvent.keyDown(field, { key: 'Enter' });
    });

    await waitFor(() => {
      expect(choose).toHaveBeenCalled();
    });
    const form = choose.mock.calls[0] as unknown as [FormData];
    expect(form[0].get('locale')).toBe('pt-BR');
  });

  it('chooses a language that is clicked, marking it at once', async () => {
    const { choose } = renderButton();
    const dialog = await open();

    fireEvent.click(within(dialog).getByRole('button', { name: /^Français/ }));

    await waitFor(() => {
      expect(choose).toHaveBeenCalled();
    });
    const form = choose.mock.calls[0] as unknown as [FormData];
    expect(form[0].get('locale')).toBe('fr');
  });

  it('closes with its button or a click on the backdrop, not a click inside', async () => {
    renderButton();
    let dialog = await open();

    fireEvent.click(within(dialog).getByRole('heading', { name: 'Language' }));
    expect(dialog.open).toBe(true);
    fireEvent.click(dialog);
    expect(screen.queryByRole('dialog', { name: 'Language' })).toBeNull();

    dialog = await open();
    fireEvent.click(within(dialog).getByRole('button', { name: 'Close' }));
    expect(screen.queryByRole('dialog', { name: 'Language' })).toBeNull();
  });

  it('opens on its own too, giving the focus back to itself', async () => {
    renderWithMessages(
      <LanguageDialogButton choose={() => Promise.resolve()} className="row">
        English
      </LanguageDialogButton>,
    );
    const button = screen.getByRole('button', { name: 'English' });

    fireEvent.click(button);
    fireEvent.click(await screen.findByRole('button', { name: 'Close' }));

    expect(document.activeElement).toBe(button);
  });

  it('keeps Escape and its cancel to itself, so the dialog behind it stays open', async () => {
    const { parentKeys, parentCancel } = renderButton();
    const dialog = await open();

    fireEvent.keyDown(search(), { key: 'Escape' });
    fireEvent(dialog, new Event('cancel', { cancelable: true }));
    expect(parentKeys).not.toHaveBeenCalled();
    expect(parentCancel).not.toHaveBeenCalled();

    fireEvent.keyDown(search(), { key: 'Tab' });
    expect(parentKeys).toHaveBeenCalledTimes(1);
  });
});
