import { readFileSync } from 'node:fs';
import path from 'node:path';
import { renderHook } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { afterEach, describe, expect, it } from 'vitest';
import { THEME_BACKGROUNDS, themeColorFor, themeFromCookies } from './theme';
import { useChosenTheme } from './use-chosen-theme';

describe('themeFromCookies', () => {
  it('reads the chosen theme among other cookies', () => {
    expect(themeFromCookies('a=1; pyxis_theme=dark; b=2')).toBe('dark');
  });

  it('answers nothing when no theme was chosen', () => {
    expect(themeFromCookies('a=1; not_pyxis_theme=dark')).toBeUndefined();
    expect(themeFromCookies('')).toBeUndefined();
  });

  it('ignores a theme it does not know', () => {
    expect(themeFromCookies('pyxis_theme=neon')).toBeUndefined();
  });
});

describe('useChosenTheme', () => {
  afterEach(() => {
    document.cookie = 'pyxis_theme=; Max-Age=0; Path=/';
  });

  it('follows the theme cookie in the browser', () => {
    document.cookie = 'pyxis_theme=light; Path=/';

    const { result, unmount } = renderHook(() => useChosenTheme());

    expect(result.current).toBe('light');
    unmount();
  });

  it('chooses nothing on the server, so the page follows the system until it hydrates', () => {
    document.cookie = 'pyxis_theme=dark; Path=/';

    function ThemeProbe() {
      return <p>{useChosenTheme() ?? 'system'}</p>;
    }

    expect(renderToString(<ThemeProbe />)).toBe('<p>system</p>');
  });
});

describe('themeColorFor', () => {
  it('colours the browser bar with the background of the chosen theme', () => {
    expect(themeColorFor('dark')).toBe('#0a1220');
    expect(themeColorFor('light')).toBe('#f4f6fa');
  });

  it('follows the system preference when no theme was chosen', () => {
    expect(themeColorFor(undefined)).toEqual([
      { media: '(prefers-color-scheme: light)', color: '#f4f6fa' },
      { media: '(prefers-color-scheme: dark)', color: '#0a1220' },
    ]);
  });

  it('uses the same backgrounds as the stylesheet', () => {
    const stylesheet = readFileSync(
      path.join(import.meta.dirname, '..', 'app', 'globals.css'),
      'utf8',
    );

    expect(stylesheet).toContain(`--pyx-bg: ${THEME_BACKGROUNDS.light};`);
    expect(stylesheet).toContain(`--pyx-bg: ${THEME_BACKGROUNDS.dark};`);
  });
});
