import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { LocaleFlag } from './locale-flag';
import { LanguageFormSelect } from './language-form-select';
import { closeLanguageSelect } from './close-language-select';
import { LanguageOptionLabel, LanguageSelect } from './language-select';

function chooser() {
  return vi.fn<(form: FormData) => Promise<void>>(() => Promise.resolve());
}

function trigger(): HTMLElement {
  const summary = document.querySelector('summary');
  if (summary === null) {
    throw new Error('the language select has no trigger');
  }
  return summary;
}

describe('LanguageSelect', () => {
  it('shows the flag and the name of the language in use, named for screen readers', () => {
    render(
      <LanguageSelect locale="pt-BR" label="Idioma">
        <li>options</li>
      </LanguageSelect>,
    );

    expect(trigger()).toHaveTextContent('Idioma: Português (Brasil)');
    expect(within(trigger()).getByText('Português (Brasil)')).toHaveAttribute('lang', 'pt-BR');
    expect(trigger().querySelector('[data-flag="pt-BR"]')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByRole('list', { name: 'Idioma' })).toHaveTextContent('options');
  });

  it('opens on a click and closes on Escape, giving the focus back to its trigger', async () => {
    render(
      <LanguageSelect locale="en" label="Language">
        <li>
          <button type="button">Português</button>
        </li>
      </LanguageSelect>,
    );
    const details = trigger().closest('details');

    await userEvent.click(trigger());
    expect(details).toHaveAttribute('open');

    await userEvent.keyboard('{Escape}');
    expect(details).not.toHaveAttribute('open');
    expect(trigger()).toHaveFocus();
  });
});

describe('closeLanguageSelect', () => {
  it('closes the select an option belongs to', () => {
    render(
      <LanguageSelect locale="en" label="Language">
        <li>
          <button type="button">Español</button>
        </li>
      </LanguageSelect>,
    );
    const details = trigger().closest('details');
    details?.setAttribute('open', '');

    closeLanguageSelect(screen.getByRole('button', { name: 'Español' }));

    expect(details).not.toHaveAttribute('open');
  });

  it('does nothing for an element outside any select', () => {
    render(<button type="button">Alone</button>);

    expect(() => {
      closeLanguageSelect(screen.getByRole('button', { name: 'Alone' }));
    }).not.toThrow();
  });
});

describe('LanguageOptionLabel', () => {
  it('names the language in itself, with its flag, checking only the one in use', () => {
    const { rerender, container } = render(<LanguageOptionLabel locale="es" current />);

    expect(container).toHaveTextContent('Español');
    expect(container.querySelector('[data-flag="es"]')).toBeInTheDocument();
    expect(container.querySelector('svg:last-child')).not.toHaveClass('invisible');

    rerender(<LanguageOptionLabel locale="es" current={false} />);

    expect(container.querySelector('svg:last-child')).toHaveClass('invisible');
  });
});

describe('LocaleFlag', () => {
  it('draws a flag for every language, hidden from screen readers', () => {
    const { container } = render(
      <>
        <LocaleFlag locale="en" />
        <LocaleFlag locale="pt-BR" />
        <LocaleFlag locale="es" />
        <LocaleFlag locale="de" />
        <LocaleFlag locale="fr" />
        <LocaleFlag locale="it" />
        <LocaleFlag locale="nl" />
      </>,
    );

    const flags = [...container.querySelectorAll('svg')];
    expect(flags.map((flag) => flag.dataset.flag)).toEqual([
      'en',
      'pt-BR',
      'es',
      'de',
      'fr',
      'it',
      'nl',
    ]);
    expect(flags.every((flag) => flag.getAttribute('aria-hidden') === 'true')).toBe(true);
    expect(flags.every((flag) => flag.childElementCount > 1)).toBe(true);
  });
});

describe('LanguageFormSelect', () => {
  it('offers every language as a choice sent to the server, marking the one in use', async () => {
    const choose = chooser();
    render(<LanguageFormSelect locale="en" label="Language" choose={choose} />);
    await userEvent.click(trigger());

    const options = within(screen.getByRole('list', { name: 'Language' })).getAllByRole('button');
    expect(options.map((option) => option.getAttribute('lang'))).toEqual([
      'en',
      'pt-BR',
      'es',
      'de',
      'fr',
      'it',
      'nl',
    ]);
    expect(screen.getByRole('button', { name: 'English' })).toHaveAttribute('aria-pressed', 'true');

    await userEvent.click(screen.getByRole('button', { name: 'Español' }));

    expect(choose).toHaveBeenCalledOnce();
    expect(choose.mock.calls[0]?.[0].get('locale')).toBe('es');
  });

  it('closes and shows the language chosen at once, before the page in it arrives', async () => {
    const neverAnswers = vi.fn<(form: FormData) => Promise<void>>(
      () => new Promise(() => undefined),
    );
    render(<LanguageFormSelect locale="en" label="Language" choose={neverAnswers} />);
    await userEvent.click(trigger());

    await userEvent.click(screen.getByRole('button', { name: 'Português (Brasil)' }));

    expect(trigger().closest('details')).not.toHaveAttribute('open');
    expect(trigger()).toHaveTextContent('Language: Português (Brasil)');
    expect(screen.getByRole('button', { name: 'Português (Brasil)' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });
});
