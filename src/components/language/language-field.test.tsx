import { fireEvent, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { Locale } from '@/i18n/locales';
import { renderWithMessages } from '@/test-utils/render-with-messages';
import { LanguageField } from './language-field';

function renderField(locale: Locale = 'en') {
  const choose = vi.fn<(form: FormData) => Promise<void>>(() => Promise.resolve());
  const view = renderWithMessages(
    <LanguageField locale={locale} label="Language" choose={choose} />,
  );
  const select = screen.getByRole<HTMLSelectElement>('combobox', { name: 'Language' });
  return { choose, select, view };
}

function chosenLocales(choose: ReturnType<typeof renderField>['choose']): unknown[] {
  return choose.mock.calls.map(([form]) => form.get('locale'));
}

function pick(select: HTMLSelectElement, locale: string) {
  fireEvent.change(select, { target: { value: locale } });
}

describe('LanguageField', () => {
  it('names the field and shows the current language among the seven, each in its own language', () => {
    const { select } = renderField('pt-BR');

    expect(select).toHaveDisplayValue('Português (Brasil)');
    expect(select).toHaveAttribute('name', 'locale');
    const options = [...select.options];
    expect(options.map((option) => option.value)).toEqual([
      'en',
      'pt-BR',
      'es',
      'de',
      'fr',
      'it',
      'nl',
    ]);
    expect(options.map((option) => option.lang)).toEqual(options.map((option) => option.value));
    expect(options.find((option) => option.value === 'de')).toHaveTextContent('Deutsch');
  });

  it('switches at once when a language is picked from the list with a pointer', async () => {
    const { choose, select } = renderField();

    fireEvent.pointerDown(select);
    pick(select, 'es');

    expect(select).toHaveDisplayValue('Español');
    await waitFor(() => {
      expect(chosenLocales(choose)).toEqual(['es']);
    });
  });

  it('waits while the keyboard browses the closed field, and switches on Enter', async () => {
    const { choose, select } = renderField();

    fireEvent.keyDown(select, { key: 'ArrowDown' });
    pick(select, 'pt-BR');
    fireEvent.keyUp(select, { key: 'ArrowDown' });
    fireEvent.keyDown(select, { key: 'ArrowDown' });
    pick(select, 'es');
    fireEvent.keyUp(select, { key: 'ArrowDown' });

    expect(select).toHaveDisplayValue('Español');
    expect(choose).not.toHaveBeenCalled();

    const enter = fireEvent.keyDown(select, { key: 'Enter' });

    expect(enter).toBe(false);
    await waitFor(() => {
      expect(chosenLocales(choose)).toEqual(['es']);
    });
  });

  it('waits on a letter typed to find a language, as on an arrow', () => {
    const { choose, select } = renderField();

    fireEvent.keyDown(select, { key: 'd' });
    pick(select, 'de');

    expect(choose).not.toHaveBeenCalled();
  });

  it('switches when the keyboard leaves the field on another language', async () => {
    const { choose, select } = renderField();
    const elsewhere = document.createElement('button');
    document.body.append(elsewhere);

    fireEvent.keyDown(select, { key: 'ArrowUp' });
    pick(select, 'fr');
    fireEvent.blur(select, { relatedTarget: elsewhere });

    await waitFor(() => {
      expect(chosenLocales(choose)).toEqual(['fr']);
    });
    elsewhere.remove();
  });

  it('keeps waiting while the focus only moves into the open list of the field', () => {
    const { choose, select } = renderField();
    const option = select.options[3];

    fireEvent.keyDown(select, { key: 'ArrowDown' });
    pick(select, 'de');
    fireEvent.blur(select, { relatedTarget: option });

    expect(choose).not.toHaveBeenCalled();
  });

  it('switches on a choice made with the keyboard inside the open list', async () => {
    const { choose, select } = renderField();
    const option = select.options[5];
    if (option === undefined) {
      throw new Error('The field lists Italian.');
    }

    const enter = fireEvent.keyDown(option, { key: 'Enter' });
    pick(select, 'it');

    expect(enter).toBe(true);
    await waitFor(() => {
      expect(chosenLocales(choose)).toEqual(['it']);
    });
  });

  it('does not count Tab, Escape or a modifier as browsing', async () => {
    const { choose, select } = renderField();

    fireEvent.keyDown(select, { key: 'Tab' });
    pick(select, 'nl');

    await waitFor(() => {
      expect(chosenLocales(choose)).toEqual(['nl']);
    });
  });

  it('sends nothing when Enter or leaving finds the language already on the page', () => {
    const { choose, select } = renderField('de');

    fireEvent.keyDown(select, { key: 'Enter' });
    fireEvent.blur(select);

    expect(choose).not.toHaveBeenCalled();
  });

  it('sends a language once, even when Enter and leaving the field both follow it', async () => {
    const { choose, select } = renderField();

    fireEvent.keyDown(select, { key: 'ArrowDown' });
    pick(select, 'pt-BR');
    fireEvent.keyDown(select, { key: 'Enter' });
    fireEvent.blur(select);

    await waitFor(() => {
      expect(chosenLocales(choose)).toEqual(['pt-BR']);
    });
    expect(choose).toHaveBeenCalledTimes(1);
  });

  it('ignores a value that is not one of its languages', () => {
    const { choose, select } = renderField();

    pick(select, 'xx');

    expect(choose).not.toHaveBeenCalled();
  });

  it('shows the language of the page again once the page answers in it', () => {
    const { select, view } = renderField('en');
    fireEvent.pointerDown(select);
    pick(select, 'es');

    view.rerender(<LanguageField locale="es" label="Language" choose={() => Promise.resolve()} />);

    expect(screen.getByRole('combobox', { name: 'Language' })).toHaveDisplayValue('Español');
  });
});
