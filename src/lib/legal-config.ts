export const TERMS_VERSION = '1.4';

export interface Seller {
  readonly name: string;
  readonly taxId: string;
  readonly address: string;
}

export interface LegalConfig {
  readonly seller: Seller;
  readonly effectiveFrom: string | null;
}

type Environment = Readonly<Record<string, string | undefined>>;

const CALENDAR_DATE = /^\d{4}-\d{2}-\d{2}$/;

function filled(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed === undefined || trimmed === '' ? undefined : trimmed;
}

function calendarDateOf(value: string | undefined): string | null {
  const date = filled(value);
  if (date === undefined || !CALENDAR_DATE.test(date)) {
    return null;
  }
  return new Date(`${date}T00:00:00Z`).toISOString().startsWith(date) ? date : null;
}

export function legalConfigOf(environment: Environment): LegalConfig | null {
  const name = filled(environment.SELLER_NAME);
  const taxId = filled(environment.SELLER_TAX_ID);
  const address = filled(environment.SELLER_ADDRESS);
  if (name === undefined || taxId === undefined || address === undefined) {
    return null;
  }
  return {
    seller: { name, taxId, address },
    effectiveFrom: calendarDateOf(environment.TERMS_EFFECTIVE_DATE),
  };
}

export function legalConfig(): LegalConfig | null {
  return legalConfigOf(process.env);
}
