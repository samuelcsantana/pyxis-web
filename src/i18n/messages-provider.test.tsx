import { render, renderHook, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { renderWithMessages } from '@/test-utils/render-with-messages';
import { CLIENT_NAMESPACES, pickNamespaces } from './messages';
import { en } from './messages/en';
import { MessagesProvider, useLocale, useT } from './messages-provider';

function LanguageProbe() {
  const t = useT();
  return (
    <p>
      {useLocale()} {typeof t}
    </p>
  );
}

describe('MessagesProvider', () => {
  it('gives client components the language and a translator', () => {
    render(
      <MessagesProvider locale="en" messages={pickNamespaces(en, CLIENT_NAMESPACES)}>
        <LanguageProbe />
      </MessagesProvider>,
    );

    expect(screen.getByText('en function')).toBeInTheDocument();
  });

  it('is what renderWithMessages wraps around a component, in English by default', () => {
    renderWithMessages(<LanguageProbe />);
    expect(screen.getByText('en function')).toBeInTheDocument();
  });

  it('lets a test pick the language of renderWithMessages', () => {
    renderWithMessages(<LanguageProbe />, 'en');
    expect(screen.getByText('en function')).toBeInTheDocument();
  });

  it('throws when a hook is used outside the provider', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const message = 'useT and useLocale need a MessagesProvider above them.';

    expect(() => renderHook(() => useT())).toThrow(message);
    expect(() => renderHook(() => useLocale())).toThrow(message);
  });
});
