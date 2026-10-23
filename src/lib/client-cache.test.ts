import { describe, expect, it } from 'vitest';
import nextConfig from '../../next.config';
import { VISITED_SCREEN_CACHE_SECONDS } from './client-cache';

describe('the client cache of visited screens', () => {
  it('keeps a visited screen for five minutes, so going back to it needs no skeleton', () => {
    expect(VISITED_SCREEN_CACHE_SECONDS).toBe(300);
    expect(nextConfig.experimental?.staleTimes).toEqual({ dynamic: VISITED_SCREEN_CACHE_SECONDS });
  });
});
