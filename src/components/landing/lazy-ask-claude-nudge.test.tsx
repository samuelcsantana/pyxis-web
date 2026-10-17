import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { DeviceStore } from '@/lib/device-theme';
import { LazyAskClaudeNudge } from './lazy-ask-claude-nudge';

const LABELS = {
  label: 'News: Pyxis in Claude',
  badge: 'New',
  title: 'MCP access is here!',
  tips: ['Psst! Pyxis now answers right inside Claude.'],
  another: 'Another tip',
  cta: 'See how to connect',
  dismiss: 'Dismiss',
} as const;

const emptyStore: DeviceStore = { getItem: () => null, setItem: () => undefined };

describe('LazyAskClaudeNudge', () => {
  it('fetches the robot once the page runs, and it then arrives as usual', async () => {
    render(<LazyAskClaudeNudge labels={LABELS} store={() => emptyStore} arriveAfterMs={0} />);

    expect(
      await screen.findByRole('complementary', { name: 'News: Pyxis in Claude' }),
    ).toHaveTextContent('MCP access is here!');
  });
});
