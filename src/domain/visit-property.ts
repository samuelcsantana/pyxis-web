export const PROPERTY_SEPARATOR = '=';
export const MAX_PROPERTY_VALUE_LENGTH = 100;

const PROPERTY_KEY_PATTERN = /^[a-z0-9_]{1,40}$/;

export function isFilterableProperty(key: string, value: string): boolean {
  return (
    PROPERTY_KEY_PATTERN.test(key) && value.length > 0 && value.length <= MAX_PROPERTY_VALUE_LENGTH
  );
}

export function propertyFilterOf(key: string, value: string): string | null {
  return isFilterableProperty(key, value) ? `${key}${PROPERTY_SEPARATOR}${value}` : null;
}
