const CENTAVOS_PER_REAL = 100;
const CURRENCY = 'BRL';

export function refundAmount(locale: string, centavos: number): string {
  return new Intl.NumberFormat(locale, { style: 'currency', currency: CURRENCY }).format(
    centavos / CENTAVOS_PER_REAL,
  );
}
