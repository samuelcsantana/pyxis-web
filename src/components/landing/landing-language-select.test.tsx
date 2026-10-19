import { fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { DEVICE_LOCALE_KEY, LANGUAGE_SWITCH_KEY } from '@/lib/language-choice';
import { DEFAULT_LANDING_PAGE, LANDING_PAGES, landingPageOfLocale } from '@/lib/landing-pages';
import { LanguageChoiceKeeper } from './language-choice-keeper';
import { LandingLanguageSelect } from './landing-language-select';
import { SECTION_KEEPING_LINKS } from './section-hash-sync';

function languages(label = 'Language') {
  return within(screen.getByRole('list', { name: label }));
}

describe('LandingLanguageSelect', () => {
  afterEach(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });

  it('links to each language at its own address, in its own language', () => {
    render(<LandingLanguageSelect current={DEFAULT_LANDING_PAGE} label="Language" />);

    const links = languages().getAllByRole('link');
    expect(links).toHaveLength(LANDING_PAGES.length);
    const portuguese = languages().getByRole('link', { name: 'Português (Brasil)' });
    expect(portuguese).toHaveAttribute('href', '/pt-br');
    expect(portuguese).toHaveAttribute('hreflang', 'pt-BR');
    expect(portuguese).toHaveAttribute('lang', 'pt-BR');
  });

  it('marks the language of the page as the current one', () => {
    render(<LandingLanguageSelect current={landingPageOfLocale('pt-BR')} label="Idioma" />);

    expect(languages('Idioma').getByRole('link', { current: 'page' })).toHaveAccessibleName(
      'Português (Brasil)',
    );
    expect(languages('Idioma').getByRole('link', { name: 'English' })).not.toHaveAttribute(
      'aria-current',
    );
  });

  it('measures and carries the section only through the links to another language', () => {
    render(<LandingLanguageSelect current={DEFAULT_LANDING_PAGE} label="Language" />);

    const english = languages().getByRole('link', { name: 'English' });
    const spanish = languages().getByRole('link', { name: 'Español' });
    expect(spanish.matches(SECTION_KEEPING_LINKS)).toBe(true);
    expect(spanish).toHaveAttribute('data-track', 'language_switched');
    expect(spanish).toHaveAttribute('data-track-to', 'es');
    expect(english.matches(SECTION_KEEPING_LINKS)).toBe(false);
    expect(english).not.toHaveAttribute('data-track');
  });

  it('remembers the language chosen and marks the switch for the next page', () => {
    render(
      <>
        <LandingLanguageSelect current={DEFAULT_LANDING_PAGE} label="Language" />
        <LanguageChoiceKeeper />
      </>,
    );

    let followed = false;
    const stayOnThePage = (event: MouseEvent) => {
      followed = !event.defaultPrevented;
      event.preventDefault();
    };
    document.addEventListener('click', stayOnThePage);

    fireEvent.click(languages().getByRole('link', { name: 'Español' }));
    document.removeEventListener('click', stayOnThePage);

    expect(followed).toBe(true);
    expect(window.localStorage.getItem(DEVICE_LOCALE_KEY)).toBe('es');
    expect(window.sessionStorage.getItem(LANGUAGE_SWITCH_KEY)).not.toBeNull();
  });

  it('only closes, remembering the choice, when the language of the page is chosen again', () => {
    render(
      <>
        <LandingLanguageSelect current={landingPageOfLocale('es')} label="Idioma" />
        <LanguageChoiceKeeper />
      </>,
    );
    const details = document.querySelector('details');
    details?.setAttribute('open', '');

    const followed = fireEvent.click(languages('Idioma').getByRole('link', { name: 'Español' }));

    expect(followed).toBe(false);
    expect(details).not.toHaveAttribute('open');
    expect(window.localStorage.getItem(DEVICE_LOCALE_KEY)).toBe('es');
    expect(window.sessionStorage.getItem(LANGUAGE_SWITCH_KEY)).toBeNull();
  });

  it('keeps nothing for a click elsewhere, nor once the page has gone', () => {
    const { unmount } = render(
      <>
        <LandingLanguageSelect current={DEFAULT_LANDING_PAGE} label="Language" />
        <a href="https://pyxis-analytics.dev/es" data-language-choice="ja">
          日本語
        </a>
        <p>Elsewhere</p>
        <LanguageChoiceKeeper />
      </>,
    );
    const stayOnThePage = (event: MouseEvent) => {
      event.preventDefault();
    };
    document.addEventListener('click', stayOnThePage);

    fireEvent.click(screen.getByText('Elsewhere'));
    document.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fireEvent.click(screen.getByRole('link', { name: '日本語' }));
    expect(window.localStorage.getItem(DEVICE_LOCALE_KEY)).toBeNull();

    window.sessionStorage.clear();
    const english = languages().getByRole('link', { name: 'English' });
    unmount();
    fireEvent.click(english);
    document.removeEventListener('click', stayOnThePage);

    expect(window.localStorage.getItem(DEVICE_LOCALE_KEY)).toBeNull();
    expect(window.sessionStorage.getItem(LANGUAGE_SWITCH_KEY)).toBeNull();
  });
});
