const AFTER_SEPARATOR = /(?<=[/_.\-=:])/;
const AFTER_SLASH = /(?<=\/)/;

function segmentsAfter(separator: RegExp, text: string): readonly string[] {
  return text.split(separator).filter((segment) => segment !== '');
}

export function identifierSegments(text: string): readonly string[] {
  return segmentsAfter(AFTER_SEPARATOR, text);
}

export function slashSegments(text: string): readonly string[] {
  return segmentsAfter(AFTER_SLASH, text);
}
