import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { english } from '@/test-utils/english';
import { portuguese } from '@/test-utils/portuguese';
import { LandingProof } from './landing-proof';

describe('LandingProof', () => {
  it('states four facts, each linking to where it can be checked', () => {
    render(<LandingProof i18n={english} />);

    expect(
      screen.getAllByRole('link').map((link) => [link.textContent, link.getAttribute('href')]),
    ).toEqual([
      ['under 5 KB tracker, gzipped', 'https://github.com/samuelcsantana/pyxis-sdk'],
      [
        '0 runtime dependencies',
        'https://github.com/samuelcsantana/pyxis-sdk/blob/main/package.json',
      ],
      ['100% test coverage in all four repositories', 'https://app.codecov.io/gh/samuelcsantana'],
      [
        'MIT license, infrastructure included',
        'https://github.com/samuelcsantana/pyxis-api/blob/main/LICENSE',
      ],
    ]);
  });

  it('gives the size as a ceiling that does not age, in Brazilian Portuguese too', () => {
    render(<LandingProof i18n={portuguese} />);

    expect(screen.getByRole('link', { name: /menos de 5 KB/ })).toHaveAccessibleName(
      'menos de 5 KB de rastreador, com gzip',
    );
  });
});
