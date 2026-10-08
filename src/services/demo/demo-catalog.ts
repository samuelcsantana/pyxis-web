import type { Channel } from '@/domain/acquisition';
import type { FunnelStep } from '@/domain/funnel';
import type { DemoVisit } from './demo-visits';

export interface DemoPage {
  readonly path: string;
  readonly perDay: number;
  readonly visitsPerView: number;
  readonly stage: number;
}

export interface DemoProperty {
  readonly key: string;
  readonly carriedShare: number;
  readonly values: readonly (readonly [value: string, share: number])[];
}

export interface DemoEvent {
  readonly name: string;
  readonly page: string;
  readonly perDay: number;
  readonly visitsPerCount: number;
  readonly properties: readonly DemoProperty[];
  readonly after?: string;
}

export type DemoStatusShare = readonly [status: number, share: number, errorCode?: string];

export interface DemoRoute {
  readonly method: string;
  readonly route: string;
  readonly perDay: number;
  readonly successStatus: number;
  readonly failures: readonly DemoStatusShare[];
  readonly medianDurationMs: number;
  readonly screens: readonly (readonly [path: string, share: number])[];
  readonly event?: string;
}

export interface DemoFailedRead {
  readonly route: string;
  readonly perDay: number;
  readonly statuses: readonly DemoStatusShare[];
  readonly medianDurationMs: number;
  readonly screens: readonly (readonly [path: string, share: number])[];
}

export interface DemoShare {
  readonly value: string;
  readonly share: number;
  readonly conversionWeight: number;
}

export interface DemoSource {
  readonly source: string;
  readonly medium: string | null;
  readonly channel: Channel;
  readonly share: number;
  readonly conversionWeight: number;
  readonly adClickShare: number;
  readonly campaigns: readonly (readonly [campaign: string, share: number])[];
}

export interface DemoProject {
  readonly id: string;
  readonly name: string;
  readonly timezone: string;
  readonly conversionEvent: string | null;
  readonly visitsPerPageView: number;
  readonly signedInStage: number | null;
  readonly people: number;
  readonly pages: readonly DemoPage[];
  readonly events: readonly DemoEvent[];
  readonly routes: readonly DemoRoute[];
  readonly failedReads: readonly DemoFailedRead[];
  readonly deviceTypes: readonly DemoShare[];
  readonly browsers: readonly DemoShare[];
  readonly operatingSystems: readonly DemoShare[];
  readonly countries: readonly DemoShare[];
  readonly channels: Readonly<Record<Channel, number>>;
  readonly sources: readonly DemoSource[];
  readonly exampleFunnel: readonly FunnelStep[];
  readonly person: string | null;
  readonly showcase: readonly DemoVisit[];
}

const EVEN_CONVERSION_WEIGHT = 1;

export function evenShares(
  entries: readonly (readonly [value: string, share: number])[],
): readonly DemoShare[] {
  return entries.map(([value, share]) => ({
    value,
    share,
    conversionWeight: EVEN_CONVERSION_WEIGHT,
  }));
}
