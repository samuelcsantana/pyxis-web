import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DEFAULT_LANDING_PAGE, landingPageOfLocale } from '@/lib/landing-pages';
import { english } from '@/test-utils/english';
import { portuguese } from '@/test-utils/portuguese';
import {
  jsonForScript,
  LandingStructuredData,
  softwareApplicationOf,
} from './landing-structured-data';

describe('LandingStructuredData', () => {
  it('describes Pyxis as free, MIT-licensed web software with its repositories', () => {
    expect(softwareApplicationOf(english, DEFAULT_LANDING_PAGE, 'trial')).toMatchObject({
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'Pyxis',
      url: 'https://pyxis-analytics.dev/',
      inLanguage: 'en',
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Web',
      license: 'https://opensource.org/licenses/MIT',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      sameAs: [
        'https://github.com/samuelcsantana/pyxis-api',
        'https://github.com/samuelcsantana/pyxis-sdk',
        'https://github.com/samuelcsantana/pyxis-web',
        'https://www.npmjs.com/package/pyxis-analytics',
      ],
    });
  });

  it('describes the Portuguese page in Portuguese, at its own address', () => {
    const data = softwareApplicationOf(portuguese, landingPageOfLocale('pt-BR'), 'byInvitation');

    expect(data.url).toBe('https://pyxis-analytics.dev/pt-br');
    expect(data.inLanguage).toBe('pt-BR');
    expect(data.description).toContain('sem dado pessoal');
  });

  it('describes the free plan instead of the trial once it is open', () => {
    expect(softwareApplicationOf(english, DEFAULT_LANDING_PAGE, 'trial').description).toMatch(
      /14 days free\.$/,
    );
    expect(softwareApplicationOf(english, DEFAULT_LANDING_PAGE, 'free').description).toMatch(
      /Free up to 10,000 events a month\.$/,
    );
  });

  it('never lets a value close the script it is written into', () => {
    expect(jsonForScript({ text: '</script><b>' })).toBe('{"text":"\\u003c/script>\\u003cb>"}');
  });

  it('writes the description into a structured-data script', () => {
    const { container } = render(
      <LandingStructuredData i18n={english} page={DEFAULT_LANDING_PAGE} offer="trial" />,
    );

    const script = container.querySelector('script');
    expect(script).toHaveAttribute('type', 'application/ld+json');
    expect(JSON.parse(script?.textContent ?? '{}')).toMatchObject({ name: 'Pyxis' });
  });
});
