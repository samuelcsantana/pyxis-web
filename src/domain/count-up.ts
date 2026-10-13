const FIRST_DIGIT = /\d/;
const DIGIT_OR_SEPARATOR = /[\d.,]/;

export interface NumberParts {
  readonly prefix: string;
  readonly value: number;
  readonly decimals: number;
  readonly suffix: string;
}

function decimalSeparatorOf(locale: string): string {
  return new Intl.NumberFormat(locale).format(1.5).charAt(1);
}

function groupSeparatorOf(locale: string): string {
  return new Intl.NumberFormat(locale).format(1_000).charAt(1);
}

function endOfNumber(text: string, start: number): number {
  let end = start;
  while (end < text.length && DIGIT_OR_SEPARATOR.test(text.charAt(end))) {
    end += 1;
  }
  return end;
}

export function numberPartsOf(text: string, locale: string): NumberParts | null {
  const start = text.search(FIRST_DIGIT);
  if (start < 0) {
    return null;
  }
  const end = endOfNumber(text, start);
  const digits = text.slice(start, end);
  const point = digits.indexOf(decimalSeparatorOf(locale));
  const whole = (point < 0 ? digits : digits.slice(0, point)).replaceAll(
    groupSeparatorOf(locale),
    '',
  );
  const fraction = point < 0 ? '' : digits.slice(point + 1);
  const value = Number(`${whole}.${fraction}`);
  if (!Number.isFinite(value)) {
    return null;
  }
  return {
    prefix: text.slice(0, start),
    value,
    decimals: fraction.length,
    suffix: text.slice(end),
  };
}

export function countFrame(text: string, progress: number, locale: string): string {
  const parts = numberPartsOf(text, locale);
  if (parts === null || progress >= 1) {
    return text;
  }
  const shown = new Intl.NumberFormat(locale, {
    minimumFractionDigits: parts.decimals,
    maximumFractionDigits: parts.decimals,
  }).format(parts.value * Math.max(0, progress));
  return `${parts.prefix}${shown}${parts.suffix}`;
}

export function easeOut(progress: number): number {
  return 1 - (1 - progress) ** 3;
}
