import { describe, expect, it, vi } from 'vitest';
import {
  bestEffortEuroRates,
  EURO_REFERENCE_RATES_URL,
  EXCHANGE_RATES_REVALIDATE_SECONDS,
  EXCHANGE_RATES_TIMEOUT_MS,
  exchangeRatesUrl,
} from './landing-exchange-rates';

const SOURCE = 'https://rates.example.com/daily.xml';
const PUBLISHED = `<Cube time='2026-10-16'><Cube currency='USD' rate='1.1253'/><Cube currency='BRL' rate='5.7197'/></Cube>`;

function answering(body: string, status = 200) {
  return vi.fn(() => Promise.resolve(new Response(body, { status })));
}

describe('the exchange rates behind the approximate price', () => {
  it('reads the European Central Bank by default', () => {
    expect(EURO_REFERENCE_RATES_URL).toBe(
      'https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml',
    );
    expect(exchangeRatesUrl()).toBe(EURO_REFERENCE_RATES_URL);
  });

  it('reads another source when one is configured, and ignores a blank one', () => {
    vi.stubEnv('EXCHANGE_RATES_URL', ` ${SOURCE} `);
    expect(exchangeRatesUrl()).toBe(SOURCE);

    vi.stubEnv('EXCHANGE_RATES_URL', '  ');
    expect(exchangeRatesUrl()).toBe(EURO_REFERENCE_RATES_URL);
  });

  it('asks the source once a day and gives up after two seconds', async () => {
    const fetcher = answering(PUBLISHED);

    await expect(bestEffortEuroRates(SOURCE, fetcher)).resolves.toEqual({
      BRL: 5.7197,
      USD: 1.1253,
    });

    expect(fetcher).toHaveBeenCalledWith(SOURCE, {
      next: { revalidate: EXCHANGE_RATES_REVALIDATE_SECONDS },
      signal: expect.any(AbortSignal) as AbortSignal,
    });
    expect(EXCHANGE_RATES_REVALIDATE_SECONDS).toBe(86_400);
    expect(EXCHANGE_RATES_TIMEOUT_MS).toBe(2_000);
  });

  it('has no rates, and says why, when the source refuses, answers without them or is away', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    await expect(bestEffortEuroRates(SOURCE, answering('', 503))).resolves.toBe(undefined);
    await expect(bestEffortEuroRates(SOURCE, answering('<html></html>'))).resolves.toBe(undefined);
    await expect(
      bestEffortEuroRates(SOURCE, () => Promise.reject(new Error('timeout'))),
    ).resolves.toBe(undefined);

    expect(warn).toHaveBeenCalledWith(
      'exchange rates: the source answered 503, showing no approximate price',
    );
    expect(warn).toHaveBeenCalledWith(
      'exchange rates: the answer has no real or dollar rate, showing no approximate price',
    );
    expect(warn).toHaveBeenCalledTimes(3);
  });

  it('asks the configured source by default', async () => {
    vi.stubEnv('EXCHANGE_RATES_URL', SOURCE);
    const fetcher = vi.fn<typeof fetch>(() => Promise.resolve(new Response(PUBLISHED)));
    vi.stubGlobal('fetch', fetcher);

    await expect(bestEffortEuroRates()).resolves.toEqual({ BRL: 5.7197, USD: 1.1253 });
    expect(fetcher.mock.calls[0]?.[0]).toBe(SOURCE);
  });
});
