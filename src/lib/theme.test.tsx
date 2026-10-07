import { renderHook } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { afterEach, describe, expect, it } from 'vitest';
import { themeFromCookies } from './theme';
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
