export type KeptParameters = Readonly<Record<string, string>>;

export const RANGE_NOTICE_ID = 'period-range-notice';

export function withKeptParameters(query: string, keep: KeptParameters): string {
  const parameters = new URLSearchParams(query);
  for (const [name, value] of Object.entries(keep)) {
    parameters.set(name, value);
  }
  return parameters.toString();
}
