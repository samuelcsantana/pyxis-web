import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  contrastRatio,
  flatten,
  hexToRgb,
  MIN_NON_TEXT_CONTRAST,
  MIN_STATE_CHANGE,
  MIN_TEXT_CONTRAST,
  relativeLuminance,
  type Rgb,
} from '../../e2e/contrast';

const STYLESHEET = readFileSync(path.resolve(import.meta.dirname, '../app/globals.css'), 'utf8');
const TOKEN = /--pyx-([a-z-]+):\s*(#[0-9a-f]{6});/gi;

type Tokens = ReadonlyMap<string, string>;

function blockOf(selector: string): string {
  const start = STYLESHEET.indexOf(`${selector} {`);
  if (start === -1) {
    throw new Error(`globals.css has no "${selector}" block`);
  }
  return STYLESHEET.slice(start, STYLESHEET.indexOf('}', start));
}

function tokensIn(block: string): Tokens {
  return new Map(
    Array.from(block.matchAll(TOKEN), ([, name = '', value = '']) => [name, value] as const),
  );
}

function color(tokens: Tokens, name: string): Rgb {
  const value = tokens.get(name);
  if (value === undefined) {
    throw new Error(`globals.css defines no --pyx-${name}`);
  }
  return hexToRgb(value);
}

const LIGHT = tokensIn(blockOf(':root'));
const SYSTEM_DARK = tokensIn(blockOf(":root:not([data-theme='light'])"));
const CHOSEN_DARK = tokensIn(blockOf(":root[data-theme='dark']"));

const THEMES: Readonly<Record<string, Tokens>> = {
  light: LIGHT,
  'dark, from the system': new Map([...LIGHT, ...SYSTEM_DARK]),
  'dark, chosen': new Map([...LIGHT, ...CHOSEN_DARK]),
};

describe('contrast ratio', () => {
  it('measures black on white as 21:1 and a color on itself as 1:1', () => {
    expect(contrastRatio(hexToRgb('#000000'), hexToRgb('#ffffff'))).toBeCloseTo(21);
    expect(contrastRatio(hexToRgb('#a16207'), hexToRgb('#a16207'))).toBe(1);
  });

  it('gives the same ratio whichever color comes first', () => {
    const amber = hexToRgb('#f5b83d');
    const navy = hexToRgb('#0e1a2b');

    expect(contrastRatio(amber, navy)).toBe(contrastRatio(navy, amber));
  });

  it('rejects a color that is not written as #rrggbb', () => {
    expect(() => hexToRgb('amber')).toThrow(RangeError);
  });
});

describe('flattening the layers behind a ring', () => {
  it('reads white when nothing is painted', () => {
    expect(flatten([])).toEqual([255, 255, 255]);
  });

  it('lets an opaque layer hide everything beneath it', () => {
    expect(
      flatten([
        [14, 26, 43, 255],
        [255, 0, 0, 255],
      ]),
    ).toEqual([14, 26, 43]);
  });

  it('blends a translucent layer over what lies beneath it', () => {
    expect(
      flatten([
        [0, 0, 0, 51],
        [255, 255, 255, 255],
      ]),
    ).toEqual([204, 204, 204]);
  });
});

describe('dark theme tokens', () => {
  it('are the same whether the system or the theme toggle chose dark', () => {
    expect([...SYSTEM_DARK]).toEqual([...CHOSEN_DARK]);
  });
});

describe.each(Object.entries(THEMES))('focus rings in the %s theme', (_, tokens) => {
  it.each(['card', 'bg', 'soft'])('reach 3:1 against the %s surface', (surface) => {
    expect(contrastRatio(color(tokens, 'focus'), color(tokens, surface))).toBeGreaterThanOrEqual(
      MIN_NON_TEXT_CONTRAST,
    );
  });

  it.each(['nav', 'nav-raised'])('reach 3:1 in the sidebar, against %s', (surface) => {
    expect(contrastRatio(color(tokens, 'accent'), color(tokens, surface))).toBeGreaterThanOrEqual(
      MIN_NON_TEXT_CONTRAST,
    );
  });
});

describe('sidebar item states, the same in both themes', () => {
  const nav = (name: string) => color(LIGHT, name);

  it('get brighter from rest to hover to current', () => {
    const rest = relativeLuminance(nav('nav'));
    const hover = relativeLuminance(nav('nav-hover'));
    const current = relativeLuminance(nav('nav-active'));

    expect(rest).toBeLessThan(hover);
    expect(hover).toBeLessThan(current);
  });

  it.each([
    ['nav-hover', 'nav'],
    ['nav-hover', 'nav-raised'],
    ['nav-active', 'nav'],
    ['nav-active', 'nav-raised'],
  ])('change %s against %s enough to be seen', (state, rest) => {
    expect(contrastRatio(nav(state), nav(rest))).toBeGreaterThanOrEqual(MIN_STATE_CHANGE);
  });

  it.each([
    ['nav-text', 'nav-hover'],
    ['nav-text', 'nav-active'],
    ['nav-strong', 'nav-hover'],
    ['nav-strong', 'nav-active'],
  ])('keep %s readable on %s', (text, surface) => {
    expect(contrastRatio(nav(text), nav(surface))).toBeGreaterThanOrEqual(MIN_TEXT_CONTRAST);
  });

  it.each([
    ['nav-muted', 'nav-hover'],
    ['nav-muted', 'nav-active'],
    ['accent', 'nav-active'],
  ])('keep %s icons visible on %s', (icon, surface) => {
    expect(contrastRatio(nav(icon), nav(surface))).toBeGreaterThanOrEqual(MIN_NON_TEXT_CONTRAST);
  });
});
