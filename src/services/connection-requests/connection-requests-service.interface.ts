import type {
  AllowConnectionOutcome,
  ConnectionRequest,
  DenyConnectionOutcome,
} from '@/domain/connection-requests';

export interface IConnectionRequestsService {
  find(requestId: string): Promise<ConnectionRequest | null>;
  allow(requestId: string): Promise<AllowConnectionOutcome>;
  deny(requestId: string): Promise<DenyConnectionOutcome>;
}
