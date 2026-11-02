export interface VisitorDay {
  readonly date: string;
  readonly firstVisit: number;
  readonly firstThisMonth: number;
  readonly firstToday: number;
  readonly againToday: number;
}

export interface VisitorMonth {
  readonly month: string;
  readonly firstVisit: number;
  readonly firstThisMonth: number;
  readonly exact: boolean;
}

export interface UniqueVisitors {
  readonly enabled: boolean;
  readonly daily: readonly VisitorDay[];
  readonly months: readonly VisitorMonth[];
}

export const NO_UNIQUE_VISITORS: UniqueVisitors = { enabled: false, daily: [], months: [] };
