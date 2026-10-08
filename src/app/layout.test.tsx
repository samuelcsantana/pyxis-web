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

interface ProviderProps {
  readonly locale: string;
  readonly messages: object;
  readonly children: ReactElement;
}

interface HtmlProps {
  readonly lang: string;
  readonly className: string;
  readonly 'data-theme'?: string;
  readonly children: ReactElement<{ children: ReactElement<ProviderProps> }>;
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
    expect(html.props.children.props.children.props.children).toBe(page);
  });

  it('gives the page the language of the request and only the messages the browser needs', async () => {
    const html = (await RootLayout({ children: null })) as ReactElement<HtmlProps>;
    const provider = html.props.children.props.children;

    expect(provider.props.locale).toBe(html.props.lang);
    expect(Object.keys(provider.props.messages)).toEqual(['funnelEditor']);
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

  it('names the app in the metadata', async () => {
    const metadata = await generateMetadata();

    expect(metadata.title).toEqual({ template: '%s · Pyxis', default: 'Pyxis' });
    expect(metadata.description).toMatch(/no cookies/);
    expect(metadata.openGraph).toMatchObject({ description: metadata.description });
    expect(metadata.twitter).toMatchObject({ description: metadata.description });
  });

  it('lets search engines index the live demo and names it in link previews', async () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');
    const metadata = await generateMetadata();

    expect(metadata.robots).toBeNull();
    expect(metadata.openGraph).toMatchObject({ siteName: 'Pyxis', title: 'Pyxis live demo' });
    expect(metadata.twitter).toMatchObject({
      card: 'summary_large_image',
      title: 'Pyxis live demo',
    });
  });

  it('keeps a dashboard with a real API out of search engines', async () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', 'https://api.pyxis.example.com');
    const metadata = await generateMetadata();

    expect(metadata.robots).toEqual({ index: false, follow: false });
    expect(metadata.openGraph).toMatchObject({ title: 'Pyxis' });
  });

  it('colours the browser bar with the chosen theme, or the system one', async () => {
    cookieStore.theme = 'dark';
    expect((await generateViewport()).themeColor).toBe('#0a1220');

    cookieStore.theme = undefined;
    expect((await generateViewport()).themeColor).toHaveLength(2);
  });
});
