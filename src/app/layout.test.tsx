import type { ReactElement } from 'react';
import { describe, expect, it, vi } from 'vitest';
import RootLayout, { metadata } from './layout';

vi.mock('next/font/google', () => ({
  Geist: () => ({ variable: 'geist-sans-variable' }),
  Geist_Mono: () => ({ variable: 'geist-mono-variable' }),
}));

interface HtmlProps {
  readonly lang: string;
  readonly className: string;
  readonly children: ReactElement<{ children: ReactElement }>;
}

describe('RootLayout', () => {
  it('renders an English document with both font variables on <html>', () => {
    const page = <p>content</p>;
    const html = RootLayout({ children: page }) as ReactElement<HtmlProps>;

    expect(html.type).toBe('html');
    expect(html.props.lang).toBe('en');
    expect(html.props.className).toContain('geist-sans-variable');
    expect(html.props.className).toContain('geist-mono-variable');
    expect(html.props.children.props.children).toBe(page);
  });

  it('names the app in the metadata', () => {
    expect(metadata.title).toBe('Pyxis');
    expect(metadata.description).toMatch(/no cookies/);
  });
});
