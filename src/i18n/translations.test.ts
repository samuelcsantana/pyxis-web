import { describe, expect, it } from 'vitest';
import { en } from './messages/en';
import { ptBR } from './messages/pt-BR';
import { PLURAL_CATEGORIES, type PluralForms } from './plural';
import type { Dictionary, Message } from './translate';

const PLACEHOLDER = /\{([^{}]+)\}/g;
const TAG = /<\/?([a-z]+)\/?>/gi;

type Node = Message | Dictionary;

const TRANSLATIONS: readonly (readonly [string, Dictionary])[] = [['pt-BR', ptBR]];

function isPluralForms(node: Node): node is PluralForms {
  return (
    typeof node === 'object' &&
    typeof node.other === 'string' &&
    Object.keys(node).every((key) => PLURAL_CATEGORIES.some((category) => category === key))
  );
}

function leaves(node: Node, path = ''): readonly (readonly [string, Message])[] {
  if (typeof node === 'string' || isPluralForms(node)) {
    return [[path, node]];
  }
  return Object.entries(node).flatMap(([key, child]) =>
    leaves(child, path === '' ? key : `${path}.${key}`),
  );
}

function texts(message: Message): readonly string[] {
  return typeof message === 'string' ? [message] : Object.values(message);
}

function names(message: Message, pattern: RegExp): readonly string[] {
  const found = texts(message).flatMap((text) =>
    [...text.matchAll(pattern)].map((match) => match[1] ?? ''),
  );
  return [...new Set(found)].toSorted();
}

const SOURCE = new Map(leaves(en));

describe.each(TRANSLATIONS)('the %s dictionary', (locale, dictionary) => {
  const translated = leaves(dictionary);
  const categories = new Intl.PluralRules(locale).resolvedOptions().pluralCategories;

  it('has exactly the keys of the English dictionary', () => {
    expect(translated.map(([key]) => key).toSorted()).toEqual([...SOURCE.keys()].toSorted());
  });

  it.each(translated)('keeps the placeholders and tags of %s', (key, message) => {
    const source = SOURCE.get(key) ?? '';

    expect(names(message, PLACEHOLDER)).toEqual(names(source, PLACEHOLDER));
    expect(names(message, TAG)).toEqual(names(source, TAG));
    expect(texts(message).every((text) => text.trim() !== '')).toBe(true);
  });

  it('gives every counted message a form for each plural category of the language', () => {
    const plurals = translated.flatMap(([key, message]) =>
      typeof message === 'string' ? [] : [[key, message] as const],
    );
    const incomplete = plurals
      .filter(([, forms]) => !categories.every((category) => Object.hasOwn(forms, category)))
      .map(([key]) => key);

    expect(plurals.length).toBeGreaterThan(0);
    expect(incomplete).toEqual([]);
  });
});
