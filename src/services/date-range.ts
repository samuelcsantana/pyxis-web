export interface DateRange {
  readonly from: string;
  readonly to: string;
}

export function rangeQuery(range: DateRange): string {
  return new URLSearchParams({ from: range.from, to: range.to }).toString();
}
