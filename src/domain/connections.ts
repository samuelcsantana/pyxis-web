export interface ConnectedApp {
  readonly id: string;
  readonly client: { readonly name: string; readonly host: string };
  readonly createdAt: string;
  readonly lastUsedAt: string;
}

export interface ConnectedApps {
  readonly connectorUrl: string | null;
  readonly connections: readonly ConnectedApp[];
}

export function claudeCodeCommand(connectorUrl: string): string {
  return `claude mcp add --transport http pyxis ${connectorUrl}`;
}
