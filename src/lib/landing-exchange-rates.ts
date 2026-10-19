import { type EuroRates, euroRatesOf } from '@/domain/approximate-price';

export const EURO_REFERENCE_RATES_URL =
  'https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml';
export const EXCHANGE_RATES_REVALIDATE_SECONDS = 86_400;
export const EXCHANGE_RATES_TIMEOUT_MS = 2_000;

type Fetcher = (
  input: string,
  init: RequestInit & { next?: { revalidate: number } },
) => Promise<Response>;

export function exchangeRatesUrl(): string {
  const configured = process.env.EXCHANGE_RATES_URL?.trim();
  return configured === undefined || configured === '' ? EURO_REFERENCE_RATES_URL : configured;
}

export async function bestEffortEuroRates(
  url: string = exchangeRatesUrl(),
  fetcher: Fetcher = fetch,
): Promise<EuroRates | undefined> {
  try {
    const response = await fetcher(url, {
      next: { revalidate: EXCHANGE_RATES_REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(EXCHANGE_RATES_TIMEOUT_MS),
    });
    if (!response.ok) {
      console.warn(
        `exchange rates: the source answered ${String(response.status)}, showing no approximate price`,
      );
      return undefined;
    }
    const rates = euroRatesOf(await response.text());
    if (rates === undefined) {
      console.warn(
        'exchange rates: the answer has no real or dollar rate, showing no approximate price',
      );
    }
    return rates;
  } catch (error) {
    console.warn('exchange rates: could not read them, showing no approximate price', error);
    return undefined;
  }
}
