import { describe, expect, expectTypeOf, it } from 'vitest';
import {
  createTranslator,
  lookup,
  type MessageKey,
  type Parity,
  type Placeholders,
  translate,
  type Widen,
} from './translate';

const SOURCE = {
  overview: {
    title: 'Overview',
    subtitle: 'Traffic of {project}',
    visits: { one: '{count} visit', other: '{count} visits' },
    visitsIn: {
      zero: 'No visits in {period}',
      one: '{count} visit in {period}',
      other: '{count} visits in {period}',
    },
  },
  filters: { other: 'Other values', more: 'More filters' },
} as const;

type Source = typeof SOURCE;

interface Complete {
  readonly overview: {
    readonly title: 'Summary';
    readonly subtitle: 'Visits to {project}';
    readonly visits: {
      readonly one: '{count} session';
      readonly many: '{count} of sessions';
      readonly other: '{count} sessions';
    };
    readonly visitsIn: {
      readonly one: '{count} session in {period}';
      readonly other: '{count} sessions in {period}';
    };
  };
  readonly filters: { readonly other: 'Others'; readonly more: 'Extra filters' };
}

type Overview = Complete['overview'];

interface MissingKey {
  readonly overview: Overview;
  readonly filters: { readonly other: 'Others' };
}

interface ExtraKey {
  readonly overview: Overview & { readonly legend: 'Legend' };
  readonly filters: Complete['filters'];
}

interface DroppedPlaceholder {
  readonly overview: Omit<Overview, 'subtitle'> & { readonly subtitle: 'Visits' };
  readonly filters: Complete['filters'];
}

interface InventedPlaceholder {
  readonly overview: Omit<Overview, 'title'> & { readonly title: 'Summary of {project}' };
  readonly filters: Complete['filters'];
}

interface PluralAsText {
  readonly overview: Omit<Overview, 'visits'> & { readonly visits: 'Sessions' };
  readonly filters: Complete['filters'];
}

const t = createTranslator<Source>(SOURCE, 'en');

describe('createTranslator', () => {
  it('returns a plain message', () => {
    expect(t('overview.title')).toBe('Overview');
  });

  it('fills the named placeholders', () => {
    expect(t('overview.subtitle', { project: 'Demo Store' })).toBe('Traffic of Demo Store');
  });

  it('picks the plural form and writes the count in the language', () => {
    expect(t('overview.visits', { count: 1 })).toBe('1 visit');
    expect(t('overview.visits', { count: 1234 })).toBe('1,234 visits');
    expect(createTranslator<Source>(SOURCE, 'pt-BR')('overview.visits', { count: 2697 })).toBe(
      '2.697 visits',
    );
  });

  it('uses the exact-zero form and fills the other placeholders of a plural', () => {
    expect(t('overview.visitsIn', { count: 0, period: 'the last 7 days' })).toBe(
      'No visits in the last 7 days',
    );
    expect(t('overview.visitsIn', { count: 3, period: 'the last 7 days' })).toBe(
      '3 visits in the last 7 days',
    );
  });

  it('reads a key named like a plural category inside a namespace', () => {
    expect(t('filters.other')).toBe('Other values');
  });

  it('types the key and the values each message needs', () => {
    expectTypeOf<MessageKey<Source>>().toEqualTypeOf<
      | 'overview.title'
      | 'overview.subtitle'
      | 'overview.visits'
      | 'overview.visitsIn'
      | 'filters.other'
      | 'filters.more'
    >();
    expectTypeOf<Placeholders<'{count} visits in {period}'>>().toEqualTypeOf<'count' | 'period'>();
    expectTypeOf<Parameters<typeof t<'overview.title'>>>().toEqualTypeOf<['overview.title']>();
    expectTypeOf<{ project: string }>().toExtend<Parameters<typeof t<'overview.subtitle'>>[1]>();
    expectTypeOf<{ count: number; period: string }>().toExtend<
      Parameters<typeof t<'overview.visitsIn'>>[1]
    >();
    expectTypeOf<{ period: string }>().not.toExtend<Parameters<typeof t<'overview.visitsIn'>>[1]>();
    expectTypeOf<Widen<Source>['overview']['title']>().toEqualTypeOf<string>();
  });
});

describe('Parity', () => {
  it('accepts a translation with the same keys and placeholders', () => {
    expectTypeOf<Complete>().toExtend<Parity<Source, Complete>>();
  });

  it('rejects a translation that misses or adds a key', () => {
    expectTypeOf<MissingKey>().not.toExtend<Parity<Source, MissingKey>>();
    expectTypeOf<ExtraKey>().not.toExtend<Parity<Source, ExtraKey>>();
  });

  it('rejects a translation that drops or invents a placeholder', () => {
    expectTypeOf<DroppedPlaceholder>().not.toExtend<Parity<Source, DroppedPlaceholder>>();
    expectTypeOf<InventedPlaceholder>().not.toExtend<Parity<Source, InventedPlaceholder>>();
  });

  it('rejects a translation that turns a plural message into plain text', () => {
    expectTypeOf<PluralAsText>().not.toExtend<Parity<Source, PluralAsText>>();
  });
});

describe('lookup', () => {
  it('finds a message by its dotted key', () => {
    expect(lookup(SOURCE, 'overview.visits')).toEqual(SOURCE.overview.visits);
  });

  it.each([
    ['a key that does not exist', 'overview.legend'],
    ['a namespace', 'overview'],
    ['a key below a message', 'overview.title.short'],
    ['a key below plural forms', 'overview.visits.one'],
    ['a key below a missing namespace', 'sidebar.title'],
    ['an inherited property', 'toString'],
  ])('throws for %s', (_case, key) => {
    expect(() => lookup(SOURCE, key)).toThrow(`No message is defined for "${key}".`);
  });
});

describe('translate', () => {
  it('needs no values for a message without placeholders', () => {
    expect(translate(SOURCE, 'en', 'overview.title')).toBe('Overview');
  });

  it('throws when a placeholder has no value', () => {
    expect(() => translate(SOURCE, 'en', 'overview.subtitle', {})).toThrow(
      'The message "overview.subtitle" needs a value for {project}.',
    );
  });

  it('throws when a plural message gets no numeric count', () => {
    expect(() => translate(SOURCE, 'en', 'overview.visits')).toThrow(
      'The message "overview.visits" needs a numeric count.',
    );
    expect(() => translate(SOURCE, 'en', 'overview.visits', { count: '3' })).toThrow(
      'The message "overview.visits" needs a numeric count.',
    );
  });
});
