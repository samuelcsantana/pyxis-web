import type { ReactElement } from 'react';
import { describe, expect, it, vi } from 'vitest';
import RootLayout, { generateMetadata, generateViewport } from './layout';

const cookieStore = vi.hoisted(() => ({ theme: undefined as string | undefined }));

vi.mock('next/font/google', () => ({
  Geist: () => ({ variable: 'geist-sans-variable' }),
  Geist_Mono: () => ({ variable: 'geist-mono-variable' }),
}));

vi.mock('next/headers', () => ({
  cookies: () =>
    Promise.resolve({
      get: (name: string) =>
        name === 'pyxis_theme' && cookieStore.theme !== undefined
          ? { name, value: cookieStore.theme }
          : undefined,
    }),
}));

interface HtmlProps {
  readonly lang: string;
  readonly className: string;
  readonly 'data-theme'?: string;
  readonly children: ReactElement<{ children: ReactElement }>;
}

describe('RootLayout', () => {
  it('renders an English document with both font variables on <html>', async () => {
    cookieStore.theme = undefined;
    const page = <p>content</p>;
    const html = (await RootLayout({ children: page })) as ReactElement<HtmlProps>;

    expect(html.type).toBe('html');
    expect(html.props.lang).toBe('en');
    expect(html.props.className).toContain('geist-sans-variable');
    expect(html.props.className).toContain('geist-mono-variable');
    expect(html.props['data-theme']).toBeUndefined();
    expect(html.props.children.props.children).toBe(page);
  });

  it('applies the theme the visitor chose, so the first paint is right', async () => {
    cookieStore.theme = 'dark';

    const html = (await RootLayout({ children: null })) as ReactElement<HtmlProps>;

    expect(html.props['data-theme']).toBe('dark');
  });

  it('ignores a theme cookie it does not know', async () => {
    cookieStore.theme = 'neon';

    const html = (await RootLayout({ children: null })) as ReactElement<HtmlProps>;

    expect(html.props['data-theme']).toBeUndefined();
  });

  it('names the app in the metadata', () => {
    const metadata = generateMetadata();

    expect(metadata.title).toBe('Pyxis');
    expect(metadata.description).toMatch(/no cookies/);
  });

  it('lets search engines index the live demo', () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');

    expect(generateMetadata().robots).toBeNull();
  });

  it('keeps a dashboard with a real API out of search engines', () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', 'https://api.pyxis.example.com');

    expect(generateMetadata().robots).toEqual({ index: false, follow: false });
  });

  it('colours the browser bar with the chosen theme, or the system one', async () => {
    cookieStore.theme = 'dark';
    expect((await generateViewport()).themeColor).toBe('#0a1220');

    cookieStore.theme = undefined;
    expect((await generateViewport()).themeColor).toHaveLength(2);
  });
});
