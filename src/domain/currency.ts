export const DEFAULT_CURRENCY = 'BRL';

export const PROJECT_CURRENCIES = [
  'BRL',
  'USD',
  'EUR',
  'GBP',
  'ARS',
  'CLP',
  'COP',
  'MXN',
  'PEN',
  'UYU',
  'PYG',
  'BOB',
  'CAD',
  'AUD',
  'CHF',
  'JPY',
  'CNY',
  'INR',
] as const;

export const CURRENCY_CODE_PATTERN = /^[A-Z]{3}$/;

export function currencyChoices(current: string): readonly string[] {
  return PROJECT_CURRENCIES.some((code) => code === current)
    ? PROJECT_CURRENCIES
    : [...PROJECT_CURRENCIES, current];
}

export interface CurrencyOption {
  readonly code: string;
  readonly label: string;
}

export function currencyLabel(code: string, nameOf: (code: string) => string): string {
  return `${code} · ${nameOf(code)}`;
}

export function currencyOptions(
  current: string,
  nameOf: (code: string) => string,
): readonly CurrencyOption[] {
  return currencyChoices(current).map((code) => ({ code, label: currencyLabel(code, nameOf) }));
}

export function projectCurrency(project: { readonly currency?: string }): string {
  return project.currency ?? DEFAULT_CURRENCY;
}
