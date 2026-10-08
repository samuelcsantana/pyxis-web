interface LanguageRange {
  readonly tag: string;
  readonly weight: number;
}

const WILDCARD = '*';
const WHITESPACE = /\s+/g;
const LANGUAGE_TAG = /^(?:[a-z]{1,8}(?:-[a-z\d]{1,8})*|\*)$/i;
const QUALITY = /^q=(?:0(?:\.\d{0,3})?|1(?:\.0{0,3})?)$/i;
const QUALITY_PREFIX_LENGTH = 'q='.length;
const FULL_WEIGHT = 1;

function parseWeight(parameter: string): number | undefined {
  return QUALITY.test(parameter) ? Number(parameter.slice(QUALITY_PREFIX_LENGTH)) : undefined;
}

function parseRange(entry: string): LanguageRange | undefined {
  const compact = entry.replace(WHITESPACE, '');
  const separator = compact.indexOf(';');
  const tag = separator === -1 ? compact : compact.slice(0, separator);
  const weight = separator === -1 ? FULL_WEIGHT : parseWeight(compact.slice(separator + 1));
  if (!LANGUAGE_TAG.test(tag) || weight === undefined || weight === 0) {
    return undefined;
  }
  return { tag, weight };
}

function isRange(range: LanguageRange | undefined): range is LanguageRange {
  return range !== undefined;
}

function primarySubtag(tag: string): string {
  const separator = tag.indexOf('-');
  return (separator === -1 ? tag : tag.slice(0, separator)).toLowerCase();
}

function matchRange<L extends string>(
  tag: string,
  supported: readonly L[],
  fallback: L,
): L | undefined {
  if (tag === WILDCARD) {
    return fallback;
  }
  const wanted = tag.toLowerCase();
  return (
    supported.find((locale) => locale.toLowerCase() === wanted) ??
    supported.find((locale) => primarySubtag(locale) === primarySubtag(wanted))
  );
}

export function negotiateLocale<L extends string>(
  acceptLanguage: string | null,
  supported: readonly L[],
  fallback: L,
): L {
  const ranges = (acceptLanguage ?? '')
    .split(',')
    .map(parseRange)
    .filter(isRange)
    .toSorted((first, second) => second.weight - first.weight);
  for (const range of ranges) {
    const match = matchRange(range.tag, supported, fallback);
    if (match !== undefined) {
      return match;
    }
  }
  return fallback;
}
