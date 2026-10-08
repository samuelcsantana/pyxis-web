const AFTER_SEPARATOR = /(?<=[/_.\-=:])/;

export function identifierSegments(text: string): readonly string[] {
  return text.split(AFTER_SEPARATOR).filter((segment) => segment !== '');
}
