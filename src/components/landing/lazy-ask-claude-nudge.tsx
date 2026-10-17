'use client';

import dynamic from 'next/dynamic';

export const LazyAskClaudeNudge = dynamic(
  () => import('./ask-claude-nudge').then((module) => module.AskClaudeNudge),
  { ssr: false },
);
