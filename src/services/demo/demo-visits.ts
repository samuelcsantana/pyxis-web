import type { Channel } from '@/domain/acquisition';

type Properties = Readonly<Record<string, string | number | boolean>>;

export interface DemoRequest {
  readonly method: string;
  readonly route: string;
  readonly status: number;
  readonly durationMs: number;
  readonly errorCode?: string;
}

export interface DemoNamedEvent {
  readonly second: number;
  readonly name: string;
  readonly path: string;
  readonly properties?: Properties;
}

export interface DemoRequestEvent {
  readonly second: number;
  readonly path: string;
  readonly request: DemoRequest;
}

export type DemoEvent = DemoNamedEvent | DemoRequestEvent;

export interface DemoVisit {
  readonly sessionId: string;
  readonly daysAgo: number;
  readonly startHour: number;
  readonly startMinute: number;
  readonly deviceType: string;
  readonly browser: string;
  readonly os: string;
  readonly country: string;
  readonly channel: Channel;
  readonly userId?: string;
  readonly events: readonly DemoEvent[];
}

export function request(second: number, path: string, demoRequest: DemoRequest): DemoRequestEvent {
  return { second, path, request: demoRequest };
}
