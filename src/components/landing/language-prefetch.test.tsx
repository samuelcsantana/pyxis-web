import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DEFAULT_LANDING_PAGE, landingPageOfLocale } from '@/lib/landing-pages';
import { LanguagePrefetch, languagePrefetchRulesOf } from './language-prefetch';

describe('languagePrefetchRulesOf', () => {
  it('fetches every other language as soon as the page loads, never the current one', () => {
    expect(languagePrefetchRulesOf(DEFAULT_LANDING_PAGE)).toEqual({
      prefetch: [{ urls: ['/pt-br', '/es'], eagerness: 'immediate' }],
    });
    expect(languagePrefetchRulesOf(landingPageOfLocale('es'))).toEqual({
      prefetch: [{ urls: ['/', '/pt-br'], eagerness: 'immediate' }],
    });
  });
});

describe('LanguagePrefetch', () => {
  it('writes the rules in a speculation-rules script that carries the nonce', () => {
    const { container } = render(
      <LanguagePrefetch current={landingPageOfLocale('pt-BR')} nonce="bm9uY2U=" />,
    );
    const script = container.querySelector('script');

    expect(script).toHaveAttribute('type', 'speculationrules');
    expect(script).toHaveAttribute('nonce', 'bm9uY2U=');
    expect(JSON.parse(script?.textContent ?? '{}')).toEqual(
      languagePrefetchRulesOf(landingPageOfLocale('pt-BR')),
    );
  });
});
