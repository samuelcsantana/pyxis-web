import type { Locale } from '@/i18n/locales';

export type PlanInterval = 'month' | 'year';
export type ApproximateCurrency = 'EUR' | 'USD';

export interface EuroRates {
  readonly BRL: number;
  readonly USD: number;
}

export type ApproximatePrices = Readonly<Record<PlanInterval, string>>;

interface ApproximatePriceFormat {
  readonly tag: string;
  readonly currencies: readonly ApproximateCurrency[];
}

export const PLAN_PRICE_IN_REAIS: Readonly<Record<PlanInterval, number>> = {
  month: 39,
  year: 390,
};

const APPROXIMATE_PRICE_FORMATS: Readonly<Record<Locale, ApproximatePriceFormat>> = {
  en: { tag: 'en-GB', currencies: ['USD'] },
  'pt-BR': { tag: 'pt-BR', currencies: [] },
  es: { tag: 'es', currencies: ['USD', 'EUR'] },
  de: { tag: 'de', currencies: ['EUR'] },
  fr: { tag: 'fr', currencies: ['EUR'] },
  it: { tag: 'it', currencies: ['EUR'] },
  nl: { tag: 'nl', currencies: ['EUR'] },
};

const EURO_RATE_ENTRY = /currency=['"]([A-Z]{3})['"]\s+rate=['"](\d+(?:\.\d+)?)['"]/g;

function positiveRate(value: string | undefined): number | undefined {
  const rate = Number(value);
  return Number.isFinite(rate) && rate > 0 ? rate : undefined;
}

export function euroRatesOf(referenceRatesXml: string): EuroRates | undefined {
  const published = new Map(
    Array.from(referenceRatesXml.matchAll(EURO_RATE_ENTRY), ([, currency, rate]) => [
      currency,
      rate,
    ]),
  );
  const BRL = positiveRate(published.get('BRL'));
  const USD = positiveRate(published.get('USD'));
  return BRL === undefined || USD === undefined ? undefined : { BRL, USD };
}

function perEuro(currency: ApproximateCurrency, rates: EuroRates): number {
  return currency === 'EUR' ? 1 : rates[currency];
}

function amountsOf(
  reais: number,
  rates: EuroRates,
  { tag, currencies }: ApproximatePriceFormat,
): string {
  const amounts = currencies.map((currency) =>
    new Intl.NumberFormat(tag, {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format((reais / rates.BRL) * perEuro(currency, rates)),
  );
  return new Intl.ListFormat(tag, { type: 'disjunction' }).format(amounts);
}

export function approximatePricesOf(
  locale: Locale,
  rates: EuroRates,
): ApproximatePrices | undefined {
  const format = APPROXIMATE_PRICE_FORMATS[locale];
  if (format.currencies.length === 0) {
    return undefined;
  }
  return {
    month: amountsOf(PLAN_PRICE_IN_REAIS.month, rates, format),
    year: amountsOf(PLAN_PRICE_IN_REAIS.year, rates, format),
  };
}
