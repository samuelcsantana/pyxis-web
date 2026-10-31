import { screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { english } from '@/test-utils/english';
import { portuguese } from '@/test-utils/portuguese';
import { renderWithMessages } from '@/test-utils/render-with-messages';
import { PreferencesPanel } from './preferences-panel';

const chooseNothing = () => Promise.resolve();

describe('PreferencesPanel', () => {
  afterEach(() => {
    delete document.documentElement.dataset.theme;
  });

  it('says the choices belong to this browser, then offers the three themes and the language', () => {
    document.documentElement.dataset.theme = 'dark';
    renderWithMessages(<PreferencesPanel i18n={english} theme="dark" choose={chooseNothing} />);

    expect(screen.getByText('These apply to this browser.')).toBeInTheDocument();
    const themes = screen.getByRole('group', { name: 'Theme' });
    expect(themes).toHaveAttribute('aria-labelledby', 'preferences-theme-label');
    expect(screen.getByRole('button', { name: 'Dark' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('combobox', { name: 'Language' })).toHaveDisplayValue('English');
  });

  it('follows the system theme when none was chosen in this browser', () => {
    renderWithMessages(<PreferencesPanel i18n={english} choose={chooseNothing} />);

    expect(screen.getByRole('button', { name: 'System' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('speaks Portuguese', () => {
    renderWithMessages(<PreferencesPanel i18n={portuguese} choose={chooseNothing} />, 'pt-BR');

    expect(screen.getByText('Valem para este navegador.')).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Tema' })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Idioma' })).toHaveDisplayValue(
      'Português (Brasil)',
    );
  });
});
