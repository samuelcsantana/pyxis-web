import {
  type AllowConnectionOutcome,
  CONNECTION_REQUEST_MINUTES,
  type ConnectionRequest,
  type DenyConnectionOutcome,
} from '@/domain/connection-requests';
import {
  connectionDecisionResponseSchema,
  connectionRequestResponseSchema,
} from '@/domain/connection-requests.schema';
import { DEMO_PROJECTS } from '../demo/demo-projects';
import type { IConnectionRequestsService } from './connection-requests-service.interface';

const MINUTE_MS = 60_000;

export const DEMO_CONNECTION_REQUEST_ID = '4d0f6b8c-5e7a-4f9b-8c4d-6e8f0a2b4c5d';
export const DEMO_LOOPBACK_CALLBACK = 'http://localhost:53682/callback';
const DEMO_STATE = 'demo-state';

export function demoConnectionRequestWire(now: Date) {
  return {
    id: DEMO_CONNECTION_REQUEST_ID,
    client: { name: 'Claude Code', host: 'claude.ai' },
    redirect: { host: 'localhost', loopback: true },
    scope: 'read',
    expires_at: new Date(now.getTime() + CONNECTION_REQUEST_MINUTES * MINUTE_MS).toISOString(),
    projects: DEMO_PROJECTS.map((project) => ({ id: project.id, name: project.name })),
    connection_limit_reached: false,
  };
}

export function demoConnectionDecisionWire(decision: 'approve' | 'deny') {
  const answer =
    decision === 'approve'
      ? new URLSearchParams({ code: 'demo-code', state: DEMO_STATE })
      : new URLSearchParams({ error: 'access_denied', state: DEMO_STATE });
  return { redirect_to: `${DEMO_LOOPBACK_CALLBACK}?${answer.toString()}` };
}

export class MockConnectionRequestsService implements IConnectionRequestsService {
  constructor(private readonly now: () => Date = () => new Date()) {}

  find(requestId: string): Promise<ConnectionRequest | null> {
    return Promise.resolve(
      requestId === DEMO_CONNECTION_REQUEST_ID
        ? connectionRequestResponseSchema.parse(demoConnectionRequestWire(this.now()))
        : null,
    );
  }

  allow(requestId: string): Promise<AllowConnectionOutcome> {
    return Promise.resolve(this.decide(requestId, 'approve'));
  }

  deny(requestId: string): Promise<DenyConnectionOutcome> {
    return Promise.resolve(this.decide(requestId, 'deny'));
  }

  private decide(requestId: string, decision: 'approve' | 'deny'): DenyConnectionOutcome {
    if (requestId !== DEMO_CONNECTION_REQUEST_ID) {
      return { kind: 'gone' };
    }
    return {
      kind: 'redirect',
      url: connectionDecisionResponseSchema.parse(demoConnectionDecisionWire(decision)),
    };
  }
}
