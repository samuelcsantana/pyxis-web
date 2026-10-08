export const PLURAL_CATEGORIES = ['zero', 'one', 'two', 'few', 'many', 'other'] as const;
export type PluralCategory = (typeof PLURAL_CATEGORIES)[number];

export type PluralForms = { readonly other: string } & Partial<
  Readonly<Record<Exclude<PluralCategory, 'other'>, string>>
>;

export function plural(locale: string, count: number, forms: PluralForms): string {
  if (count === 0 && forms.zero !== undefined) {
    return forms.zero;
  }
  return forms[new Intl.PluralRules(locale).select(count)] ?? forms.other;
}
