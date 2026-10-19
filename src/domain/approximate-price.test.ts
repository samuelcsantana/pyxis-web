import { describe, expect, it } from 'vitest';
import { LOCALES } from '@/i18n/locales';
import {
  approximatePricesOf,
  type EuroRates,
  euroRatesOf,
  PLAN_PRICE_IN_REAIS,
} from './approximate-price';

const REFERENCE_RATES_XML = `<?xml version="1.0" encoding="UTF-8"?>
<gesmes:Envelope xmlns:gesmes="http://www.gesmes.org/xml/2002-08-01" xmlns="http://www.ecb.int/vocabulary/2002-08-01/eurofxref">
  <gesmes:subject>Reference rates</gesmes:subject>
  <Cube>
    <Cube time='2026-10-16'>
      <Cube currency='USD' rate='1.1253'/>
      <Cube currency='GBP' rate='0.84385'/>
      <Cube currency='BRL' rate='5.7197'/>
    </Cube>
  </Cube>
</gesmes:Envelope>`;

const RATES: EuroRates = { BRL: 5.7197, USD: 1.1253 };

function withPlainSpaces(text: string): string {
  return text.replace(/\s/g, ' ');
}

function shown(prices: ReturnType<typeof approximatePricesOf>) {
  return prices === undefined
    ? undefined
    : { month: withPlainSpaces(prices.month), year: withPlainSpaces(prices.year) };
}

describe('the euro reference rates', () => {
  it('reads the real and the dollar per euro from the published rates', () => {
    expect(euroRatesOf(REFERENCE_RATES_XML)).toEqual(RATES);
  });

  it('reads rates quoted with double quotes too', () => {
    expect(
      euroRatesOf(`<Cube currency="BRL" rate="5.7"/><Cube currency="USD" rate="1.1"/>`),
    ).toEqual({ BRL: 5.7, USD: 1.1 });
  });

  it('has no rates when the real or the dollar is missing', () => {
    expect(euroRatesOf(REFERENCE_RATES_XML.replace("currency='BRL'", "currency='MXN'"))).toBe(
      undefined,
    );
    expect(euroRatesOf(REFERENCE_RATES_XML.replace("currency='USD'", "currency='CAD'"))).toBe(
      undefined,
    );
    expect(euroRatesOf('<html>Service unavailable</html>')).toBe(undefined);
  });

  it('has no rates when one of them is zero', () => {
    expect(euroRatesOf(REFERENCE_RATES_XML.replace("rate='5.7197'", "rate='0'"))).toBe(undefined);
  });
});

describe('the plan price in the reader’s currency', () => {
  it('keeps the plan priced at R$ 39 a month and R$ 390 a year', () => {
    expect(PLAN_PRICE_IN_REAIS).toEqual({ month: 39, year: 390 });
  });

  it('shows euros, in whole units, on the German, French, Italian and Dutch pages', () => {
    expect(shown(approximatePricesOf('de', RATES))).toEqual({ month: '7 €', year: '68 €' });
    expect(shown(approximatePricesOf('fr', RATES))).toEqual({ month: '7 €', year: '68 €' });
    expect(shown(approximatePricesOf('it', RATES))).toEqual({ month: '7 €', year: '68 €' });
    expect(shown(approximatePricesOf('nl', RATES))).toEqual({ month: '€ 7', year: '€ 68' });
  });

  it('shows US dollars on the English page, written so they are not taken for another dollar', () => {
    expect(shown(approximatePricesOf('en', RATES))).toEqual({ month: 'US$8', year: 'US$77' });
  });

  it('offers dollars or euros on the Spanish page, read in Spain and in Latin America', () => {
    expect(shown(approximatePricesOf('es', RATES))).toEqual({
      month: '8 US$ o 7 €',
      year: '77 US$ o 68 €',
    });
  });

  it('shows nothing on the Portuguese page, already in reais', () => {
    expect(approximatePricesOf('pt-BR', RATES)).toBe(undefined);
  });

  it('follows the rates of the day', () => {
    expect(shown(approximatePricesOf('de', { BRL: 4.875, USD: 1 }))).toEqual({
      month: '8 €',
      year: '80 €',
    });
  });

  it('has an approximation, or deliberately none, for every language the page ships', () => {
    const withPrices = LOCALES.filter((locale) => approximatePricesOf(locale, RATES) !== undefined);

    expect(withPrices).toEqual(['en', 'es', 'de', 'fr', 'it', 'nl']);
  });
});
