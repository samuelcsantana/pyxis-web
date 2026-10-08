import { PLURAL_CATEGORIES, type PluralCategory, type PluralForms, plural } from './plural';

export type Message = string | PluralForms;

export interface Dictionary {
  readonly [key: string]: Message | Dictionary;
}

type IsPluralForms<Value> = Value extends PluralForms
  ? [Exclude<keyof Value, PluralCategory>] extends [never]
    ? true
    : false
  : false;

type IsMessage<Value> = Value extends string ? true : IsPluralForms<Value>;

export type MessageKey<Messages> = {
  [Key in keyof Messages & string]: IsMessage<Messages[Key]> extends true
    ? Key
    : `${Key}.${MessageKey<Messages[Key]>}`;
}[keyof Messages & string];

export type MessageAt<Messages, Key extends string> = Key extends `${infer Head}.${infer Rest}`
  ? Head extends keyof Messages
    ? MessageAt<Messages[Head], Rest>
    : never
  : Key extends keyof Messages
    ? Messages[Key]
    : never;

export type Placeholders<Text> = Text extends `${string}{${infer Name}}${infer Rest}`
  ? Name | Placeholders<Rest>
  : never;

type MessagePlaceholders<Value> = Value extends string
  ? Placeholders<Value>
  : Placeholders<Value[keyof Value]>;

type Values<Value> = Value extends string
  ? Readonly<Record<Placeholders<Value>, string>>
  : { readonly count: number } & Readonly<
      Record<Exclude<MessagePlaceholders<Value>, 'count'>, string>
    >;

type Arguments<Value> = Value extends string
  ? [Placeholders<Value>] extends [never]
    ? []
    : [values: Values<Value>]
  : [values: Values<Value>];

export type Translator<Messages> = <Key extends MessageKey<Messages>>(
  key: Key,
  ...values: Arguments<MessageAt<Messages, Key>>
) => string;

export type Widen<Messages> = {
  readonly [Key in keyof Messages]: Messages[Key] extends string
    ? string
    : IsPluralForms<Messages[Key]> extends true
      ? { readonly [Category in keyof Messages[Key]]: string }
      : Widen<Messages[Key]>;
};

type SameUnion<First, Second> = [First] extends [Second]
  ? [Second] extends [First]
    ? true
    : false
  : false;

type MessageParity<Source, Translation> =
  IsMessage<Translation> extends true
    ? Source extends string
      ? Translation extends string
        ? SameUnion<Placeholders<Source>, Placeholders<Translation>> extends true
          ? Translation
          : never
        : never
      : Translation extends string
        ? never
        : SameUnion<MessagePlaceholders<Source>, MessagePlaceholders<Translation>> extends true
          ? Translation
          : never
    : never;

export type Parity<Source, Translation> = {
  readonly [Key in keyof Source]: Key extends keyof Translation
    ? IsMessage<Source[Key]> extends true
      ? MessageParity<Source[Key], Translation[Key]>
      : Parity<Source[Key], Translation[Key]>
    : Source[Key];
} & { readonly [Key in Exclude<keyof Translation, keyof Source>]: never };

type Node = Message | Dictionary;

const PLACEHOLDER = /\{([^{}]+)\}/g;

function isPluralForms(node: PluralForms | Dictionary): node is PluralForms {
  return (
    typeof node.other === 'string' &&
    Object.keys(node).every((key) => PLURAL_CATEGORIES.some((category) => category === key))
  );
}

function child(node: Node | undefined, key: string): Node | undefined {
  if (node === undefined || typeof node === 'string' || isPluralForms(node)) {
    return undefined;
  }
  return Object.hasOwn(node, key) ? node[key] : undefined;
}

export function lookup(messages: Dictionary, key: string): Message {
  const found = key.split('.').reduce<Node | undefined>(child, messages);
  if (found === undefined || (typeof found === 'object' && !isPluralForms(found))) {
    throw new Error(`No message is defined for "${key}".`);
  }
  return found;
}

function interpolate(
  key: string,
  template: string,
  values: Readonly<Record<string, string>>,
): string {
  return template.replace(PLACEHOLDER, (_placeholder, name: string) => {
    const value = values[name];
    if (value === undefined) {
      throw new Error(`The message "${key}" needs a value for {${name}}.`);
    }
    return value;
  });
}

export function translate(
  messages: Dictionary,
  locale: string,
  key: string,
  values: Readonly<Record<string, string | number>> = {},
): string {
  const message = lookup(messages, key);
  const texts = Object.fromEntries(
    Object.entries(values).map(([name, value]) => [name, String(value)]),
  );
  if (typeof message === 'string') {
    return interpolate(key, message, texts);
  }
  const { count } = values;
  if (typeof count !== 'number') {
    throw new Error(`The message "${key}" needs a numeric count.`);
  }
  const countText = new Intl.NumberFormat(locale).format(count);
  return interpolate(key, plural(locale, count, message), { ...texts, count: countText });
}

export function createTranslator<Messages>(
  messages: Widen<Messages> & Dictionary,
  locale: string,
): Translator<Messages> {
  return (key: string, values?: Readonly<Record<string, string | number>>) =>
    translate(messages, locale, key, values);
}
