const SAMPLE = 1234.5;

function separator(locale: string, type: 'group' | 'decimal'): string {
  return (
    new Intl.NumberFormat(locale).formatToParts(SAMPLE).find((part) => part.type === type)?.value ??
    ''
  );
}

export function parseCount(text: string | null, locale: string): number {
  const group = separator(locale, 'group');
  const decimal = separator(locale, 'decimal');
  const digits = (text ?? '').trim().replaceAll(group, '').replace(decimal, '.');
  return digits === '' ? Number.NaN : Number(digits);
}
